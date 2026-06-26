import React, { useState, useEffect } from "react";
import axios from "axios";
import { Plus, Edit2, Trash2, Users as UsersIcon, Shield, Key, AlertCircle } from "lucide-react";
import { useAuth } from "../../context/AuthContext";

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

function Users() {
  const { user: currentUser } = useAuth();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  
  // Editor State
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [editId, setEditId] = useState(null); // null if creating
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: "Editor",
    permissions: []
  });

  const fetchUsers = async () => {
    try {
      setLoading(true);
      setError("");
      const response = await axios.get(`${API_BASE_URL}/auth/users`);
      if (response.data?.success) {
        setUsers(response.data.users);
      }
    } catch (err) {
      console.error(err);
      setError("Failed to fetch team users from database. Verify you have administrator access.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (currentUser?.role === "Admin") {
      fetchUsers();
    } else {
      setError("Access Denied. You must be an Administrator to manage team roles.");
      setLoading(false);
    }
  }, [currentUser]);

  const handleOpenCreate = () => {
    setEditId(null);
    setFormData({
      name: "",
      email: "",
      password: "",
      role: "Editor",
      permissions: ["leads", "portfolio"]
    });
    setIsEditorOpen(true);
  };

  const handleOpenEdit = (user) => {
    setEditId(user._id);
    setFormData({
      name: user.name,
      email: user.email,
      password: "", // Keep blank to not modify password
      role: user.role,
      permissions: user.permissions || []
    });
    setIsEditorOpen(true);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  const handlePermissionChange = (perm) => {
    setFormData((prev) => {
      const active = prev.permissions.includes(perm);
      const updated = active
        ? prev.permissions.filter((p) => p !== perm)
        : [...prev.permissions, perm];
      return { ...prev, permissions: updated };
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.email) return;
    if (!editId && !formData.password) {
      alert("Password is required for new users.");
      return;
    }

    try {
      const payload = { ...formData };
      if (editId && !payload.password) {
        delete payload.password; // Do not update password if blank
      }

      if (editId) {
        // Edit request
        const res = await axios.put(`${API_BASE_URL}/auth/users/${editId}`, payload);
        if (res.data?.success) {
          setUsers((prev) => prev.map((u) => (u._id === editId ? res.data.user : u)));
        }
      } else {
        // Create request
        const res = await axios.post(`${API_BASE_URL}/auth/users`, payload);
        if (res.data?.success) {
          setUsers((prev) => [...prev, res.data.user]);
        }
      }
      setIsEditorOpen(false);
    } catch (err) {
      alert(err.response?.data?.message || "Failed to save user records.");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this team member?")) return;
    try {
      const res = await axios.delete(`${API_BASE_URL}/auth/users/${id}`);
      if (res.data?.success) {
        setUsers((prev) => prev.filter((u) => u._id !== id));
      }
    } catch (err) {
      alert(err.response?.data?.message || "Failed to delete user");
    }
  };

  const permissionList = [
    { label: "Leads CRM", value: "leads" },
    { label: "Portfolio CMS", value: "portfolio" },
    { label: "Services CMS", value: "services" },
    { label: "Testimonials CMS", value: "testimonials" },
    { label: "Website Content Settings", value: "settings" },
    { label: "Blogs & Articles Editor", value: "blogs" }
  ];

  return (
    <div className="flex flex-col gap-6 font-sans">
      
      {/* Header */}
      <div className="flex items-center justify-between text-left">
        <div>
          <h2 className="text-xl sm:text-2xl font-headings font-extrabold text-slate-800 dark:text-white tracking-tight">
            Team Users & Roles
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 font-medium">
            Manage administrative user profiles, roles, and functional panel permissions
          </p>
        </div>
        {currentUser?.role === "Admin" && (
          <button
            onClick={handleOpenCreate}
            className="inline-flex items-center gap-1.5 bg-primary hover:bg-primary/95 text-white font-bold text-xs px-4 py-3 rounded-xl shadow-md transition-all"
          >
            <Plus className="w-4.5 h-4.5" />
            <span>Add User</span>
          </button>
        )}
      </div>

      {error && (
        <div className="bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-900 rounded-xl p-3 text-xs text-red-600 dark:text-red-400 flex items-center gap-2 text-left">
          <AlertCircle className="w-4.5 h-4.5 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* ─── TEAM MEMBERS TABLE ────────────────────────────────────────── */}
      {currentUser?.role === "Admin" && (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm overflow-hidden text-left">
          {loading ? (
            <div className="p-10 flex flex-col items-center justify-center gap-3">
              <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
              <p className="text-xs text-slate-400 font-medium">Loading user list...</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50/70 dark:bg-slate-850/50 border-b border-slate-200 dark:border-slate-800 text-[10px] font-bold text-slate-500 uppercase tracking-wider select-none">
                    <th className="py-4 px-6">Name</th>
                    <th className="py-4 px-6">Email Address</th>
                    <th className="py-4 px-6">Assigned Role</th>
                    <th className="py-4 px-6">Panel Permissions</th>
                    <th className="py-4 px-6 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-150 dark:divide-slate-800 text-xs">
                  {users.map((teamUser) => (
                    <tr key={teamUser._id} className="hover:bg-slate-50/40 dark:hover:bg-slate-800/20 transition-colors">
                      <td className="py-4 px-6 font-bold text-slate-850 dark:text-slate-200 flex items-center gap-2">
                        <UsersIcon className="w-4 h-4 text-primary" />
                        <span>{teamUser.name} {teamUser._id === currentUser._id && <span className="text-[9px] font-bold text-slate-400 uppercase font-mono">(You)</span>}</span>
                      </td>
                      <td className="py-4 px-6 text-slate-500 font-medium">{teamUser.email}</td>
                      <td className="py-4 px-6">
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                          teamUser.role === "Admin"
                            ? "bg-red-50 text-red-600 dark:bg-red-950/20 dark:text-red-400"
                            : teamUser.role === "Manager"
                            ? "bg-amber-50 text-amber-600 dark:bg-amber-950/20 dark:text-amber-400"
                            : "bg-blue-50 text-blue-600 dark:bg-blue-950/20 dark:text-blue-400"
                        }`}>
                          {teamUser.role}
                        </span>
                      </td>
                      <td className="py-4 px-6 text-slate-500">
                        <div className="flex flex-wrap gap-1">
                          {teamUser.role === "Admin" ? (
                            <span className="text-[9px] font-bold text-slate-500 bg-slate-100 dark:bg-slate-800 px-1.5 py-0.5 rounded">All Access</span>
                          ) : teamUser.permissions && teamUser.permissions.length > 0 ? (
                            teamUser.permissions.map((p) => (
                              <span key={p} className="text-[9px] font-bold text-primary bg-primary/5 px-1.5 py-0.5 rounded">{p}</span>
                            ))
                          ) : (
                            <span className="text-[9px] font-semibold text-slate-400">None</span>
                          )}
                        </div>
                      </td>
                      <td className="py-4 px-6 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => handleOpenEdit(teamUser)}
                            className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-800 text-slate-500 hover:text-primary hover:bg-primary/5 transition-all"
                            title="Edit User"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button
                            disabled={teamUser._id === currentUser._id}
                            onClick={() => handleDelete(teamUser._id)}
                            className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-800 text-slate-500 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/20 transition-all disabled:opacity-30 disabled:cursor-not-allowed"
                            title="Delete User"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* ─── USER EDITOR POPUP MODAL ──────────────────────────────────── */}
      {isEditorOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-dark/60 backdrop-blur-sm">
          <div
            className="w-full max-w-[460px] max-h-[90vh] bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 sm:p-7 shadow-2xl overflow-y-auto text-left"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-4 mb-5">
              <h3 className="font-headings font-extrabold text-lg text-slate-850 dark:text-white leading-none">
                {editId ? "Edit Team User Details" : "Create New Team Member"}
              </h3>
              <button
                onClick={() => setIsEditorOpen(false)}
                className="w-8 h-8 rounded-full bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-855 flex items-center justify-center text-slate-500 hover:text-dark dark:hover:text-white transition-all"
              >
                ✕
              </button>
            </div>

            {/* Users Editor Form */}
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              {/* Name */}
              <div className="flex flex-col gap-1">
                <label className="text-[10px] font-bold text-slate-700 dark:text-slate-350 uppercase tracking-wide">Full Name *</label>
                <input
                  type="text"
                  name="name"
                  required
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder="e.g. John Doe"
                  className="w-full text-xs py-2.5 px-3 rounded-lg bg-slate-50 dark:bg-slate-850 border border-slate-205 dark:border-slate-800 focus:border-primary outline-none transition-all dark:text-white"
                />
              </div>

              {/* Email */}
              <div className="flex flex-col gap-1">
                <label className="text-[10px] font-bold text-slate-700 dark:text-slate-350 uppercase tracking-wide">Email Address *</label>
                <input
                  type="email"
                  name="email"
                  required
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder="e.g. john@nextgendigital.com"
                  className="w-full text-xs py-2.5 px-3 rounded-lg bg-slate-50 dark:bg-slate-850 border border-slate-205 dark:border-slate-800 focus:border-primary outline-none transition-all dark:text-white"
                />
              </div>

              {/* Password */}
              <div className="flex flex-col gap-1">
                <label className="text-[10px] font-bold text-slate-700 dark:text-slate-350 uppercase tracking-wide">
                  Password {editId && <span className="text-muted font-normal lowercase">(leave empty to keep current)</span>}
                </label>
                <div className="relative flex items-center">
                  <Key className="w-4 h-4 text-slate-400 dark:text-slate-500 absolute left-3" />
                  <input
                    type="password"
                    name="password"
                    required={!editId}
                    value={formData.password}
                    onChange={handleInputChange}
                    placeholder="••••••••"
                    className="w-full text-xs py-2.5 pl-9 pr-3 rounded-lg bg-slate-50 dark:bg-slate-850 border border-slate-205 dark:border-slate-800 focus:border-primary outline-none transition-all dark:text-white"
                  />
                </div>
              </div>

              {/* Role */}
              <div className="flex flex-col gap-1">
                <label className="text-[10px] font-bold text-slate-700 dark:text-slate-350 uppercase tracking-wide">Team Role *</label>
                <select
                  name="role"
                  required
                  value={formData.role}
                  onChange={handleInputChange}
                  className="w-full text-xs py-2.5 px-3 rounded-lg bg-slate-50 dark:bg-slate-850 border border-slate-205 dark:border-slate-800 focus:border-primary outline-none transition-all dark:text-white"
                >
                  <option value="Admin">Admin (Full System Access)</option>
                  <option value="Manager">Manager (Edit settings & CRM)</option>
                  <option value="Editor">Editor (Edit content blogs/portfolio)</option>
                </select>
              </div>

              {/* Permissions list (Only applicable for non-admin) */}
              {formData.role !== "Admin" && (
                <div className="border-t border-slate-100 dark:border-slate-800 pt-3.5 flex flex-col gap-2.5">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                    <Shield className="w-3.5 h-3.5" />
                    <span>Restrict Access Permissions</span>
                  </span>
                  <div className="grid grid-cols-2 gap-2 select-none">
                    {permissionList.map((perm) => {
                      const isChecked = formData.permissions.includes(perm.value);
                      return (
                        <label
                          key={perm.value}
                          className="flex items-center gap-2 text-xs font-semibold text-slate-650 dark:text-slate-400 cursor-pointer"
                        >
                          <input
                            type="checkbox"
                            checked={isChecked}
                            onChange={() => handlePermissionChange(perm.value)}
                            className="rounded border-slate-300 text-primary"
                          />
                          <span>{perm.label}</span>
                        </label>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Submit Buttons */}
              <div className="flex gap-3 border-t border-slate-100 dark:border-slate-800 pt-4 mt-2">
                <button
                  type="submit"
                  className="flex-grow bg-primary hover:bg-primary/90 text-white font-bold text-xs py-3 rounded-xl shadow-md transition-all"
                >
                  Save User
                </button>
                <button
                  type="button"
                  onClick={() => setIsEditorOpen(false)}
                  className="px-5 py-3 border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-xl font-bold text-xs text-slate-500 dark:text-slate-455 transition-all"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}

export default Users;
