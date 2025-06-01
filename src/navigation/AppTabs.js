import React from 'react';
import { Ionicons } from '@expo/vector-icons';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useAuth } from '../context/AuthContext';

import CarListScreen   from '../screens/Cars/CarListScreen';
import CarAddScreen    from '../screens/Cars/CarAddScreen';
import CarDetailScreen from '../screens/Cars/CarDetailScreen';
import RequestsScreen  from '../screens/Requests/RequestsScreen';

const CarsStack = createNativeStackNavigator();
function MyCarsStack() {
    return (
        <CarsStack.Navigator screenOptions={{ headerShown: false }}>
            <CarsStack.Screen
                name="CarList"
                component={CarListScreen}
                options={{
                    headerShown: true,
                    title: 'My Cars',
                }}
            />
            <CarsStack.Screen name="CarAdd"    component={CarAddScreen} />
            <CarsStack.Screen name="CarDetail" component={CarDetailScreen} />
        </CarsStack.Navigator>
    );
}

const Tab = createBottomTabNavigator();

export default function AppTabs() {
    const { logout } = useAuth();

    const Blank = () => null;

    return (
        <Tab.Navigator
            screenOptions={({ route }) => ({
                headerShown: false,
                tabBarIcon: ({ color, size }) => {
                    const icon =
                        route.name === 'My Cars'  ? 'car-sport-outline' :
                            route.name === 'Requests' ? 'document-text-outline' :
                                'log-out-outline';
                    return <Ionicons name={icon} size={size} color={color} />;
                },
            })}
        >
            <Tab.Screen name="My Cars"  component={MyCarsStack} />
            <Tab.Screen name="Requests" component={RequestsScreen} />

            <Tab.Screen
                name="Logout"
                component={Blank}
                listeners={{
                    tabPress: (e) => {
                        e.preventDefault();
                        logout();
                    },
                }}
            />
        </Tab.Navigator>
    );
}
