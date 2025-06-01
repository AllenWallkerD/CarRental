import api from './baseURL';

export const addCar = async (userId, data) => {
    try {
        const res = await api.post(`/user/${userId}/add/cars`, data);
        return res.data;
    } catch (err) {
        const errMsg = err?.response?.data || err.message;
        console.error('Add car error:', errMsg);
        throw err;
    }
};

export const listCars = async (userId) => {
    try {
        const res = await api.get(`/user/${userId}/cars`);
        return res.data;
    } catch (err) {
        const errMsg = err?.response?.data || err.message;
        console.error('listCars error:', errMsg);
        throw err;
    }
};

export const getOwnerRequests = async (ownerId) => {
    try {
        const res = await api.get(`/owner-requests/${ownerId}`);
        return res.data;
    } catch (err) {
        const errMsg = err?.response?.data || err.message;
        console.error('getOwnerRequests error:', errMsg);
        throw err;
    }
};

export const approveRequest = async (ownerId, requestId) => {
    try {
        const res = await api.post(`/user/${ownerId}/approve/${requestId}`);
        return res.data;
    } catch (err) {
        const errMsg = err?.response?.data || err.message;
        console.error('approveRequest error:', errMsg);
        throw err;
    }
};
