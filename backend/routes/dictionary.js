import express from 'express';
import Word from '../models/Word.js';

const router = express.Router();

import authMiddleware from '../middlewares/authMiddleware.js';

router.get('/entries/en', async (req, res) => {
  const { search = '', limit = 10, page = 1 } = req.query;

  try {
    let query = {};

    if (search) {
      query.word = { $regex: search, $options: 'i' }; 
    }

    const totalDocs = await Word.countDocuments(query);

    const words = await Word.find(query)
      .skip((page - 1) * limit) 
      .limit(Number(limit));   

    if (words.length === 0) {
      return res.status(404).json({ message: 'Nenhuma palavra encontrada' });
    }

    return res.status(200).json({
      results: words.map(word => word.word),
      totalDocs,
      page: Number(page),
      totalPages: Math.ceil(totalDocs / limit),
      hasNext: page < Math.ceil(totalDocs / limit),
      hasPrev: page > 1,
    });
  } catch (err) {
    return res.status(500).json({ message: 'Erro ao buscar palavras', error: err.message });
  }
});

router.get('/entries/en/:word', authMiddleware, async (req, res) => {
  const { word } = req.params;
  const userId = req.user.userId;

  try {
    if (!word) {
      return res.status(400).json({ message: 'A palavra é obrigatória.' });
    }

    const response = await axios.get(
      `https://api.dictionaryapi.dev/api/v2/entries/en/${word}`,
    );

    const wordData = response.data;

    const user = await User.findById(userId);
    if (user) {
      const alreadyInHistory = user.history.find((item) => item.word === word);
      if (!alreadyInHistory) {
        user.history.push({ word });
        await user.save();
      }
    }

    res.status(200).json(wordData);
  } catch (err) {
    if (err.response && err.response.status === 404) {
      return res.status(404).json({ message: 'Palavra não encontrada' });
    }
  }
});

router.post('/entries/en/:word/favorite', authMiddleware, async (req, res) => {
  const { word } = req.params;
  const userId = req.user.userId;

  try {
    if (!word) {
      return res.status(400).json({ message: 'A palavra é obrigatória.' });
    }
    const user = await User.findById(userId);

    const alreadyFavorired = user.favorites.find((i) => i.word === word);
    if (alreadyFavorired) {
      return res.status(400).json({ message: 'Palavra já está nos favoritos' });
    }

    user.favorites.push({ word });
    await user.save();

    res.status(200).json({ message: 'Palavra adicionada aos favoritos' });
  } catch (err) {
    console.error('Erro ao favoritar:', err.message);
    res.status(500).json({
      message: 'Erro ao adicionar palavra aos favoritos',
      error: err.message,
    });
  }
});

router.delete(
  '/entries/en/:word/unfavorite',
  authMiddleware,
  async (req, res) => {
    const { word } = req.params;
    const userId = req.user.userId;

    try {
      if (!word) {
        return res.status(400).json({ message: 'A palavra é obrigatória.' });
      }
      
      const user = await User.findById(userId);

      const index = user.favorites.findIndex((item) => item.word === word);
      if (index === -1) {
        return res
          .status(400)
          .json({ message: 'Palavra não está nos favoritos' });
      }

      user.favorites.splice(index, 1);
      await user.save();

      res.status(200).json({ message: 'Palavra removida dos favoritos' });
    } catch (err) {
      res.status(500).json({
        message: 'Erro ao remover palavra dos favoritos',
        error: err.message,
      });
    }
  },
);

export default router;
