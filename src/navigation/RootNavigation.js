import React from 'react';
import { useAuth } from '../context/AuthContext';
import AuthStack from './AuthStack';
import AppStack from './AppStack';
import SplashScreen from '../screens/SplashScreen';

export default function RootNavigation() {
    const { userToken } = useAuth();
    if (userToken === undefined) return <SplashScreen />;
    return userToken ? <AppStack /> : <AuthStack />;
}
