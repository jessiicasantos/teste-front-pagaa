import axios from 'axios';

export const viaCepApi = axios.create({
  baseURL: import.meta.env.VITE_VIA_CEP_API_URL,
  timeout: 10000
});
