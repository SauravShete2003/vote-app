import axios from 'axios';
const API_BASE_URL = process.env.REACT_APP_API_URL || '/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
});

export const login = (username, password) => api.post('/login', { username, password });
export const vote = (option) => api.post('/vote', { option });
export const getResults = () => api.get('/results');
export const getMe = () => api.get('/me');

export default api;
