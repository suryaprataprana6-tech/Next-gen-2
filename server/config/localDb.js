import fs from "fs";
import path from "path";
import bcrypt from "bcryptjs";
import mongoose from "mongoose";

const DATA_DIR = path.join(process.cwd(), "data");

function ensureDataDirectory() {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
}

function getFilePath(collectionName) {
  ensureDataDirectory();
  return path.join(DATA_DIR, `${collectionName}.json`);
}

function readCollection(collectionName) {
  const filePath = getFilePath(collectionName);
  if (!fs.existsSync(filePath)) {
    return [];
  }
  try {
    const data = fs.readFileSync(filePath, "utf-8");
    return JSON.parse(data);
  } catch (err) {
    console.error(`Error reading collection ${collectionName}:`, err);
    return [];
  }
}

function writeCollection(collectionName, data) {
  const filePath = getFilePath(collectionName);
  try {
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2), "utf-8");
  } catch (err) {
    console.error(`Error writing collection ${collectionName}:`, err);
  }
}

function generateId() {
  return Array.from({ length: 24 }, () => Math.floor(Math.random() * 16).toString(16)).join("");
}

function matchQuery(doc, query) {
  if (!query) return true;
  for (const [key, value] of Object.entries(query)) {
    if (value && typeof value === "object" && !Array.isArray(value) && !(value instanceof Date)) {
      // It's a query operator like { $gte: start, $lt: end }
      const docVal = doc[key] ? new Date(doc[key]) : null;
      for (const [op, val] of Object.entries(value)) {
        if (op === "$gte") {
          if (!docVal || docVal < new Date(val)) return false;
        } else if (op === "$lte") {
          if (!docVal || docVal > new Date(val)) return false;
        } else if (op === "$gt") {
          if (!docVal || docVal <= new Date(val)) return false;
        } else if (op === "$lt") {
          if (!docVal || docVal >= new Date(val)) return false;
        }
      }
    } else {
      // Direct comparison
      if (key === "_id") {
        if (doc[key]?.toString() !== value?.toString()) return false;
      } else {
        if (doc[key] !== value) return false;
      }
    }
  }
  return true;
}

class LocalDocument {
  constructor(collectionName, data) {
    this._collectionName = collectionName;
    Object.assign(this, data);
  }

  async save() {
    const data = readCollection(this._collectionName);
    const index = data.findIndex(
      (item) => item._id === this._id || item._id?.toString() === this._id?.toString()
    );

    if (this._collectionName === "users") {
      let hashPassword = false;
      if (index !== -1) {
        const existing = data[index];
        if (existing.password !== this.password) {
          hashPassword = true;
        }
      } else {
        hashPassword = true;
      }

      if (hashPassword && this.password && !this.password.startsWith("$2a$")) {
        const salt = await bcrypt.genSalt(10);
        this.password = await bcrypt.hash(this.password, salt);
      }
    }

    this.updatedAt = new Date().toISOString();

    const plainDoc = { ...this };
    delete plainDoc._collectionName;

    if (index !== -1) {
      data[index] = plainDoc;
    } else {
      plainDoc.createdAt = new Date().toISOString();
      data.push(plainDoc);
    }

    writeCollection(this._collectionName, data);
    return this;
  }

  isModified(field) {
    if (field === "password") {
      const data = readCollection(this._collectionName);
      const existing = data.find(
        (item) => item._id === this._id || item._id?.toString() === this._id?.toString()
      );
      if (!existing) return true;
      return existing.password !== this.password;
    }
    return true;
  }

  async comparePassword(candidatePassword) {
    if (this._collectionName !== "users") return false;
    return await bcrypt.compare(candidatePassword, this.password);
  }
}

function wrapDocument(collectionName, doc) {
  if (!doc) return null;
  return new LocalDocument(collectionName, doc);
}

class QueryBuilder {
  constructor(collectionName, query = {}, isFindOne = false) {
    this.collectionName = collectionName;
    this.query = query;
    this.isFindOne = isFindOne;
    this.sortObj = null;
    this.limitVal = null;
    this.selectFields = null;
  }

  sort(sortObj) {
    this.sortObj = sortObj;
    return this;
  }

  limit(limitVal) {
    this.limitVal = limitVal;
    return this;
  }

  select(selectFields) {
    this.selectFields = selectFields;
    return this;
  }

