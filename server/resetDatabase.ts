import mongoose from 'mongoose';
import User from './src/models/user';

async function seedDatabase() {
  try {
    const usersToSeed = [
      {
        email: 'user1@example.com',
        password: 'password1',
        firstName: 'John',
        lastName: 'Doe',
      },
      {
        email: 'user2@example.com',
        password: 'password2',
        firstName: 'Jane',
        lastName: 'Doe',
      },
      {
        email: 'user3@example.com',
        password: 'password3',
        firstName: 'Bob',
        lastName: 'Smith',
      },
    ];

    await User.insertMany(usersToSeed);
    console.log('Database seeded successfully');
  } catch (error) {
    console.error('Error seeding database:', error);
  }
}

async function deleteDatabaseRecords() {
  try {
    await mongoose.connect(`mongodb://localhost:${DB_PORT}/${DB_NAME}`);
    await User.deleteMany({});
    console.log('Database reset successfully');
  } catch (error) {
    console.error('Error seeding database:', error);
    await mongoose.disconnect();
  }
}


const DB_PORT = Number(process.env.DB_PORT) || 27017;
const DB_NAME = process.env.DB_NAME || 'SpendTune';

async function resetDatabase() {
  mongoose.connect(`mongodb://localhost:${DB_PORT}/${DB_NAME}`);
  await deleteDatabaseRecords();
  await seedDatabase();
  await mongoose.disconnect();
}

resetDatabase();