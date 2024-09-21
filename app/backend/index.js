import mongoose from 'mongoose';
import app from './app.js'; 

const PORT = process.env.PORT || 3000;
const dbURI = 'mongodb+srv://marceladsgn:M%40rcela1@dictionary.wpggw.mongodb.net/dictionary?retryWrites=true&w=majority';

mongoose.connect(dbURI, {
  serverSelectionTimeoutMS: 30000,
  
})
  .then(() => {
    console.log('Conectado ao MongoDB');
    app.listen(PORT, () => {
      console.log(`Servidor rodando na porta ${PORT}`);
    });
  })
  .catch((err) => {
    console.error('Erro ao conectar ao MongoDB:', err.message);
  });
