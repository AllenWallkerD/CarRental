import React from 'react';
import { View, Text } from 'react-native';

export default function CarCard({ car }) {
    return (
        <View style={{ padding: 16, borderBottomWidth: 1 }}>
            <Text>{car.model}</Text>
            <Text>{car.plate}</Text>
        </View>
    );
}
