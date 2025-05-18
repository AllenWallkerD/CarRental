import api from './baseURL';

const AuthorizationAPI = {
    register: (payload) => api.post('/auth/register', payload),

    login: (creds) => api.post('/auth/login', creds).then(r => r.data),
};

export default AuthorizationAPI;
