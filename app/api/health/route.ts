import { NextResponse } from 'next/server';
import mongoose from 'mongoose';
import connectDB from '@/lib/db';
import { ensureProductionIndexes } from '@/lib/mongodb-indexes';

const REQUIRED_COLLECTIONS = [
  'users',
  'students',
  'staff',
  'admissions',
  'classes',
  'fees',
  'payrolls',
  'notifications',
  'programs',
  'assignments',
  'expenses',
  'facilities',
  'results',
  'attendances',
  'systemsettings',
];

export async function GET() {
  try {
    await connectDB();
    const connection = mongoose.connection;
    const db = connection.db;

    if (!db) {
      return NextResponse.json(
        { ok: false, message: 'Database connection not ready' },
        { status: 503 }
      );
    }

    await db.admin().ping();
    await ensureProductionIndexes(connection);

    const existing = await db.listCollections().toArray();
    const names = new Set(existing.map((c) => c.name));

    const collections: Record<string, { exists: boolean; count: number }> = {};
    for (const name of REQUIRED_COLLECTIONS) {
      const exists = names.has(name);
      let count = 0;
      if (exists) {
        count = await db.collection(name).countDocuments();
      }
      collections[name] = { exists, count };
    }

  // Teachers are stored in the staff collection (Academic department)
    const teachersCount = await db
      .collection('staff')
      .countDocuments({ department: 'Academic' });

    return NextResponse.json({
      ok: true,
      provider: 'MongoDB Atlas',
      database: db.databaseName,
      host: connection.host,
      teachersInStaffCollection: teachersCount,
      collections,
      timestamp: new Date().toISOString(),
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Health check failed';
    return NextResponse.json({ ok: false, message }, { status: 500 });
  }
}
