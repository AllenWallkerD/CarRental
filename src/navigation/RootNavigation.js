import React from 'react';
import { useAuth } from '../context/AuthContext';
import AuthStack  from './AuthStack';
import AppTabs    from './AppTabs';
import SplashScreen from '../screens/SplashScreen';

export default function RootNavigation() {
    const { userToken } = useAuth();

    if (userToken === undefined) return <SplashScreen />;
    return userToken ? <AppTabs /> : <AuthStack />;
}
