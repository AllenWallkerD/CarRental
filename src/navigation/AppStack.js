import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import CarListScreen from '../screens/Cars/CarListScreen';
import CarFormScreen from '../screens/Cars/CarFormScreen';

const Stack = createNativeStackNavigator();

export default function AppStack() {
    return (
        <Stack.Navigator initialRouteName="My Cars">
            <Stack.Screen name="My Cars" component={CarListScreen} />
            <Stack.Screen name="Register Car" component={CarFormScreen} />
        </Stack.Navigator>
    );
}
