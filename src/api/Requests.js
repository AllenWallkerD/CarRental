import api from "./baseURL";

export const listOwnerRequests = async (ownerId) => {
    try {
        const response = await api.get(`/rental/owner-requests`);
        return response.data;
    } catch (err) {
        const errMsg = err?.response?.data || err.message;
        console.error('[listOwnerRequests] Error:', errMsg);
        throw err;
    }
};

export const approveRequest = async (ownerId, requestId) => {
    try {
        const response = await api.post(`/rental/owner/request/${requestId}/approve`);
        return response.data;
    } catch (err) {
        const errMsg = err?.response?.data || err.message;
        console.error('[approveRequest] Error:', errMsg);
        throw err;
    }
};

export const rejectRequest = async (ownerId, requestId) => {
    try {
        const response = await api.post(`/rental/owner/request/${requestId}/reject`);
        return response.data;
    } catch (err) {
        const errMsg = err?.response?.data || err.message;
        console.error('[rejectRequest] Error:', errMsg);
        throw err;
    }
};
