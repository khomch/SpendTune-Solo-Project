import mongoose from '../../server/db';
import User from '../../server/models/user';
import { TUser }from '../src/types/types';



async function seedDatabase() {
  try {
    const usersToSeed: TUser[] = [
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
    mongoose.connect(`mongodb://localhost:${DB_PORT}/${DB_NAME}`);
    await User.deleteMany({});
    console.log('Database reset successfully');
  } catch (error) {
    console.error('Error seeding database:', error);
    await mongoose.disconnect();
  }
}


const DB_PORT = Number(process.env.DB_PORT) || 27017;
const DB_NAME = process.env.DB_NAME || 'SpendTune';

export default async function resetDatabase() {
  mongoose.connect(`mongodb://localhost:${DB_PORT}/${DB_NAME}`);
  await deleteDatabaseRecords();
  await seedDatabase();
  await mongoose.disconnect();
}
