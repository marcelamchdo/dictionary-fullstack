import express from 'express';
import authMiddleware from '../middlewares/authMiddleware.js';
import User from '../models/Users.js';

const router = express.Router();

router.get('/user', authMiddleware, (req, res) => {
  res.json({
    id: req.user.userId, 
    message: 'Informações do usuário autenticado'
  });
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

export default router;