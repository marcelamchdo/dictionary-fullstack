import mongoose from 'mongoose';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url'; 
import Word from './models/Word.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const dbURI = 'mongodb+srv://marceladsgn:M%40rcela1@dictionary.wpggw.mongodb.net/dictionary?retryWrites=true&w=majority'; 
mongoose.connect(dbURI)
  .then(() => {
    console.log('Conectado ao MongoDB');
    importWords();
  })
  .catch(err => console.error('Erro ao conectar ao MongoDB:', err));

const importWords = async () => {
  try {
    const filePath = path.join(__dirname, 'data', 'words.json');

    const data = fs.readFileSync(filePath, 'utf-8');
    const words = JSON.parse(data); 

    const wordDocs = words.map(word => ({ word }));

    await Word.insertMany(wordDocs, { ordered: false });

    console.log('Palavras importadas com sucesso para o banco de dados!');
    process.exit(); 
  } catch (err) {
    if (err.code === 11000) {
      console.error('Palavras duplicadas foram ignoradas.');
    } else {
      console.error('Erro ao importar palavras:', err.message);
    }
    process.exit(1); 
  }
};
