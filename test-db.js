require('dotenv').config({ path: '.env.local' });
const mongoose = require('mongoose');

const MONGODB_URI = process.env.MONGODB_URI;

async function checkDb() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('Successfully connected to MongoDB.');

    // Print users
    const users = await mongoose.connection.db.collection('users').find({}).toArray();
    console.log(`Total users in DB: ${users.length}`);
    users.forEach(u => {
      console.log(`User: ${u.name}, Email: ${u.email}, Username: ${u.username}, Role: ${u.role}, Status: ${u.status}`);
    });

    process.exit(0);
  } catch (error) {
    console.error('Error connecting to database:', error);
    process.exit(1);
  }
}

checkDb();
