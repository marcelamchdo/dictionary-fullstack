import express from 'express';
import authRoutes from './routes/auth.js';
import userRoutes from './routes/user.js';
import dictionaryRoutes from './routes/dictionary.js';
import swaggerUi from 'swagger-ui-express';
import YAML from 'yamljs';
import cors from 'cors';

const swaggerDocument = YAML.load('./swagger.yaml');

const app = express(); 

app.use(express.json());
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
app.use(cors());

app.get('/', (req, res) => {
  res.json({ message: 'Fullstack Challenge 🏅 - Dictionary' });
});

app.use('/api/auth', authRoutes);
app.use('/api/user', userRoutes);
app.use('/api', dictionaryRoutes);

export default app; 