import express from 'express';
import path from 'path';
import fs from 'fs';
import { createServer as createViteServer } from 'vite';

const DATA_DIR = path.join(process.cwd(), 'data');
const TECHS_FILE = path.join(DATA_DIR, 'technicians.json');
const CUSTOMERS_FILE = path.join(DATA_DIR, 'customers.json');
const USERS_FILE = path.join(DATA_DIR, 'users.json');
const AUDIT_FILE = path.join(DATA_DIR, 'audit_logs.json');
const ACTIVITY_FILE = path.join(DATA_DIR, 'activity_logs.json');
const BLOCKED_DEVICES_FILE = path.join(DATA_DIR, 'blocked_devices.json');

// Ensure data directory and files exist
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

function readJsonFile<T>(filePath: string, fallback: T): T {
  try {
    if (!fs.existsSync(filePath)) {
      fs.writeFileSync(filePath, JSON.stringify(fallback, null, 2), 'utf-8');
      return fallback;
    }
    const content = fs.readFileSync(filePath, 'utf-8');
    return JSON.parse(content);
  } catch (err) {
    console.warn(`Error reading ${filePath}:`, err);
    return fallback;
  }
}

function writeJsonFile<T>(filePath: string, data: T): void {
  try {
    const tempFile = `${filePath}.tmp.${Date.now()}`;
    fs.writeFileSync(tempFile, JSON.stringify(data, null, 2), 'utf-8');
    fs.renameSync(tempFile, filePath);
  } catch (err) {
    console.warn(`Error writing ${filePath}:`, err);
  }
}

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json({ limit: '15mb' }));
  app.use(express.urlencoded({ extended: true, limit: '15mb' }));

  // Request logger for API calls
  app.use('/api', (req, _res, next) => {
    console.log(`[API] ${req.method} ${req.path}`);
    next();
  });

  // Health Check
  app.get('/api/health', (_req, res) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString() });
  });

  // ==========================================
  // TECHNICIANS API
  // ==========================================

  // GET /api/technicians
  app.get('/api/technicians', (_req, res) => {
    const techs = readJsonFile<any[]>(TECHS_FILE, []);
    res.json(techs);
  });

  // GET /api/technicians/:id
  app.get('/api/technicians/:id', (req, res) => {
    const techId = req.params.id;
    const techs = readJsonFile<any[]>(TECHS_FILE, []);
    const found = techs.find((t) => t.id === techId || t.userId === techId || t.technicianCode === techId);
    if (!found) {
      return res.status(404).json({ error: 'Technician not found' });
    }
    res.json(found);
  });

  // POST /api/technicians (Create or submit registration)
  app.post('/api/technicians', (req, res) => {
    const newTech = req.body;
    if (!newTech || (!newTech.id && !newTech.userId && !newTech.fullName)) {
      return res.status(400).json({ error: 'Invalid technician data' });
    }

    const techs = readJsonFile<any[]>(TECHS_FILE, []);

    // Natural sequential code TECH-1, TECH-2... if not provided
    if (!newTech.technicianCode) {
      let maxNum = 0;
      techs.forEach((t) => {
        if (t.technicianCode) {
          const m = t.technicianCode.match(/(?:NF-)?TECH-(\d+)/i);
          if (m && m[1]) {
            const num = parseInt(m[1], 10);
            if (!isNaN(num) && num > maxNum) maxNum = num;
          }
        }
      });
      newTech.technicianCode = `TECH-${maxNum + 1}`;
    }

    const existingIndex = techs.findIndex(
      (t) => (newTech.id && t.id === newTech.id) || (newTech.userId && t.userId === newTech.userId)
    );

    if (existingIndex >= 0) {
      techs[existingIndex] = {
        ...techs[existingIndex],
        ...newTech,
        updatedAt: new Date().toISOString(),
      };
      writeJsonFile(TECHS_FILE, techs);
      return res.json(techs[existingIndex]);
    } else {
      const entry = {
        ...newTech,
        id: newTech.id || newTech.userId || `tech_${Date.now()}`,
        status: newTech.status || 'pending',
        isApproved: newTech.isApproved ?? false,
        isBlocked: newTech.isBlocked ?? false,
        appliedAt: newTech.appliedAt || new Date().toISOString(),
        createdAt: newTech.createdAt || new Date().toISOString(),
      };
      techs.unshift(entry);
      writeJsonFile(TECHS_FILE, techs);
      return res.json(entry);
    }
  });

  // PUT /api/technicians/:id (Update status, approval, blocking)
  app.put('/api/technicians/:id', (req, res) => {
    const techId = req.params.id;
    const updates = req.body;
    const techs = readJsonFile<any[]>(TECHS_FILE, []);

    const index = techs.findIndex((t) => t.id === techId || t.userId === techId || t.technicianCode === techId);
    if (index < 0) {
      // If not found, add it
      const created = {
        ...updates,
        id: techId,
        updatedAt: new Date().toISOString(),
      };
      techs.unshift(created);
      writeJsonFile(TECHS_FILE, techs);
      return res.json(created);
    }

    techs[index] = {
      ...techs[index],
      ...updates,
      updatedAt: new Date().toISOString(),
    };
    writeJsonFile(TECHS_FILE, techs);
    res.json(techs[index]);
  });

  // DELETE /api/technicians/:id
  app.delete('/api/technicians/:id', (req, res) => {
    const techId = req.params.id;
    let techs = readJsonFile<any[]>(TECHS_FILE, []);
    techs = techs.filter((t) => t.id !== techId && t.userId !== techId && t.technicianCode !== techId);
    writeJsonFile(TECHS_FILE, techs);
    res.json({ success: true });
  });

  // ==========================================
  // CUSTOMERS API
  // ==========================================

  // GET /api/customers
  app.get('/api/customers', (_req, res) => {
    const customers = readJsonFile<any[]>(CUSTOMERS_FILE, []);
    res.json(customers);
  });

  // POST /api/customers (Track or Register customer)
  app.post('/api/customers', (req, res) => {
    const custData = req.body;
    if (!custData) {
      return res.status(400).json({ error: 'Invalid customer data' });
    }

    const customers = readJsonFile<any[]>(CUSTOMERS_FILE, []);

    // Generate natural sequential Customer ID (CUST-1, CUST-2...) if needed
    if (!custData.customerId) {
      let maxNum = 0;
      customers.forEach((c) => {
        if (c.customerId) {
          const m = c.customerId.match(/CUST-(\d+)/i);
          if (m && m[1]) {
            const num = parseInt(m[1], 10);
            if (!isNaN(num) && num > maxNum) maxNum = num;
          }
        }
      });
      custData.customerId = `CUST-${maxNum + 1}`;
    }

    const rawPhone = custData.phone || custData.mobile_number || custData.mobile || '';
    const cleanPhone = rawPhone.replace(/\D/g, '').slice(-10);

    const matchIndex = customers.findIndex(
      (c) =>
        (custData.id && c.id === custData.id) ||
        (custData.customerId && c.customerId === custData.customerId) ||
        (cleanPhone && c.phone && c.phone.replace(/\D/g, '').slice(-10) === cleanPhone) ||
        (cleanPhone && c.mobile_number && c.mobile_number.replace(/\D/g, '').slice(-10) === cleanPhone) ||
        (custData.deviceId && c.deviceId === custData.deviceId)
    );

    if (matchIndex >= 0) {
      const existing = customers[matchIndex];
      const finalPhone = cleanPhone || existing.phone || existing.mobile_number || '';
      const finalName =
        custData.name && custData.name !== 'NeedFix Visitor'
          ? custData.name
          : existing.name && existing.name !== 'NeedFix Visitor'
          ? existing.name
          : custData.name || 'NeedFix Customer';

      customers[matchIndex] = {
        ...existing,
        ...custData,
        name: finalName,
        phone: finalPhone,
        mobile_number: finalPhone,
        lastSeenAt: new Date().toISOString(),
      };
      writeJsonFile(CUSTOMERS_FILE, customers);
      return res.json(customers[matchIndex]);
    } else {
      const record = {
        id: custData.id || `cust_${Date.now()}`,
        customerId: custData.customerId,
        name: custData.name || 'NeedFix Customer',
        phone: cleanPhone,
        mobile_number: cleanPhone,
        ipAddress: custData.ipAddress || req.ip || '127.0.0.1',
        deviceId: custData.deviceId || `DEV_${Date.now()}`,
        userAgent: custData.userAgent || req.headers['user-agent'] || '',
        lastSeenAt: new Date().toISOString(),
        createdAt: new Date().toISOString(),
        isBlocked: custData.isBlocked ?? false,
      };
      customers.unshift(record);
      writeJsonFile(CUSTOMERS_FILE, customers);
      return res.json(record);
    }
  });

  // PUT /api/customers/:id (Block, Unblock, Update)
  app.put('/api/customers/:id', (req, res) => {
    const custId = req.params.id;
    const updates = req.body;
    const customers = readJsonFile<any[]>(CUSTOMERS_FILE, []);

    const index = customers.findIndex((c) => c.id === custId || c.customerId === custId);
    if (index >= 0) {
      customers[index] = {
        ...customers[index],
        ...updates,
        lastSeenAt: new Date().toISOString(),
      };
      writeJsonFile(CUSTOMERS_FILE, customers);
      return res.json(customers[index]);
    }

    res.status(404).json({ error: 'Customer not found' });
  });

  // ==========================================
  // USERS API
  // ==========================================

  // GET /api/users
  app.get('/api/users', (_req, res) => {
    const users = readJsonFile<any[]>(USERS_FILE, []);
    res.json(users);
  });

  // POST /api/users (Register/Update user)
  app.post('/api/users', (req, res) => {
    const userData = req.body;
    if (!userData || !userData.id) {
      return res.status(400).json({ error: 'Invalid user data' });
    }

    const users = readJsonFile<any[]>(USERS_FILE, []);
    const index = users.findIndex(
      (u) =>
        u.id === userData.id ||
        (userData.username && u.username?.toLowerCase() === userData.username.toLowerCase())
    );

    if (index >= 0) {
      users[index] = { ...users[index], ...userData };
      writeJsonFile(USERS_FILE, users);
      return res.json(users[index]);
    } else {
      users.push(userData);
      writeJsonFile(USERS_FILE, users);
      return res.json(userData);
    }
  });

  // ==========================================
  // AUDIT LOGS API
  // ==========================================

  app.get('/api/audit-logs', (_req, res) => {
    const logs = readJsonFile<any[]>(AUDIT_FILE, []);
    res.json(logs);
  });

  app.post('/api/audit-logs', (req, res) => {
    const newLog = req.body;
    const logs = readJsonFile<any[]>(AUDIT_FILE, []);
    logs.unshift({
      ...newLog,
      id: newLog.id || `log_${Date.now()}`,
      timestamp: newLog.timestamp || new Date().toISOString(),
    });
    writeJsonFile(AUDIT_FILE, logs.slice(0, 500));
    res.json({ success: true });
  });

  // ==========================================
  // ACTIVITY LOGS API (Call, WhatsApp, Views)
  // ==========================================

  app.get('/api/activity-logs', (req, res) => {
    const { technicianId } = req.query;
    const logs = readJsonFile<any[]>(ACTIVITY_FILE, []);
    if (technicianId && typeof technicianId === 'string') {
      return res.json(logs.filter((l) => l.technicianId === technicianId));
    }
    res.json(logs);
  });

  app.post('/api/activity-logs', (req, res) => {
    const newLog = req.body;
    if (!newLog || !newLog.technicianId) {
      return res.status(400).json({ error: 'technicianId is required' });
    }
    const logs = readJsonFile<any[]>(ACTIVITY_FILE, []);
    const logItem = {
      ...newLog,
      id: newLog.id || `act_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      timestamp: newLog.timestamp || new Date().toISOString(),
    };
    logs.unshift(logItem);
    writeJsonFile(ACTIVITY_FILE, logs.slice(0, 1000));
    res.json(logItem);
  });

  // ==========================================
  // BLOCKED DEVICES & BLACKLIST API
  // ==========================================

  app.get('/api/blocked-devices', (_req, res) => {
    const list = readJsonFile<any[]>(BLOCKED_DEVICES_FILE, []);
    res.json(list);
  });

  app.post('/api/blocked-devices', (req, res) => {
    const record = req.body;
    if (!record || !record.uniqueId) {
      return res.status(400).json({ error: 'uniqueId is required' });
    }
    const list = readJsonFile<any[]>(BLOCKED_DEVICES_FILE, []);
    const filtered = list.filter(
      (b) =>
        b.uniqueId !== record.uniqueId &&
        (!record.deviceId || b.deviceId !== record.deviceId) &&
        (!record.ipAddress || b.ipAddress !== record.ipAddress)
    );
    filtered.unshift({
      ...record,
      id: record.id || `block_${Date.now()}`,
      blockedAt: record.blockedAt || new Date().toISOString(),
    });
    writeJsonFile(BLOCKED_DEVICES_FILE, filtered);
    res.json({ success: true, record });
  });

  app.delete('/api/blocked-devices/:id', (req, res) => {
    const id = req.params.id;
    const list = readJsonFile<any[]>(BLOCKED_DEVICES_FILE, []);
    const filtered = list.filter(
      (b) =>
        b.id !== id &&
        b.uniqueId !== id &&
        b.targetId !== id &&
        b.deviceId !== id &&
        b.ipAddress !== id
    );
    writeJsonFile(BLOCKED_DEVICES_FILE, filtered);
    res.json({ success: true });
  });

  // ==========================================
  // VITE / STATIC SERVING
  // ==========================================

  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`NeedFix Full-Stack Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
