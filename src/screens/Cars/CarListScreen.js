import React, { useState, useCallback } from 'react';
import {
    SafeAreaView,
    View,
    StyleSheet,
    FlatList,
    ActivityIndicator,
    TouchableOpacity,
    Text,
    Alert,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import CarCard from './components/CarCard';
import AddCarButton from './components/AddCarButton';
import { listCars, deleteCar } from '../../api/CarRental';
import { useAuth } from '../../context/AuthContext';
import { useFocusEffect } from '@react-navigation/native';

const blue = '#0A84FF';

export default function CarListScreen({ navigation }) {
    const [cars, setCars] = useState([]);
    const [loading, setLoading] = useState(true);
    const { userId, userToken } = useAuth();

    useFocusEffect(
        useCallback(() => {
            if (userToken === undefined) return;
            if (!userId || !userToken) {
                navigation.replace('Login');
                return;
            }
            setLoading(true);
            listCars(userId)
                .then((res) => setCars(res))
                .catch((err) => {
                    console.log('[CarListScreen] listCars error:', err?.response?.data || err.message);
                    setCars([]);
                })
                .finally(() => setLoading(false));
        }, [userId, userToken])
    );

    const handleDelete = async (carId) => {
        Alert.alert(
            'Delete Car',
            'Are you sure you want to delete this car?',
            [
                { text: 'Cancel', style: 'cancel' },
                {
                    text: 'Delete',
                    style: 'destructive',
                    onPress: async () => {
                        try {
                            setLoading(true);
                            await deleteCar(userId, carId);
                            setCars((prev) => prev.filter((c) => c.id !== carId));
                        } catch (err) {
                            console.log('[CarListScreen] deleteCar error:', err?.response?.data || err.message);
                            Alert.alert('Error', 'Unable to delete car');
                        } finally {
                            setLoading(false);
                        }
                    },
                },
            ],
            { cancelable: true }
        );
    };

    return (
        <LinearGradient
            colors={['#FFFFFF', '#F3F9FF', '#E6F2FF']}
            start={{ x: 0.5, y: 0 }}
            end={{ x: 0.5, y: 1 }}
            style={{ flex: 1 }}
        >
            <SafeAreaView style={styles.container}>
                {loading ? (
                    <View style={styles.loader}>
                        <ActivityIndicator size="large" color={blue} />
                    </View>
                ) : (
                    <FlatList
                        data={cars}
                        keyExtractor={(item) => item.id}
                        renderItem={({ item }) => (
                            <CarCard
                                item={item}
                                onPress={() => navigation.navigate('CarDetail', { car: item })}
                                onDelete={() => handleDelete(item.id)}
                            />
                        )}
                        stickyHeaderIndices={[0]}
                        ListHeaderComponent={
                            <AddCarButton onPress={() => navigation.navigate('CarAdd', { userId })} />
                        }
                        contentContainerStyle={{
                            flexGrow: 1,
                            justifyContent: cars.length === 0 ? 'center' : 'flex-start',
                            paddingHorizontal: 16,
                            paddingBottom: 16,
                        }}
                        ListEmptyComponent={() => (
                            <View style={styles.empty}>
                                <Ionicons
                                    name="car-outline"
                                    size={80}
                                    color={blue}
                                    style={{ marginBottom: 16 }}
                                />
                                <Text style={styles.emptyTitle}>No Cars Yet</Text>
                                <Text style={styles.emptySubtitle}>
                                    You haven’t added any cars. Tap the button above to add your first car.
                                </Text>
                            </View>
                        )}
                    />
                )}
            </SafeAreaView>
        </LinearGradient>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1 },
    loader: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    empty: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    emptyTitle: {
        fontSize: 20,
        fontWeight: '600',
        color: blue,
        marginBottom: 8,
    },
    emptySubtitle: {
        fontSize: 16,
        color: '#666',
        textAlign: 'center',
        marginHorizontal: 40,
    },
});
