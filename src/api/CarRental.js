import api from './baseURL';

export const addCar = async (userId, data) => {
    try {
        const res = await api.post(`rental/add/cars`, data);
        return res.data;
    } catch (err) {
        const errMsg = err?.response?.data || err.message;
        console.error('Add car error:', errMsg);
        throw err;
    }
};

export const listCars = async (userId) => {
    try {
        const res = await api.get(`rental/owner/cars`);
        return res.data;
    } catch (err) {
        const errMsg = err?.response?.data || err.message;
        console.error('listCars error:', errMsg);
        throw err;
    }
};

export const updateCar = async (userId, carId, formData) => {
    try {
        const res = await api.patch(
            `/rental/update/car/${carId}`,
            formData,
            {
                headers: { 'Content-Type': 'multipart/form-data' },
            }
        );
        return res.data;
    } catch (err) {
        const errMsg = err?.response?.data || err.message;
        console.error('Update car error:', errMsg);
        throw err;
    }
};

export const deleteCar = async (userId, carId) => {
    try {
        const res = await api.delete(`/rental/delete/car/${carId}`);
        return res.data;
    } catch (err) {
        const errMsg = err?.response?.data || err.message;
        console.error('Delete car error:', errMsg);
        throw err;
    }
};
