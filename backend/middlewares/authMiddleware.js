import jwt from 'jsonwebtoken';

const authMiddleware = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Autenticação necessária' });
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, 'secret'); 
    req.user = decoded; 
    next(); 
  } catch (err) {
    return res.status(403).json({ message: 'Token inválido' });
  }
};

export default authMiddleware;
