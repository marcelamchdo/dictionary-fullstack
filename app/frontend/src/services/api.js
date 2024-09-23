import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:3000/',
});

export const setToken = (token) => {
  console.log('Token configurado no Axios:', token);
  api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
};


export default api;
