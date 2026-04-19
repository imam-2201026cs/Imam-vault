import axios from 'axios';

const isLocal = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
const baseURL = isLocal 
  ? (process.env.REACT_APP_API_URL || 'http://localhost:1000') 
  : (process.env.REACT_APP_API_URL_PROD || 'https://imam-vault-backend-hhpu.onrender.com');

const API = axios.create({ 
  baseURL: `${baseURL}/api` 
});

API.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export default API;
