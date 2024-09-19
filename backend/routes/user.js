import express from 'express';
import authMiddleware from '../middlewares/authMiddleware.js';

const router = express.Router();

router.get('/user', authMiddleware, (req, res) => {
  res.json({
    id: req.user.userId, 
    message: 'Informações do usuário autenticado'
  });
});

export default router;