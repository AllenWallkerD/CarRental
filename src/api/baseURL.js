import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const api = axios.create({
    baseURL: 'https://06a6-178-88-24-248.ngrok-free.app/rental',
    timeout: 10000,
});

api.defaults.headers.common['ngrok-skip-browser-warning'] = 'true';

api.interceptors.request.use(async (cfg) => {
    const token = await AsyncStorage.getItem('userToken');
    if (token) {
        cfg.headers.Authorization = token.startsWith('Bearer ')
            ? token
            : `Bearer ${token}`;
    }
    return cfg;
});

export default api;
