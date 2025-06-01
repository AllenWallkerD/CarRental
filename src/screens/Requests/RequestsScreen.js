// screens/Requests/RequestsScreen.js
import React, { useState, useEffect } from 'react';
import { View, StyleSheet, FlatList, ActivityIndicator, Text } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getOwnerRequests } from '../../api/CarRental';

export default function RequestsScreen() {
    const [loading, setLoading]   = useState(true);
    const [requests, setRequests] = useState([]);

    useEffect(() => {
        (async () => {
            const ownerId = await AsyncStorage.getItem('userId');
            if (!ownerId) return setLoading(false);

            try {
                const data = await getOwnerRequests(ownerId);
                setRequests(data);
            } finally {
                setLoading(false);
            }
        })();
    }, []);

    if (loading) {
        return (
            <View style={styles.loader}>
                <ActivityIndicator size="large" />
            </View>
        );
    }

    return (
        <FlatList
            contentContainerStyle={{ padding: 16 }}
            data={requests}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => <Text style={styles.item}>{JSON.stringify(item)}</Text>}
        />
    );
}

const styles = StyleSheet.create({
    loader: { flex: 1, justifyContent: 'center', alignItems: 'center' },
    item:   { marginBottom: 12 },
});
