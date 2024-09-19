import express from 'express';
import mongoose from 'mongoose';  
import authRoutes from './routes/auth.js';
import userRoutes from './routes/user.js';
import dictionaryRoutes from './routes/dictionary.js';

const app = express();
const PORT = process.env.PORT || 3000;

const dbURI = 'mongodb+srv://marceladsgn:M%40rcela1@dictionary.wpggw.mongodb.net/dictionary?retryWrites=true&w=majority';

app.use(express.json());


app.get('/', (req, res) => {
  res.json({ message: 'Fullstack Challenge 🏅 - Dictionary' });
});


app.use('/api/auth', authRoutes);
app.use('/api/user', userRoutes);
app.use('/api', dictionaryRoutes); 


mongoose.connect(dbURI)
  .then(() => {
    console.log('Conectado ao MongoDB');
    app.listen(PORT, () => {
      console.log(`Servidor rodando na porta ${PORT}`);
    });
  })
  .catch((err) => {
    console.error('Erro ao conectar ao MongoDB:', err.message);
  });
