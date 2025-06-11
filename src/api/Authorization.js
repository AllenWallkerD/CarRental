import api from './baseURL';

const AuthorizationAPI = {
    register: (payload) => api.post('/auth/owner/register', payload),

    login: async (creds) => {
        const res = await api.post('/auth/owner/login', creds);
        const data = res.data;

        if (data.token && data.userId) {
            const raw = data.token;
            const token = raw.startsWith('Bearer ') ? raw : `Bearer ${raw}`;
            return { userId: data.userId, token };
        }

        if (data.accessToken && data.userId) {
            const tokenType = data.tokenType || 'Bearer';
            const token = tokenType.startsWith('Bearer')
                ? `${tokenType} ${data.accessToken}`
                : `Bearer ${data.accessToken}`;
            return { userId: data.userId, token };
        }

        console.warn('[AuthorizationAPI] Unexpected login response:', data);
        return {
            userId: data.userId || null,
            token: data.token ? (data.token.startsWith('Bearer') ? data.token : `Bearer ${data.token}`) : null,
        };
    },
};

export default AuthorizationAPI;
