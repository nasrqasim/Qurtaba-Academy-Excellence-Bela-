import dotenv from 'dotenv';
import mongoose from 'mongoose';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.join(__dirname, '..', '.env.local') });

const MONGODB_URI = process.env.MONGODB_URI;
const REQUIRED = [
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

async function main() {
  if (!MONGODB_URI) {
    console.error('MONGODB_URI missing in .env.local');
    process.exit(1);
  }

  if (MONGODB_URI.includes('localhost') || MONGODB_URI.includes('127.0.0.1')) {
    console.error('Still configured for local MongoDB. Update .env.local with Atlas URI.');
    process.exit(1);
  }

  console.log('Connecting to MongoDB Atlas...');
  await mongoose.connect(MONGODB_URI, { serverSelectionTimeoutMS: 15000 });
  const db = mongoose.connection.db;
  await db.admin().ping();
  console.log('Atlas connection: OK');
  console.log('Database:', db.databaseName);

  const existing = await db.listCollections().toArray();
  const names = new Set(existing.map((c) => c.name));

  console.log('\nCollection status:');
  for (const name of REQUIRED) {
    const exists = names.has(name);
    const count = exists ? await db.collection(name).countDocuments() : 0;
    console.log(`  ${exists ? '✓' : '○'} ${name.padEnd(18)} ${exists ? count + ' documents' : 'not created yet'}`);
  }

  const teachers = await db.collection('staff').countDocuments({ department: 'Academic' });
  console.log(`\nTeachers (staff, Academic): ${teachers}`);
  console.log('\nAccounting: fees + expenses collections (transactions API merges both)');

  await mongoose.disconnect();
  console.log('\nVerification complete.');
}

main().catch((err) => {
  console.error('Verification failed:', err.message);
  process.exit(1);
});
