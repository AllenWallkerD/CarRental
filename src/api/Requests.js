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