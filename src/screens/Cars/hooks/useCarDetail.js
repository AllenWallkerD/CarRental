import { useState, useEffect } from 'react';
import { Alert } from 'react-native';
import { useAuth } from '../../../context/AuthContext';
import { updateCar } from '../../../api/CarRental';
import { getMakes, getModels } from 'car-info';

export default function useCarDetail(initialCar) {
    const { userId } = useAuth();

    const [car, setCar] = useState(initialCar);
    const [editMode, setEditMode] = useState(false);
    const [loading, setLoading] = useState(false);

    const [brand, setBrand] = useState(initialCar.brand);
    const [model, setModel] = useState(initialCar.model);
    const [year, setYear] = useState(String(initialCar.year));
    const [color, setColor] = useState(initialCar.color);
    const [pricePerDay, setPricePerDay] = useState(String(initialCar.pricePerDay));
    const [country, setCountry] = useState(initialCar.country);
    const [city, setCity] = useState(initialCar.city);
    const [latitude, setLatitude] = useState(String(initialCar.latitude ?? ''));
    const [longitude, setLongitude] = useState(String(initialCar.longitude ?? ''));
    const [description, setDescription] = useState(initialCar.description || '');

    const [brandModalVisible, setBrandModalVisible] = useState(false);
    const [modelModalVisible, setModelModalVisible] = useState(false);
    const [brandSearch, setBrandSearch] = useState('');
    const [modelSearch, setModelSearch] = useState('');

    const allBrands = getMakes();
    const allModels = brand ? getModels(brand) : [];

    const hasCoordinates =
        car.latitude !== null &&
        car.longitude !== null &&
        !isNaN(car.latitude) &&
        !isNaN(car.longitude);

    const toggleEditMode = () => {
        if (editMode) {
        } else {
            setEditMode(true);
        }
    };

    const cancelEdit = () => {
        setBrand(car.brand);
        setModel(car.model);
        setYear(String(car.year));
        setColor(car.color);
        setPricePerDay(String(car.pricePerDay));
        setCountry(car.country);
        setCity(car.city);
        setLatitude(String(car.latitude ?? ''));
        setLongitude(String(car.longitude ?? ''));
        setDescription(car.description || '');
        setEditMode(false);
    };

    // new handleSave now expects formData built externally
    const handleSave = async (formData) => {
        setLoading(true);
        if (!brand.trim() || !model.trim() || !year.trim() || !color.trim()) {
            Alert.alert('Error', 'Brand, model, year, and color are required.');
            setLoading(false);
            return;
        }
        try {
            await updateCar(userId, initialCar.id, formData);
            // assume API returns updated car object
            const updated = {
                ...car,
                brand: brand.trim(),
                model: model.trim(),
                year: Number(year.trim()),
                color: color.trim(),
                pricePerDay: Number(pricePerDay.trim()),
                country: country.trim(),
                city: city.trim(),
                latitude: parseFloat(latitude.trim()) || null,
                longitude: parseFloat(longitude.trim()) || null,
                description: description.trim(),
            };
            setCar(updated);
            setEditMode(false);
        } catch (err) {
            Alert.alert('Update Failed', err?.response?.data || err.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        setCar(initialCar);
        setBrand(initialCar.brand);
        setModel(initialCar.model);
        setYear(String(initialCar.year));
        setColor(initialCar.color);
        setPricePerDay(String(initialCar.pricePerDay));
        setCountry(initialCar.country);
        setCity(initialCar.city);
        setLatitude(String(initialCar.latitude ?? ''));
        setLongitude(String(initialCar.longitude ?? ''));
        setDescription(initialCar.description || '');
        setEditMode(false);
        setLoading(false);
    }, [initialCar]);

    return {
        car,
        editMode,
        loading,
        brand,
        setBrand,
        model,
        setModel,
        year,
        setYear,
        color,
        setColor,
        pricePerDay,
        setPricePerDay,
        country,
        setCountry,
        city,
        setCity,
        latitude,
        setLatitude,
        longitude,
        setLongitude,
        description,
        setDescription,
        brandModalVisible,
        setBrandModalVisible,
        modelModalVisible,
        setModelModalVisible,
        brandSearch,
        setBrandSearch,
        modelSearch,
        setModelSearch,
        allBrands,
        allModels,
        hasCoordinates,
        toggleEditMode,
        cancelEdit,
        handleSave,
    };
}
