import dotenv from 'dotenv';
import { MongoClient } from 'mongodb';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.join(__dirname, '..', '.env.local') });

const ATLAS_URI = process.env.MONGODB_URI;
const LOCAL_URI =
  process.env.LOCAL_MONGODB_URI || 'mongodb://localhost:27017/qurtaba_school_erp';

const COLLECTIONS = [
  'users',
  'students',
  'staff',
  'staffs',
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
  'timetables',
  'exams',
  'subjects',
  'rolepermissions',
];

async function copyCollection(localDb, atlasDb, name) {
  const localCol = localDb.collection(name);
  const count = await localCol.countDocuments();
  if (count === 0) return { name, copied: 0, skipped: true };

  const docs = await localCol.find({}).toArray();
  const targetName = name === 'staffs' ? 'staff' : name;
  const atlasCol = atlasDb.collection(targetName);

  if (docs.length > 0) {
    await atlasCol.deleteMany({});
    await atlasCol.insertMany(docs, { ordered: false });
  }

  return { name: targetName, copied: docs.length, skipped: false };
}

async function main() {
  if (!ATLAS_URI || ATLAS_URI.includes('localhost')) {
    console.error('Set MONGODB_URI in .env.local to your Atlas connection string.');
    process.exit(1);
  }

  const localClient = new MongoClient(LOCAL_URI);
  const atlasClient = new MongoClient(ATLAS_URI);

  try {
    await localClient.connect();
    console.log('Local MongoDB: connected');
  } catch (err) {
    console.error('Cannot connect to local MongoDB:', err.message);
    console.error('Start Compass/local mongod or set LOCAL_MONGODB_URI if data is elsewhere.');
    process.exit(1);
  }

  await atlasClient.connect();
  console.log('Atlas: connected');

  const localDb = localClient.db();
  const atlasDb = atlasClient.db();

  console.log(`\nMigrating ${localDb.databaseName} → ${atlasDb.databaseName}\n`);

  const seen = new Set();
  for (const name of COLLECTIONS) {
    if (seen.has(name)) continue;
    try {
      const result = await copyCollection(localDb, atlasDb, name);
      seen.add(result.name);
      if (!result.skipped) {
        console.log(`  Copied ${result.copied} → ${result.name}`);
      }
    } catch (err) {
      if (err.code !== 26) {
        console.warn(`  ${name}: ${err.message}`);
      }
    }
  }

  await localClient.close();
  await atlasClient.close();
  console.log('\nMigration finished. Run: npm run db:verify');
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
