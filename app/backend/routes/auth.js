import { Router } from 'express';
import User from '../models/Users.js';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';

const router = Router();

router.post('/signup', async (req, res) => {
  const { name, email, password } = req.body;

  try {
    let user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ message: 'Usuário já existe' });
    }

    user = new User({ name, email, password });
    await user.save();

    const payload = { userId: user._id };

    const token = jwt.sign(payload, 'secret', { expiresIn: '1h' });

    res.status(201).json({
        id: user._id,
        name: user.name,
        token: `Bearer ${token}`
      });

  } catch (err) {
    res.status(500).json({ message: 'Erro ao registrar usuário',  error: err.message });
  }
});

router.post('/signin', async (req, res) => {
    const { email, password } = req.body;
  
    try {
      const user = await User.findOne({ email });
      if (!user) {
        return res.status(400).json({ message: 'Credenciais inválidas' });
      }
  
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return res.status(400).json({ message: 'Credenciais inválidas' });
      }
  
      const payload = { userId: user._id };
  
      const token = jwt.sign(payload, 'secret', { expiresIn: '1h' });
  
      res.status(200).json({
        id: user._id,
        name: user.name,
        token: `Bearer ${token}`
      });
    } catch (err) {
      res.status(500).json({ message: 'Erro no servidor', error: err.message });
    }
  });

export default router;