  async execute() {
    const data = readCollection(this.collectionName);
    let results = data.filter((doc) => matchQuery(doc, this.query));

    if (this.sortObj) {
      const [field, order] = Object.entries(this.sortObj)[0];
      results.sort((a, b) => {
        let valA = a[field];
        let valB = b[field];

        if (valA === undefined || valA === null) return 1;
        if (valB === undefined || valB === null) return -1;

        if (typeof valA === "string" && isNaN(Date.parse(valA))) {
          return order === 1 ? valA.localeCompare(valB) : valB.localeCompare(valA);
        }

        const timeA = (typeof valA === "string" || valA instanceof Date) ? new Date(valA).getTime() : valA;
        const timeB = (typeof valB === "string" || valB instanceof Date) ? new Date(valB).getTime() : valB;
        return order === 1 ? timeA - timeB : timeB - timeA;
      });
    }

    if (this.isFindOne) {
      const doc = results[0];
      if (!doc) return null;
      return wrapDocument(this.collectionName, doc);
    }

    if (this.limitVal) {
      results = results.slice(0, this.limitVal);
    }

    if (this.selectFields) {
      const excludes = this.selectFields.startsWith("-");
      const fields = excludes
        ? this.selectFields.slice(1).split(" ")
        : this.selectFields.split(" ");
      results = results.map((doc) => {
        const newDoc = { ...doc };
        if (excludes) {
          fields.forEach((f) => delete newDoc[f]);
        } else {
          Object.keys(newDoc).forEach((k) => {
            if (!fields.includes(k)) delete newDoc[k];
          });
        }
        return newDoc;
      });
    }

    return results.map((doc) => wrapDocument(this.collectionName, doc));
  }

  then(onFulfilled, onRejected) {
    return this.execute().then(onFulfilled, onRejected);
  }
}

class LocalModel {
  constructor(collectionName) {
    this.collectionName = collectionName;
  }

  find(query = {}) {
    return new QueryBuilder(this.collectionName, query, false);
  }

  findOne(query = {}) {
    return new QueryBuilder(this.collectionName, query, true);
  }

  findById(id) {
    return new QueryBuilder(this.collectionName, { _id: id }, true);
  }

  async findByIdAndUpdate(id, update, options = {}) {
    const data = readCollection(this.collectionName);
    const index = data.findIndex(
      (item) => item._id === id || item._id?.toString() === id?.toString()
    );
    if (index === -1) return null;

    const current = data[index];
    const updated = { ...current, ...update, updatedAt: new Date().toISOString() };
    data[index] = updated;
    writeCollection(this.collectionName, data);
    return wrapDocument(this.collectionName, updated);
  }

  async findOneAndUpdate(query, update, options = {}) {
    const data = readCollection(this.collectionName);
    const index = data.findIndex((item) => matchQuery(item, query));
    if (index === -1) {
      if (options.upsert) {
        const newDoc = {
          _id: generateId(),
          ...query,
          ...update,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };
        data.push(newDoc);
        writeCollection(this.collectionName, data);
        return wrapDocument(this.collectionName, newDoc);
      }
      return null;
    }
    const current = data[index];
    const updated = { ...current, ...update, updatedAt: new Date().toISOString() };
    data[index] = updated;
    writeCollection(this.collectionName, data);
    return wrapDocument(this.collectionName, updated);
  }

  async findByIdAndDelete(id) {
    const data = readCollection(this.collectionName);
    const filtered = data.filter(
      (item) => !(item._id === id || item._id?.toString() === id?.toString())
    );
    writeCollection(this.collectionName, filtered);
    return { success: true };
  }

  async create(docOrArray) {
    const data = readCollection(this.collectionName);
    const isArray = Array.isArray(docOrArray);
    const docs = isArray ? docOrArray : [docOrArray];
    const createdDocs = [];

    for (const doc of docs) {
      const newDoc = {
        _id: generateId(),
        ...doc,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      if (this.collectionName === "users" && newDoc.password) {
        const salt = await bcrypt.genSalt(10);
        newDoc.password = await bcrypt.hash(newDoc.password, salt);
      }

      data.push(newDoc);
      createdDocs.push(newDoc);
    }

    writeCollection(this.collectionName, data);

    if (isArray) {
      return createdDocs.map((d) => wrapDocument(this.collectionName, d));
    } else {
      return wrapDocument(this.collectionName, createdDocs[0]);
    }
  }

  async countDocuments(query = {}) {
    const data = readCollection(this.collectionName);
    return data.filter((doc) => matchQuery(doc, query)).length;
  }

  async insertMany(array) {
    return this.create(array);
  }

  async aggregate(pipeline) {
    const data = readCollection(this.collectionName);
    let results = [...data];

    for (const step of pipeline) {
      const [op, config] = Object.entries(step)[0];
      if (op === "$match") {
        results = results.filter((doc) => matchQuery(doc, config));
      } else if (op === "$group") {
        const groupField = config._id.startsWith("$") ? config._id.slice(1) : config._id;
        const groups = {};
        for (const doc of results) {
          const key = doc[groupField] || "Unknown";
          if (!groups[key]) {
            groups[key] = { _id: key, count: 0 };
          }
          groups[key].count += 1;
        }
        results = Object.values(groups);
      } else if (op === "$sort") {
        const [field, order] = Object.entries(config)[0];
        results.sort((a, b) => (order === 1 ? a[field] - b[field] : b[field] - a[field]));
      } else if (op === "$limit") {
        results = results.slice(0, config);
      }
    }
    return results;
  }
}

export function getFallbackModel(collectionName, mongooseModel) {
  const localModel = new LocalModel(collectionName);

  return new Proxy(mongooseModel, {
    get(target, prop, receiver) {
      const isOffline = mongoose.connection.readyState !== 1;
      if (isOffline) {
        if (typeof localModel[prop] === "function") {
          return localModel[prop].bind(localModel);
        }
        return localModel[prop];
      }
      return Reflect.get(target, prop, receiver);
    },
  });
}
