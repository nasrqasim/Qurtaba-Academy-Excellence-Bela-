/**
 * One-time database migration script.
 * Run with: node migrate.js
 *
 * What it does:
 * 1. Upserts SystemSettings with the correct school address & phone.
 * 2. Sets loginEnabled = true for every Student/Staff record that has a
 *    password but loginEnabled is currently false.
 */

const { MongoClient } = require('mongodb');

const MONGODB_URI =
  'mongodb+srv://qurtaba:Qurtaba123@cluster0.doata1g.mongodb.net/qurtaba?retryWrites=true&w=majority&appName=Cluster0';

async function main() {
  const client = new MongoClient(MONGODB_URI);
  await client.connect();
  console.log('✅ Connected to MongoDB');

  const db = client.db('qurtaba');

  // ── 1. System Settings ──────────────────────────────────────────────────────
  const settingsCol = db.collection('systemsettings');
  const settingsResult = await settingsCol.updateOne(
    {},
    {
      $set: {
        schoolName:  'Qurtaba Academy of Excellence Bela',
        address:     'Qurtaba Academy of excellence bela Near AC Office bela,Lasbela',
        phone:       '+923312493233',
        schoolEmail: 'info@qurtaba.edu.pk',
        updatedAt:   new Date()
      }
    },
    { upsert: true }
  );
  console.log(
    `✅ SystemSettings: matched=${settingsResult.matchedCount}, modified=${settingsResult.modifiedCount}, upserted=${settingsResult.upsertedCount}`
  );

  // ── 2. Enable logins for Students who have a password but loginEnabled=false ─
  const studentsCol = db.collection('students');
  const studentsResult = await studentsCol.updateMany(
    { password: { $exists: true, $ne: null, $ne: '' }, loginEnabled: { $ne: true } },
    { $set: { loginEnabled: true } }
  );
  console.log(
    `✅ Students: ${studentsResult.modifiedCount} record(s) had loginEnabled set to true`
  );

  // ── 3. Enable logins for Staff who have a password but loginEnabled=false ────
  const staffCol = db.collection('staff');
  const staffResult = await staffCol.updateMany(
    { password: { $exists: true, $ne: null, $ne: '' }, loginEnabled: { $ne: true } },
    { $set: { loginEnabled: true } }
  );
  console.log(
    `✅ Staff/Teachers: ${staffResult.modifiedCount} record(s) had loginEnabled set to true`
  );

  await client.close();
  console.log('🎉 Migration complete. Database connection closed.');
}

main().catch((err) => {
  console.error('❌ Migration failed:', err);
  process.exit(1);
});
