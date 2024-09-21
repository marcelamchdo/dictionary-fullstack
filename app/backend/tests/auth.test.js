import request from 'supertest';
import mongoose from 'mongoose';
import app from '../app';
import User from '../models/Users';

jest.setTimeout(30000);
let token;

describe('Auth Endpoints', () => {

  beforeAll(async () => {
    const dbURI = 'mongodb+srv://marceladsgn:M%40rcela1@dictionary.wpggw.mongodb.net/dictionary?retryWrites=true&w=majority';
    await mongoose.connect(dbURI, {
      serverSelectionTimeoutMS: 30000,
    });

    await User.deleteMany({});
  });

  it('Should create a new user on signup', async () => {
    const res = await request(app)
      .post('/api/auth/signup')
      .send({
        name: 'User',
        email: 'user@example.com',
        password: 'password123',
      });

    expect(res.statusCode).toEqual(201);
    expect(res.body).toHaveProperty('id');
    expect(res.body).toHaveProperty('name');
    expect(res.body).toHaveProperty('token');

    token = res.body.token;
  });

  it('Should authenticate the user on signin', async () => {
    const res = await request(app)
      .post('/api/auth/signin')
      .send({
        email: 'user@example.com',
        password: 'password123',
      });

    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty('id');
    expect(res.body).toHaveProperty('name');
    expect(res.body).toHaveProperty('token');

    token = res.body.token;
  });

  it('Should return an error when authenticating with wrong credentials', async () => {
    const res = await request(app)
      .post('/api/auth/signin')
      .send({
        email: 'user@example.com',
        password: 'wrongpassword',
      });

    expect(res.statusCode).toEqual(400);
    expect(res.body.message).toBe('Credenciais inválidas');
  });

  it('Should not allow login with an unregistered email', async () => {
    const res = await request(app)
      .post('/api/auth/signin')
      .send({
        email: 'nonexistent@example.com',
        password: 'password123',
      });

    expect(res.statusCode).toEqual(400);
    expect(res.body.message).toBe('Credenciais inválidas');
  });

  it('Should prevent registration of an existing user', async () => {
    const res = await request(app)
      .post('/api/auth/signup')
      .send({
        name: 'User',
        email: 'user@example.com',
        password: 'password123',
      });

    expect(res.statusCode).toEqual(400);
    expect(res.body.message).toBe('Usuário já existe');
  });

  it('Should return error 500 if there is a failure registering a new user', async () => {
    const res = await request(app)
      .post('/api/auth/signup')
      .send({
        name: 'User Test',
        password: 'password123',
      });

    expect(res.statusCode).toEqual(500);
    expect(res.body.message).toBe('Erro ao registrar usuário');
  });

  it('Should return error 500 if there is a server failure during authentication', async () => {
    jest.spyOn(User, 'findOne').mockImplementationOnce(() => {
      throw new Error('Database error');
    });

    const res = await request(app)
      .post('/api/auth/signin')
      .send({
        email: 'user@example.com',
        password: 'password123',
      });

    expect(res.statusCode).toEqual(500);
    expect(res.body.message).toBe('Erro no servidor');
  });

  afterAll(async () => {
    await mongoose.connection.close();
  });
});