// context/AuthContext.js
import React, { createContext, useState, useContext, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [userToken, setUserToken] = useState(undefined);
    const [userId, setUserId]       = useState(null);

    // При старте: вычитываем сохранённые token + userId
    useEffect(() => {
        (async () => {
            const storedToken = await AsyncStorage.getItem('userToken');
            const storedId    = await AsyncStorage.getItem('userId');
            setUserToken(storedToken || null);
            setUserId(storedId || null);
        })();
    }, []);

    const login = async ({ token, userId }) => {
        await AsyncStorage.multiSet([
            ['userToken', token],
            ['userId',      userId],
        ]);
        setUserToken(token);
        setUserId(userId);
    };

    const logout = async () => {
        await AsyncStorage.multiRemove(['userToken', 'userId']);
        setUserToken(null);
        setUserId(null);
    };

    return (
        <AuthContext.Provider value={{ userToken, userId, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
