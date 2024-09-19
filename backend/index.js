import express from 'express';
import mongoose from 'mongoose';  // Certifique-se de que mongoose está importado
import authRoutes from './routes/auth.js'; // Lembre-se de adicionar a extensão .js

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

app.get('/', (req, res) => {
  res.json({ message: 'Fullstack Challenge 🏅 - Dictionary' });
});

app.use('/api/auth', authRoutes);


mongoose.connect('mongodb://localhost:27017/dictionary')
  .then(() => {
    console.log('Conectado ao MongoDB');
    app.listen(PORT, () => {
      console.log(`Servidor rodando na porta ${PORT}`);
    });
  })
  .catch((err) => {
    console.error('Erro ao conectar ao MongoDB:', err.message);
  });