import axios from 'axios';

// Use dev proxy when running locally
const API_BASE = import.meta.env.DEV
	? ''
	: import.meta.env.VITE_API_BASE || 'https://alumni-connect-backend-hrsc.onrender.com';

axios.defaults.withCredentials = true;
axios.defaults.baseURL = API_BASE;