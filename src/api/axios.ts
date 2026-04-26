import axios from 'axios';

export const internalApi = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  timeout: 10000 // 10 seconds timeout for all requests
});