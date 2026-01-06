import axios from 'axios';

const API_BASE = import.meta.env.VITE_API_BASE || 'https://alumni-connect-backend-hrsc.onrender.com';

axios.defaults.withCredentials = true; 
axios.defaults.baseURL = API_BASE;