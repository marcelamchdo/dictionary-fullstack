import { Button, Input } from '@mantine/core';
import { useState } from 'react';
import api, { setToken } from '../services/api';
import { useNavigate } from 'react-router-dom';
import { IconAt, IconKey } from '@tabler/icons-react';
import '../../src/styles/Login.css';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      const response = await api.post('/api/auth/signin', { email, password });
      const token = response.data.token;
      localStorage.setItem('token', token);
      setToken(token); 
      navigate('/home');
    } catch (err) {
      setError('Credenciais inválidas');
    }
  };

  return (
    <div className="login-container">
      <div className="login-box">
        <Input
          className="login-input"
          label="Email"
          value={email}
          onChange={(e) => setEmail(e.currentTarget.value)}
          placeholder="Email"
          leftSection={<IconAt size={16} />}
          leftSectionWidth={40}
        />
        <Input
          className="login-input"
          label="Password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.currentTarget.value)}
          placeholder="Senha"
          leftSection={<IconKey size={16} />}
          leftSectionWidth={40}
        />
        {error && <p>{error}</p>}
        <Button className="login-button" onClick={handleLogin}>Entrar</Button>
      </div>
    </div>
  );
}
