import { Router } from 'express';
import User from '../models/Users.js';

const router = Router();

router.post('/register', async (req, res) => {
  const { name, email, password } = req.body;

  try {
    let user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ message: 'Usuário já existe' });
    }

    user = new User({ name, email, password });
    await user.save();

    res.status(201).json({ message: 'Usuário registrado com sucesso!' });
  } catch (err) {
    console.error('Erro detalhado:', err); 
    res.status(500).json({ message: 'Erro ao registrar usuário' });
  }
});

export default router;
