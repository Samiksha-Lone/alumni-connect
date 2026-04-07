import axios from 'axios';

const API_BASE = import.meta.env.DEV
	? '/api'
	: (import.meta.env.VITE_API_BASE || 'https://alumni-connect-backend-hrsc.onrender.com') + '/api';

axios.defaults.baseURL = API_BASE;
axios.defaults.withCredentials = true;