import express from 'express';
import axios from 'axios';
import User from '../models/Users.js';

const router = express.Router();

import authMiddleware from '../middlewares/authMiddleware.js';

router.get('/entries/en', async (req, res) => {
  const { search, limit = 10, page = 1 } = req.query;

  try {
    if (!search) {
      return res.status(400).json({ message: 'Por favor, forneça um termo de busca.' });
    }

    const response = await axios.get(`https://api.dictionaryapi.dev/api/v2/entries/en/${search}`);

    const results = response.data;

    res.json({
      results: results.slice((page - 1) * limit, page * limit),
      totalDocs: results.length,
      page: Number(page),
      totalPages: Math.ceil(results.length / limit),
      hasNext: page * limit < results.length,
      hasPrev: page > 1,
    });
  } catch (err) {
    if (err.response && err.response.status === 404) {
      return res.status(404).json({ message: 'Palavra não encontrada' });
    }
    res.status(500).json({ message: 'Erro ao buscar palavras', error: err.message });
  }
});

router.get('/entries/en/:word', authMiddleware, async (req, res) => {
    const { word } = req.params;
    const userId = req.user.userId; 
  
    try {
      const response = await axios.get(`https://api.dictionaryapi.dev/api/v2/entries/en/${word}`);
  
      const wordData = response.data;
  
      const user = await User.findById(userId);
      if (user) {
        const alreadyInHistory = user.history.find(item => item.word === word);
        if (!alreadyInHistory) {
          user.history.push({ word });
          await user.save();
        }
      }
  
      res.json(wordData);
    } catch (err) {
      if (err.response && err.response.status === 404) {
        return res.status(404).json({ message: 'Palavra não encontrada' });
      }
      res.status(500).json({ message: 'Erro ao buscar palavra', error: err.message });
    }
  });

export default router;
