import app from '../app';
import request from 'supertest';
import mongoose from 'mongoose';
import apiClient from '../API/plaidClient';
import MOCK_USER from './mockData';

let MOCK_USER_TOKEN: string = '';
let API_TOKEN: any = {};

/* Connecting to the database before each test. */
const DB_PORT = Number(process.env.DB_PORT) || 27017;
const DB_NAME = 'SpendTune-test';

beforeAll(async () => {
  await mongoose.connect(`mongodb://localhost:${DB_PORT}/${DB_NAME}`);
});

/* Closing database connection after each test. */
afterAll(async () => {
  await mongoose.connection.close();
});

describe('\nREGISTER USER', () => {
  it('Should successfully register user --> POST /register', async () => {
    const res = await request(app).post('/register').send({
      email: MOCK_USER.email,
      password: MOCK_USER.password,
      firstName: MOCK_USER.firstName,
      lastName: MOCK_USER.lastName,
    });
    expect(res.statusCode).toBe(201);
    expect(res.body.user.email).toBe(MOCK_USER.email);
    expect(res.body.token).toBeTruthy();
  });

  it('Should throw 409 when user exist --> POST /register', async () => {
    const res = await request(app).post('/register').send({
      email: MOCK_USER.email,
      password: MOCK_USER.password,
      firstName: MOCK_USER.firstName,
      lastName: MOCK_USER.lastName,
    });
    expect(res.statusCode).toBe(409);
  });

  it('Should throw 400 when no email --> POST /register', async () => {
    const res = await request(app).post('/register').send({
      email: '',
      password: MOCK_USER.password,
      firstName: MOCK_USER.firstName,
      lastName: MOCK_USER.lastName,
    });
    expect(res.statusCode).toBe(400);
  });

  it('Should throw 400 when no password --> POST /register', async () => {
    const res = await request(app).post('/register').send({
      email: MOCK_USER.email,
      password: '',
      firstName: MOCK_USER.firstName,
      lastName: MOCK_USER.lastName,
    });
    expect(res.statusCode).toBe(400);
  });

  it('Should throw 400 when no firstName --> POST /register', async () => {
    const res = await request(app).post('/register').send({
      email: MOCK_USER.email,
      password: MOCK_USER.password,
      firstName: '',
      lastName: MOCK_USER.lastName,
    });
    expect(res.statusCode).toBe(400);
  });

  it('Should throw 400 when no lastName --> POST /register', async () => {
    const res = await request(app).post('/register').send({
      email: MOCK_USER.email,
      password: MOCK_USER.password,
      firstName: MOCK_USER.firstName,
      lastName: '',
    });
    expect(res.statusCode).toBe(400);
  });
});

describe('\nLOGIN USER', () => {
  it('Should successfully login user --> POST /login', async () => {
    const res = await request(app).post('/login').send({
      email: MOCK_USER.email,
      password: MOCK_USER.password,
    });
    expect(res.statusCode).toBe(200);
    expect(res.body.user.email).toBe(MOCK_USER.email);
    MOCK_USER_TOKEN = res.body.token;
    expect(res.body.token).toBeTruthy();
  });

  it('Should throw 401 when wrong password --> POST /login', async () => {
    const res = await request(app).post('/login').send({
      email: MOCK_USER.email,
      password: 'WRONG_PASSWORD',
    });
    expect(res.statusCode).toBe(401);
  });

  it('Should throw 401 when no password --> POST /login', async () => {
    const res = await request(app).post('/login').send({
      email: MOCK_USER.email,
      password: '',
    });
    expect(res.statusCode).toBe(401);
  });

  it('Should throw 401 when wrong email --> POST /login', async () => {
    const res = await request(app).post('/login').send({
      email: 'WRONG_EMAIL',
      password: MOCK_USER.password,
    });
    expect(res.statusCode).toBe(401);
  });

  it('Should throw 401 when no email --> POST /login', async () => {
    const res = await request(app).post('/login').send({
      email: '',
      password: MOCK_USER.password,
    });
    expect(res.statusCode).toBe(401);
  });
});

describe('\nCREATE LINK TOKEN', () => {
  it('Should successfully create link token --> GET /category/add', async () => {
    const res = await request(app)
      .get('/api/create-link-token')
      .set('Authorization', `Bearer ${MOCK_USER_TOKEN}`)
      .send();
    expect(res.statusCode).toBe(200);
    API_TOKEN = res.body;
    console.log('API_TOKEN: ', API_TOKEN);
  });
});

describe('\nADD CATEGORY', () => {
  it('Should successfully add new category --> POST /category/add', async () => {
    const res = await request(app)
      .post('/category/add')
      .set('Authorization', `Bearer ${MOCK_USER_TOKEN}`)
      .send({
        category: 'taxi',
      });
    expect(res.statusCode).toBe(200);
  });

  it('Should throw 401 if user not found --> POST /category/add', async () => {
    const res = await request(app)
      .post('/category/add')
      .set('Authorization', `Bearer ${'NOT_VALID_TOKEN'}`)
      .send({
        category: 'taxi',
      });
    expect(res.statusCode).toBe(401);
  });
});

describe('\nDELETE USER', () => {
  it('Should successfully delete user --> DELETE /user', async () => {
    const res = await request(app)
      .delete('/user')
      .set('Authorization', `Bearer ${MOCK_USER_TOKEN}`)
      .send({
        email: MOCK_USER.email,
      });
    expect(res.statusCode).toBe(200);
    MOCK_USER_TOKEN = '';
  });

  it('Should throw 401 when user not found --> DELETE /user', async () => {
    const res = await request(app)
      .delete('/user')
      .set('Authorization', `Bearer ${MOCK_USER_TOKEN}`)
      .send({
        email: MOCK_USER.email,
      });
    expect(res.statusCode).toBe(401);
  });
});

describe('TEST 404', () => {
  it('Should successfully throw 404 --> GET /unknown-route', async () => {
    const res = await request(app).get('/unknown-route').send();
    expect(res.statusCode).toBe(404);
  });
});
