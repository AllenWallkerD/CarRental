import React, { useState } from 'react';
import { View, TextInput, Button } from 'react-native';

export default function CarFormScreen({ navigation }) {
    const [model, setModel] = useState('');
    const [plate, setPlate] = useState('');
    const handleSave = () => {
        navigation.goBack();
    };

    return (
        <View style={{ flex: 1, padding: 20 }}>
            <TextInput placeholder="Car model" value={model} onChangeText={setModel} />
            <TextInput placeholder="Plate number" value={plate} onChangeText={setPlate} />
            <Button title="Save" onPress={handleSave} />
        </View>
    );
}
