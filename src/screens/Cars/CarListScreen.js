// screens/Cars/CarListScreen.js
import React, { useState, useCallback } from 'react';
import {
    SafeAreaView,
    View,
    StyleSheet,
    FlatList,
    ActivityIndicator,
    TouchableOpacity,
    Text,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import CarCard from '../../components/CarCard';
import { listCars } from '../../api/CarRental';
import { useAuth } from '../../context/AuthContext';
import { useFocusEffect } from '@react-navigation/native';

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
                .then(res => {
                    setCars(res);
                })
                .catch(err => {
                    console.log(
                        '[CarListScreen] listCars error:',
                        err?.response?.data || err.message
                    );
                    setCars([]);
                })
                .finally(() => setLoading(false));
        }, [userId, userToken])
    );

    return (
        <LinearGradient
            colors={['#FFFFFF', '#F3F9FF', '#E6F2FF']}
            start={{ x: 0.5, y: 0 }}
            end={{ x: 0.5, y: 1 }}
            style={{ flex: 1 }}
        >
            <SafeAreaView style={styles.container}>
                <View style={styles.addWrapper}>
                    <TouchableOpacity
                        style={styles.addButton}
                        onPress={() => navigation.navigate('CarAdd', { userId })}
                    >
                        <Ionicons
                            name="add-circle-outline"
                            size={20}
                            color="#FFF"
                            style={{ marginRight: 8 }}
                        />
                        <Text style={styles.addText}>Add a Car</Text>
                    </TouchableOpacity>
                </View>

                {loading ? (
                    <View style={styles.loader}>
                        <ActivityIndicator size="large" />
                    </View>
                ) : (
                    <FlatList
                        style={styles.list}
                        contentContainerStyle={{ paddingVertical: 16 }}
                        data={cars}
                        keyExtractor={item => item.id}
                        renderItem={({ item }) => (
                            <CarCard
                                item={item}
                                onPress={() =>
                                    navigation.navigate('CarDetail', { car: item })
                                }
                            />
                        )}
                        ListEmptyComponent={() => (
                            <View style={styles.empty}>
                                <Text>No cars found.</Text>
                            </View>
                        )}
                    />
                )}
            </SafeAreaView>
        </LinearGradient>
    );
}

const blue = '#0A84FF';
const lightBlue = '#5EB4FF';

const styles = StyleSheet.create({
    container: { flex: 1 },
    addWrapper: {
        alignItems: 'center',
        marginTop: 20,
        paddingHorizontal: 16,
        paddingBottom: 20,
        backgroundColor: 'transparent',
    },
    addButton: {
        width: '100%',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: lightBlue,
        borderColor: blue,
        borderWidth: 1,
        borderRadius: 12,
        paddingVertical: 12,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5,
    },
    addText: { color: '#FFF', fontSize: 17, fontWeight: '600' },
    loader: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    list: {
        flex: 1
    },
    empty: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        paddingTop: 40,
    },
});
