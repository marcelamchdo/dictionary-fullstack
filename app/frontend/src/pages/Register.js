import { Button, Input } from '@mantine/core';
import { useState } from 'react';
import api from '../services/api';
import { useNavigate } from 'react-router-dom';
import { IconAt, IconKey, IconUser } from '@tabler/icons-react';
import '../../src/styles/Login.css';

export default function Login() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleRegister = async () => {
    if (password !== confirmPassword) {
      setError('As senhas não coincidem!');
      return;
    }
    
    try {
      const response = await api.post('/api/auth/signup', { name, email, password});
      localStorage.setItem('token', response.data.token);
      navigate('/login');
    } catch (err) {
      setError('Erro ao registrar usuário!')
    }
  };

  return (
    <div className="login-container">
      <div className="login-box">
      <Input
          className="login-input"
          label="Nome"
          value={name}
          onChange={(e) => setName(e.currentTarget.value)}
          placeholder="Nome"
          leftSection={<IconUser size={16} />}
          leftSectionWidth={40}
        />
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
        <Input
          className="login-input"
          label="Password"
          type="password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.currentTarget.value)}
          placeholder="Confirme a senha"
          leftSection={<IconKey size={16} />}
          leftSectionWidth={40}
        />
        {error && <p>{error}</p>}
        <Button className="login-button" onClick={handleRegister}>Registrar</Button>
      </div>
    </div>
  );
}
