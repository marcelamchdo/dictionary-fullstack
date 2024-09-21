import request from 'supertest';
import mongoose from 'mongoose';
import app from '../app';
import User from '../models/Users';
import Word from '../models/Word';
import axios from 'axios';

jest.setTimeout(30000);
let token;
jest.mock('axios');

describe('Entries Endpoints', () => {
  beforeAll(async () => {
    const dbURI =
      'mongodb+srv://marceladsgn:M%40rcela1@dictionary.wpggw.mongodb.net/dictionary?retryWrites=true&w=majority';
    await mongoose.connect(dbURI, {
      serverSelectionTimeoutMS: 30000,
    });

    await User.deleteMany({});

    const signupRes = await request(app).post('/api/auth/signup').send({
      name: 'User',
      email: 'user@example.com',
      password: 'password123',
    });

    expect(signupRes.statusCode).toEqual(201);
    expect(signupRes.body).toHaveProperty('token');
    token = signupRes.body.token.replace('Bearer ', '');
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('Should list words with pagination', async () => {
    const res = await request(app)
      .get('/api/entries/en?page=1&limit=10')
      .set('Authorization', `Bearer ${token}`);

    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty('totalDocs');
    expect(res.body).toHaveProperty('page');
    expect(res.body).toHaveProperty('totalPages');
  });

  it('Should get details of a specific word', async () => {
    const mockWordData = [{ word: 'fire' }];
    axios.get.mockResolvedValueOnce({ data: mockWordData });

    const res = await request(app)
      .get('/api/entries/en/fire')
      .set('Authorization', `Bearer ${token}`);

    expect(res.statusCode).toEqual(200);
    expect(res.body[0].word).toBe('fire');
  });

  it('Should return 404 when searching for a nonexistent word', async () => {
    axios.get.mockRejectedValueOnce({
      response: {
        status: 404,
        data: { message: 'Palavra não encontrada' },
      },
    });

    const res = await request(app)
      .get('/api/entries/en/nonexistentword')
      .set('Authorization', `Bearer ${token}`);

    expect(res.statusCode).toEqual(404);
    expect(res.body.message).toBe('Palavra não encontrada');
  });

  it('Should add a word to user favorites', async () => {
    const res = await request(app)
      .post('/api/entries/en/fire/favorite')
      .set('Authorization', `Bearer ${token}`);

    expect(res.statusCode).toEqual(200);
    expect(res.body.message).toBe('Palavra adicionada aos favoritos');
  });

  it('Should not allow duplicate word in favorites', async () => {
    const res = await request(app)
      .post('/api/entries/en/fire/favorite')
      .set('Authorization', `Bearer ${token}`);

    expect(res.statusCode).toEqual(400);
    expect(res.body.message).toBe('Palavra já está nos favoritos');
  });

  it('Should remove a word from user favorites', async () => {
    const res = await request(app)
      .delete('/api/entries/en/fire/unfavorite')
      .set('Authorization', `Bearer ${token}`);

    expect(res.statusCode).toEqual(200);
    expect(res.body.message).toBe('Palavra removida dos favoritos');
  });

  it('Should return 500 when failing to add a word to favorites', async () => {
    jest.spyOn(User, 'findById').mockImplementationOnce(() => {
      throw new Error('Error fetching user');
    });

    const res = await request(app)
      .post('/api/entries/en/fire/favorite')
      .set('Authorization', `Bearer ${token}`);

    expect(res.statusCode).toEqual(500);
    expect(res.body.message).toBe('Erro ao adicionar palavra aos favoritos');
    expect(res.body.error).toBe('Error fetching user');
  });

  it('Should return 500 when server error occurs while fetching words', async () => {
    jest.spyOn(Word, 'countDocuments').mockImplementationOnce(() => {
      throw new Error('Error counting documents');
    });

    const res = await request(app)
      .get('/api/entries/en')
      .set('Authorization', `Bearer ${token}`);


    expect(res.statusCode).toEqual(500);
    expect(res.body.message).toBe('Erro ao buscar palavras');
    expect(res.body.error).toBe('Error counting documents');
  });

  it('Should search words using a search term', async () => {
    const res = await request(app)
      .get('/api/entries/en?search=ap')
      .set('Authorization', `Bearer ${token}`);

    expect(res.statusCode).toEqual(200);
    expect(res.body.results.length).toBeGreaterThan(0);
  });

  it('Should return 500 when server error occurs while empty word', async () => {
    axios.get.mockResolvedValueOnce(null); 

    const res = await request(app)
      .get('/api/entries/en/word')
      .set('Authorization', `Bearer ${token}`);

    expect(res.statusCode).toEqual(500);
    expect(res.body.message).toBe('Erro ao buscar palavra');
  });

  it('Should fetch the user and add word to history if not already in history', async () => {
    const mockUser = {
      _id: 'user123',
      history: [],
      save: jest.fn(),
    };

    axios.get.mockResolvedValueOnce({
      data: [{ word: 'fire' }]
    });

    jest.spyOn(User, 'findById').mockResolvedValue(mockUser);

    const res = await request(app)
    .get('/api/entries/en/fire')
    .set('Authorization', `Bearer ${token}`);

    console.log('Save should be called:', mockUser.save.mock.calls.length);
    
    console.log(res.body);
    expect(res.statusCode).toEqual(200);
    expect(mockUser.save).toHaveBeenCalled(); 
    expect(mockUser.history).toContainEqual({ word: 'fire' });
  });

  it('Should return 500 if there is an error fetching the user from MongoDB', async () => {
    jest.spyOn(axios, 'get').mockRejectedValue(new Error('Erro ao buscar palavra'));
  
    const res = await request(app)
      .get('/api/entries/en/fire')
      .set('Authorization', `Bearer ${token}`);
  
    expect(res.statusCode).toEqual(500);
    expect(res.body.message).toBe('Erro ao buscar palavra');
    expect(res.body.error).toBe('Erro ao buscar palavra');
  });
  
  it('Should return 500 if there is an error when fetching word from external API', async () => {
    axios.get.mockRejectedValueOnce(new Error('Erro ao buscar palavra'));
  
    const res = await request(app)
      .get('/api/entries/en/fire') 
      .set('Authorization', `Bearer ${token}`);
  
    expect(res.statusCode).toEqual(500);
    expect(res.body.message).toBe('Erro ao buscar palavra');
  });
  
  it('Should return 404 when no words are found with the search term', async () => {
    const res = await request(app)
      .get('/api/entries/en?search=xyz')
      .set('Authorization', `Bearer ${token}`);

    expect(res.statusCode).toEqual(404);
    expect(res.body.message).toBe('Nenhuma palavra encontrada');
  });

  it('Should return 400 when removing a word not in favorites', async () => {
    const res = await request(app)
      .delete('/api/entries/en/banana/unfavorite')
      .set('Authorization', `Bearer ${token}`);

    expect(res.statusCode).toEqual(400);
    expect(res.body.message).toBe('Palavra não está nos favoritos');
  });

  it('Should return 500 when server error occurs while removing a word from favorites', async () => {
    jest.spyOn(User, 'findById').mockImplementationOnce(() => {
      throw new Error('Error fetching user');
    });

    const res = await request(app)
      .delete('/api/entries/en/apple/unfavorite')
      .set('Authorization', `Bearer ${token}`);

    expect(res.statusCode).toEqual(500);
    expect(res.body.message).toBe('Erro ao remover palavra dos favoritos');
    expect(res.body.error).toBe('Error fetching user');
  });

  it('Should fetch word and add to user history', async () => {
    axios.get.mockResolvedValueOnce({
      data: [{ word: 'fire' }],
    });

    const res = await request(app)
      .get('/api/entries/en/fire')
      .set('Authorization', `Bearer ${token}`);

    expect(res.statusCode).toEqual(200);
    const user = await User.findOne({ email: 'user@example.com' });

    expect(user.history.length).toBeGreaterThan(0);
    const wordInHistory = user.history.find((item) => item.word === 'fire');
    expect(wordInHistory).toBeDefined();
    expect(user.history[0].word).toBe('fire');

    const duplicateEntries = user.history.filter(
      (item) => item.word === 'fire'
    );
    expect(duplicateEntries.length).toBe(1);
  });

  it('Should return word history for the user', async () => {
    const res = await request(app)
      .get('/api/user/me/history')
      .set('Authorization', `Bearer ${token}`);

    expect(res.statusCode).toEqual(200);
    expect(res.body.results.length).toBeGreaterThan(0);
    expect(res.body.results[0].word).toBe('fire');
  });

  it('Should handle errors without a 404 response', async () => {
    axios.get.mockRejectedValueOnce(new Error('Network Error')); 

    const res = await request(app)
      .get('/api/entries/en/someword')
      .set('Authorization', `Bearer ${token}`);

    expect(res.statusCode).toEqual(500);
    expect(res.body.message).toBe('Erro ao buscar palavra');
  });

  afterAll(async () => {
    await mongoose.connection.close();
  });
});
