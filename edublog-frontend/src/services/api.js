import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:3000', // A porta onde o seu servidor Node.js está rodando!
});

export default api;