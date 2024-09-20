import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const txtFilePath = path.join(__dirname, 'data', 'words.txt');

const jsonFilePath = path.join(__dirname, 'data', 'words.json');

const convertTxtToJson = () => {
  try {
    const data = fs.readFileSync(txtFilePath, 'utf-8');

    const wordsArray = data.split('\n').map(word => word.trim()).filter(Boolean);

    fs.writeFileSync(jsonFilePath, JSON.stringify(wordsArray, null, 2), 'utf-8');

    console.log('Arquivo .txt convertido para JSON com sucesso!');
  } catch (err) {
    console.error('Erro ao converter o arquivo:', err);
  }
};

convertTxtToJson();
