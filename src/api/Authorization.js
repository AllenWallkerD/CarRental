import api from './baseURL';

const AuthorizationAPI = {
    register: (payload) => api.post('/auth/register', payload),

    login: async (creds) => {
        const res = await api.post('/auth/login', creds);
        const data = res.data;

        // Если backend возвращает { token: "...", userId: "..." }
        if (data.token && data.userId) {
            // Предполагаем, что data.token уже содержит JWT без "Bearer "
            const raw = data.token;
            const token = raw.startsWith('Bearer ') ? raw : `Bearer ${raw}`;
            return { userId: data.userId, token };
        }

        // Если backend возвращает { accessToken: "...", tokenType: "Bearer", userId: "..." }
        if (data.accessToken && data.userId) {
            const tokenType = data.tokenType || 'Bearer';
            const token = tokenType.startsWith('Bearer')
                ? `${tokenType} ${data.accessToken}`
                : `Bearer ${data.accessToken}`;
            return { userId: data.userId, token };
        }

        // На всякий случай — вернём весь объект, чтобы видеть в логах
        console.warn('[AuthorizationAPI] Unexpected login response:', data);
        return {
            userId: data.userId || null,
            token: data.token ? (data.token.startsWith('Bearer') ? data.token : `Bearer ${data.token}`) : null,
        };
    },
};

export default AuthorizationAPI;
