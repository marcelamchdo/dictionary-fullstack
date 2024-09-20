import express from 'express';
import authMiddleware from '../middlewares/authMiddleware.js';
import User from '../models/Users.js';

const router = express.Router();

router.get('/user', authMiddleware, (req, res) => {
  try {
    return res.status(200).json({
      id: req.user.userId, 
      message: 'Informações do usuário autenticado'
    });
  } catch (err) {
    return res.status(500).json({ message: 'Erro ao buscar informações do usuário' });
  }
});

router.get('/me', authMiddleware, async (req, res) => {
  const userId = req.user.userId; 

  try {
    const user = await User.findById(userId).select('-password'); 

    if (!user) {
      return res.status(404).json({ message: 'Usuário não encontrado' });
    }

    res.status(200).json(user);
  } catch (err) {
    res.status(500).json({ message: 'Erro ao buscar perfil do usuário', error: err.message });
  }
});

router.get('/me/history', authMiddleware, async (req, res) => {
  const userId = req.user.userId;
  const { page = 1, limit = 10 } = req.query;

  try {
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: 'Usuário não encontrado' });
    }

    if (user.history.length === 0) {
      return res.status(204).send();
    }

    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;
    const totalDocs = user.history.length;

    const paginatedHistory = user.history.slice(startIndex, endIndex).map(entry => ({
      word: entry.word,
      added: entry.viewedAt
    }));

    res.status(200).json({
      results: paginatedHistory,
      totalDocs,
      page: Number(page),
      totalPages: Math.ceil(totalDocs / limit),
      hasNext: endIndex < totalDocs,
      hasPrev: startIndex > 0
    });
  } catch (err) {
    res.status(500).json({ message: 'Erro ao buscar histórico do usuário', error: err.message });
  }
});

router.get('/me/favorites', authMiddleware, async (req, res) => {
  const userId = req.user.userId; 
  const { page = 1, limit = 10 } = req.query;

  try {
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: 'Usuário não encontrado' });
    }

    if (user.favorites.length === 0) {
      return res.status(204).send();
    }

    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;
    const totalDocs = user.favorites.length;

    const paginatedFavorites = user.favorites.slice(startIndex, endIndex).map(favorite => ({
      word: favorite.word,
      added: favorite.addedAt
    }));

    res.status(200).json({
      results: paginatedFavorites,
      totalDocs,
      page: Number(page),
      totalPages: Math.ceil(totalDocs / limit),
      hasNext: endIndex < totalDocs,
      hasPrev: startIndex > 0
    });
  } catch (err) {
    res.status(500).json({ message: 'Erro ao buscar favoritos do usuário', error: err.message });
  }
});





export default router;