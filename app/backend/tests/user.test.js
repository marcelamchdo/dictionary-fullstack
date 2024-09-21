import request from 'supertest';
import mongoose from 'mongoose';
import app from '../app';
import User from '../models/Users';

jest.setTimeout(30000);
let token;

describe('User Endpoints', () => {
  beforeAll(async () => {
    const dbURI =
      'mongodb+srv://marceladsgn:M%40rcela1@dictionary.wpggw.mongodb.net/dictionary?retryWrites=true&w=majority';
    await mongoose.connect(dbURI, {
      serverSelectionTimeoutMS: 30000,
    });

    await User.deleteMany({});

    const signupRes = await request(app).post('/api/auth/signup').send({
      name: 'User',
      email: `user@example.com`,
      password: 'password123',
    });

    expect(signupRes.statusCode).toEqual(201);
    token = signupRes.body.token;
  });

  it('Should return the authenticated user profile', async () => {
    const res = await request(app)
      .get('/api/user/me')
      .set('Authorization', token);

    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty('_id');
    expect(res.body).toHaveProperty('name');
  });

  it('Should return 404 if the user is not found in /me route', async () => {
    jest.spyOn(User, 'findById').mockReturnValueOnce({
      select: jest.fn().mockResolvedValue(null),
    });

    const res = await request(app)
      .get('/api/user/me')
      .set('Authorization', token);

    expect(res.statusCode).toEqual(404);
    expect(res.body.message).toBe('Usuário não encontrado');
  });

  it('Should return 500 if there is an error fetching the user profile in /me route', async () => {
    jest.spyOn(User, 'findById').mockImplementationOnce(() => {
      throw new Error('Erro ao buscar perfil do usuário');
    });

    const res = await request(app)
      .get('/api/user/me')
      .set('Authorization', token);

    expect(res.statusCode).toEqual(500);
    expect(res.body.message).toBe('Erro ao buscar perfil do usuário');
  });

  it('Should add a word to the user history', async () => {
    const res = await request(app)
      .get('/api/entries/en/fire')
      .set('Authorization', token);

    expect(res.statusCode).toEqual(200);
    expect(res.body[0].word).toBe('fire');
  });

  it('Should return the user word history', async () => {
    const res = await request(app)
      .get('/api/user/me/history')
      .set('Authorization', token);

    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty('results');
    expect(res.body.results).toBeInstanceOf(Array);
    expect(res.body.results.length).toBeGreaterThan(0);
    expect(res.body.results[0]).toHaveProperty('word');
    expect(res.body.results[0].word).toBe('fire');
  });

  it('Should return the list of user favorite words', async () => {
    const res = await request(app)
      .post('/api/entries/en/fire/favorite')
      .set('Authorization', token);

    expect(res.statusCode).toEqual(200);
    expect(res.body.message).toBe('Palavra adicionada aos favoritos');
  });

  it('Should confirm if the word was added in favorites', async () => {
    const res = await request(app)
      .get('/api/user/me/favorites')
      .set('Authorization', token);

    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty('results');
    expect(res.body.results).toBeInstanceOf(Array);
    expect(res.body.results.length).toBeGreaterThan(0);
    expect(res.body.results[0]).toHaveProperty('word');
    expect(res.body.results[0].word).toBe('fire');
  });

  it('Should return 404 if the user is not found in /me/favorites route', async () => {
    jest.spyOn(User, 'findById').mockResolvedValueOnce(null);

    const res = await request(app)
      .get('/api/user/me/favorites')
      .set('Authorization', token);

    expect(res.statusCode).toEqual(404);
    expect(res.body.message).toBe('Usuário não encontrado');
  });

  it('Should return 404 if the user is not found', async () => {
    jest.spyOn(User, 'findById').mockResolvedValueOnce(null);

    const res = await request(app)
      .get('/api/user/me/history')
      .set('Authorization', token);

    expect(res.statusCode).toEqual(404);
    expect(res.body.message).toBe('Usuário não encontrado');
  });

  it('Should return 204 if the user has no history', async () => {
    jest.spyOn(User, 'findById').mockResolvedValueOnce({
      history: [],
    });

    const res = await request(app)
      .get('/api/user/me/history')
      .set('Authorization', token);

    expect(res.statusCode).toEqual(204);
  });

  it('Should return 500 if there is an error fetching user history', async () => {
    jest.spyOn(User, 'findById').mockImplementationOnce(() => {
      throw new Error('Erro ao buscar histórico');
    });

    const res = await request(app)
      .get('/api/user/me/history')
      .set('Authorization', token);

    expect(res.statusCode).toEqual(500);
    expect(res.body.message).toBe('Erro ao buscar histórico do usuário');
  });

  it('Should return 200 and the user favorites list', async () => {
    const mockFavorites = [{ word: 'fire' }, { word: 'water' }];

    jest.spyOn(User, 'findById').mockResolvedValueOnce({
      favorites: mockFavorites,
    });

    const res = await request(app)
      .get('/api/user/me/favorites')
      .set('Authorization', token);

    expect(res.statusCode).toEqual(200);
    expect(res.body.results.length).toBe(2);
    expect(res.body.results[0].word).toBe('fire');
  });

  it('Should return 204 if user has no favorites', async () => {
    jest.spyOn(User, 'findById').mockResolvedValueOnce({
      favorites: [],
    });

    const res = await request(app)
      .get('/api/user/me/favorites')
      .set('Authorization', token);

    expect(res.statusCode).toEqual(204);
  });

  it('Should return 500 if there is an error fetching user favorites', async () => {
    jest.spyOn(User, 'findById').mockImplementationOnce(() => {
      throw new Error('Erro ao buscar favoritos');
    });

    const res = await request(app)
      .get('/api/user/me/favorites')
      .set('Authorization', token);

    expect(res.statusCode).toEqual(500);
    expect(res.body.message).toBe('Erro ao buscar favoritos do usuário');
  });

  it('Should return 401 if no token is provided', async () => {
    const res = await request(app)
      .get('/api/user/me/history')
      .set('Authorization', '');

    expect(res.statusCode).toEqual(401);
    expect(res.body.message).toBe('Autenticação necessária');
  });

  it('Should not add duplicate favorites for a user', async () => {
    const mockFavorites = [{ word: 'fire' }];

    jest.spyOn(User, 'findById').mockResolvedValueOnce({
      favorites: mockFavorites,
    });

    const res = await request(app)
      .post('/api/entries/en/fire/favorite')
      .set('Authorization', token);

    expect(res.statusCode).toEqual(400);
    expect(res.body.message).toBe('Palavra já está nos favoritos');
  });

  afterAll(async () => {
    await mongoose.connection.close();
  });
});
