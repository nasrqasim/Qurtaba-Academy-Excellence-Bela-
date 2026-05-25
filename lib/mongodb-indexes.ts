import type { Connection } from 'mongoose';

/**
 * Ensures production indexes exist on Atlas (idempotent).
 */
export async function ensureProductionIndexes(connection: Connection) {
  const db = connection.db;
  if (!db) return;

  const indexSpecs: Array<{ collection: string; indexes: Record<string, 1 | -1>[] }> = [
    {
      collection: 'students',
      indexes: [
        { admissionNumber: 1 },
        { fullName: 1 },
        { class: 1, section: 1 },
        { status: 1 },
        { verificationId: 1 },
        { createdAt: -1 },
      ],
    },
    {
      collection: 'users',
      indexes: [{ email: 1 }, { role: 1 }, { createdAt: -1 }],
    },
    {
      collection: 'staff',
      indexes: [{ empId: 1 }, { email: 1 }, { department: 1 }, { createdAt: -1 }],
    },
    {
      collection: 'admissions',
      indexes: [{ status: 1 }, { createdAt: -1 }],
    },
    {
      collection: 'classes',
      indexes: [{ name: 1, section: 1 }],
    },
    {
      collection: 'fees',
      indexes: [{ transactionId: 1 }, { studentClass: 1 }, { status: 1 }, { createdAt: -1 }],
    },
    {
      collection: 'payrolls',
      indexes: [{ staffId: 1 }, { month: 1 }, { createdAt: -1 }],
    },
    {
      collection: 'notifications',
      indexes: [{ createdAt: -1 }],
    },
    {
      collection: 'programs',
      indexes: [{ name: 1 }, { createdAt: -1 }],
    },
    {
      collection: 'assignments',
      indexes: [{ class: 1 }, { createdAt: -1 }],
    },
    {
      collection: 'expenses',
      indexes: [{ date: -1 }, { category: 1 }],
    },
    {
      collection: 'facilities',
      indexes: [{ createdAt: -1 }],
    },
    {
      collection: 'results',
      indexes: [{ studentId: 1 }, { examId: 1 }],
    },
    {
      collection: 'attendances',
      indexes: [{ date: -1 }, { class: 1 }],
    },
    {
      collection: 'systemsettings',
      indexes: [{ key: 1 }],
    },
  ];

  for (const { collection, indexes } of indexSpecs) {
    const col = db.collection(collection);
    for (const keys of indexes) {
      try {
        await col.createIndex(keys, { background: true });
      } catch {
        // Index may already exist with different options
      }
    }
  }
}
