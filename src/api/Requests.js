import api from "./baseURL";

export const listOwnerRequests = async (ownerId) => {
    try {
        const response = await api.get(`/owner-requests/${ownerId}`);
        return response.data;
    } catch (err) {
        const errMsg = err?.response?.data || err.message;
        console.error('[listOwnerRequests] Error:', errMsg);
        throw err;
    }
};

export const approveRequest = async (ownerId, requestId) => {
    try {
        const response = await api.put(`/user/${ownerId}/approve/${requestId}`);
        return response.data;
    } catch (err) {
        const errMsg = err?.response?.data || err.message;
        console.error('[approveRequest] Error:', errMsg);
        throw err;
    }
};

export const rejectRequest = async (ownerId, requestId) => {
    try {
        const response = await api.put(`/user/${ownerId}/reject/${requestId}`);
        return response.data;
    } catch (err) {
        const errMsg = err?.response?.data || err.message;
        console.error('[rejectRequest] Error:', errMsg);
        throw err;
    }
};
