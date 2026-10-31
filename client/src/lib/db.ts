import fs from 'fs';
import path from 'path';

export interface Lead {
  id: string;
  name: string;
  email: string;
  phone: string;
  business?: string;
  service: string;
  budget?: string;
  message: string;
  status: 'pending' | 'contacted' | 'closed';
  createdAt: string;
}

const DATA_FILE = path.join(process.cwd(), 'data', 'leads.json');

const INITIAL_LEADS: Lead[] = [
  {
    id: "lead-101",
    name: "Rahul Verma",
    business: "Verma Luxury Safaris",
    email: "rahul@vermasafaris.com",
    phone: "+91 98350 11223",
    service: "Website Development",
    budget: "₹1,50,000 - ₹3,00,000",
    message: "We need a complete high-converting booking portal for our wildlife and luxury travel packages with direct WhatsApp integration.",
    status: "pending",
    createdAt: new Date(Date.now() - 2 * 3600 * 1000).toISOString(),
  },
  {
    id: "lead-102",
    name: "Dr. Ananya Sen",
    business: "Apex Super Speciality Clinic",
    email: "ananya.sen@apexclinics.in",
    phone: "+91 97712 44556",
    service: "Lead Generation",
    budget: "₹80,000 / month",
    message: "Looking for targeted Meta & Google ad campaigns for cosmetic surgery and dental implant consultations in Delhi NCR.",
    status: "pending",
    createdAt: new Date(Date.now() - 8 * 3600 * 1000).toISOString(),
  },
  {
    id: "lead-103",
    name: "Amit Patel",
    business: "Skyline Realty Projects",
    email: "amit@skylinerealty.com",
    phone: "+91 94311 88990",
    service: "Meta Ads",
    budget: "₹2,00,000 / month",
    message: "Need high-intent lead generation for upcoming luxury 3BHK tower project. Previous agency had too many fake leads.",
    status: "contacted",
    createdAt: new Date(Date.now() - 24 * 3600 * 1000).toISOString(),
  },
  {
    id: "lead-104",
    name: "Pooja Malhotra",
    business: "Aura Couture Studio",
    email: "pooja@auracouture.in",
    phone: "+91 98101 22334",
    service: "Website Development",
    budget: "₹1,20,000",
    message: "Want to revamp our legacy fashion catalog into an ultra-fast headless store with clean aesthetic and Instagram sync.",
    status: "closed",
    createdAt: new Date(Date.now() - 48 * 3600 * 1000).toISOString(),
  }
];

let inMemoryLeads: Lead[] = [...INITIAL_LEADS];

function ensureFile(): void {
  try {
    const dir = path.dirname(DATA_FILE);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    if (!fs.existsSync(DATA_FILE)) {
      fs.writeFileSync(DATA_FILE, JSON.stringify(INITIAL_LEADS, null, 2), 'utf8');
    }
  } catch (e) {
    // Filesystem may be restricted in some environments, inMemoryLeads is maintained as fallback
  }
}

export function getLeads(): Lead[] {
  ensureFile();
  try {
    if (fs.existsSync(DATA_FILE)) {
      const content = fs.readFileSync(DATA_FILE, 'utf8');
      const parsed = JSON.parse(content);
      if (Array.isArray(parsed) && parsed.length > 0) {
        inMemoryLeads = parsed;
        return parsed;
      }
    }
  } catch (e) {
    console.warn('Could not read leads file, using in-memory store:', e);
  }
  return inMemoryLeads;
}

export function addLead(data: Omit<Lead, 'id' | 'createdAt' | 'status'>): Lead {
  const leads = getLeads();
  const newLead: Lead = {
    ...data,
    id: `lead-${Date.now()}`,
    status: 'pending',
    createdAt: new Date().toISOString(),
  };

  leads.unshift(newLead);
  inMemoryLeads = leads;

  try {
    ensureFile();
    fs.writeFileSync(DATA_FILE, JSON.stringify(leads, null, 2), 'utf8');
  } catch (e) {
    console.warn('Could not persist lead to file, kept in-memory:', e);
  }

  return newLead;
}

export function updateLeadStatus(id: string, status: 'pending' | 'contacted' | 'closed'): boolean {
  const leads = getLeads();
  const lead = leads.find((l) => l.id === id);
  if (!lead) return false;

  lead.status = status;
  inMemoryLeads = leads;

  try {
    ensureFile();
    fs.writeFileSync(DATA_FILE, JSON.stringify(leads, null, 2), 'utf8');
  } catch (e) {
    console.warn('Could not persist status update:', e);
  }

  return true;
}

export function deleteLead(id: string): boolean {
  let leads = getLeads();
  const initialLength = leads.length;
  leads = leads.filter((l) => l.id !== id);
  if (leads.length === initialLength) return false;

  inMemoryLeads = leads;
  try {
    ensureFile();
    fs.writeFileSync(DATA_FILE, JSON.stringify(leads, null, 2), 'utf8');
  } catch (e) {
    console.warn('Could not persist lead deletion:', e);
  }

  return true;
}

export function getLeadStats() {
  const leads = getLeads();
  const stats = {
    total: leads.length,
    pending: 0,
    contacted: 0,
    closed: 0,
    byService: {} as Record<string, number>,
  };

  leads.forEach((l) => {
    if (l.status === 'pending') stats.pending++;
    else if (l.status === 'contacted') stats.contacted++;
    else if (l.status === 'closed') stats.closed++;

    const s = l.service || 'General Inquiry';
    stats.byService[s] = (stats.byService[s] || 0) + 1;
  });

  return stats;
}

const serverStartTime = Date.now();

export function getSystemHealth() {
  const mem = process.memoryUsage();
  const uptimeSeconds = Math.floor((Date.now() - serverStartTime) / 1000);
  
  return {
    status: "HEALTHY_OPTIMAL",
    uptimeSeconds,
    uptimeFormatted: `${Math.floor(uptimeSeconds / 3600)}h ${Math.floor((uptimeSeconds % 3600) / 60)}m ${uptimeSeconds % 60}s`,
    nodeVersion: process.version,
    nextVersion: "15.5.21",
    environment: process.env.NODE_ENV || "production",
    memoryUsageMB: Math.round(mem.rss / 1024 / 1024),
    activeServices: [
      "NextGen Core HTTP",
      "JARVIS Neural Link",
      "Leads CRM Engine",
      "Meta/Google Ads Drafting Engine"
    ],
    timestamp: new Date().toISOString(),
  };
}

