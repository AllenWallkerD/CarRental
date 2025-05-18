import axios from 'axios';
import * as SecureStore from 'expo-secure-store';

const BASE_URL = 'https://0961-178-88-17-211.ngrok-free.app/rental';

const api = axios.create({
    baseURL: BASE_URL,
    timeout: 10000,
});

api.defaults.headers.common['ngrok-skip-browser-warning'] = 'true';

/* attach JWT if it’s already saved */
api.interceptors.request.use(async (cfg) => {
    const token = await SecureStore.getItemAsync('userToken');
    if (token) cfg.headers.Authorization = `Bearer ${token}`;
    return cfg;
});

export default api;
