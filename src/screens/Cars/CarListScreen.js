import React from 'react';
import { View, FlatList, Button } from 'react-native';
import { useAuth } from '../../context/AuthContext';
import CarCard from '../../components/CarCard';

export default function CarListScreen({ navigation }) {
    const { logout } = useAuth();
    const data = []; // fetch or local state

    return (
        <View style={{ flex: 1 }}>
            <Button title="Add Car" onPress={() => navigation.navigate('Register Car')} />
            <FlatList
                data={data}
                keyExtractor={(item) => item.id.toString()}
                renderItem={({ item }) => <CarCard car={item} />}
                ListEmptyComponent={<Button title="Logout" onPress={logout} />}
            />
        </View>
    );
}
