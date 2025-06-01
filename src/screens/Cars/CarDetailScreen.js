// screens/Cars/CarDetailScreen.js
import React from 'react';
import {
    SafeAreaView,
    View,
    Text,
    StyleSheet,
    Image,
    ScrollView,
    TouchableOpacity,
    Dimensions,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import MapView, { Marker } from 'react-native-maps';

const { width: screenW } = Dimensions.get('window');

export default function CarDetailScreen({ navigation, route }) {
    const { car } = route.params;

    // Проверяем, есть ли валидные координаты
    const hasCoordinates =
        car.latitude != null &&
        car.longitude != null &&
        !isNaN(car.latitude) &&
        !isNaN(car.longitude);

    return (
        <LinearGradient
            colors={['#FFFFFF', '#F3F9FF', '#E6F2FF']}
            start={{ x: 0.5, y: 0 }}
            end={{ x: 0.5, y: 1 }}
            style={{ flex: 1 }}
        >
            <SafeAreaView style={styles.container}>
                {/* Заголовок с кнопкой «назад» и названием машины */}
                <View style={styles.header}>
                    <TouchableOpacity onPress={() => navigation.goBack()}>
                        <Ionicons name="chevron-back" size={28} color="#0A84FF" />
                    </TouchableOpacity>
                    <Text style={styles.title}>
                        {car.brand} {car.model}
                    </Text>
                    <View style={{ width: 28 }} />
                </View>

                <ScrollView contentContainerStyle={{ paddingBottom: 24 }}>
                    {/* === Карусель изображений === */}
                    <ScrollView
                        horizontal
                        pagingEnabled
                        showsHorizontalScrollIndicator={false}
                        style={styles.carousel}
                    >
                        {/* К каждому URL из car.imageUrls рендерим <Image source={{uri: url}} /> */}
                        {car.imageUrls.map((url, idx) => (
                            <Image
                                key={idx}
                                source={{ uri: url }}
                                style={styles.carouselImage}
                            />
                        ))}
                    </ScrollView>

                    {/* Точки-индикаторы (dots) под каруселью */}
                    <View style={styles.dotsContainer}>
                        {car.imageUrls.map((_, idx) => (
                            <View key={idx} style={styles.dot} />
                        ))}
                    </View>

                    {/* === Карточка с данными машины === */}
                    <View style={styles.card}>
                        {/* Brand */}
                        <View style={styles.row}>
                            <Text style={styles.rowLabel}>Brand</Text>
                            <Text style={styles.rowValue}>{car.brand}</Text>
                        </View>
                        <View style={styles.separator} />

                        {/* Model */}
                        <View style={styles.row}>
                            <Text style={styles.rowLabel}>Model</Text>
                            <Text style={styles.rowValue}>{car.model}</Text>
                        </View>
                        <View style={styles.separator} />

                        {/* Year */}
                        <View style={styles.row}>
                            <Text style={styles.rowLabel}>Year</Text>
                            <Text style={styles.rowValue}>{String(car.year)}</Text>
                        </View>
                        <View style={styles.separator} />

                        {/* Color */}
                        <View style={styles.row}>
                            <Text style={styles.rowLabel}>Color</Text>
                            <Text style={styles.rowValue}>{car.color}</Text>
                        </View>
                        <View style={styles.separator} />

                        {/* Price/Day */}
                        <View style={styles.row}>
                            <Text style={styles.rowLabel}>Price/Day</Text>
                            <Text style={styles.rowValue}>${car.pricePerDay}</Text>
                        </View>
                        <View style={styles.separator} />

                        {/* Country */}
                        <View style={styles.row}>
                            <Text style={styles.rowLabel}>Country</Text>
                            <Text style={styles.rowValue}>{car.country}</Text>
                        </View>
                        <View style={styles.separator} />

                        {/* City */}
                        <View style={styles.row}>
                            <Text style={styles.rowLabel}>City</Text>
                            <Text style={styles.rowValue}>{car.city}</Text>
                        </View>
                        <View style={styles.separator} />

                        {/* Available */}
                        <View style={styles.row}>
                            <Text style={styles.rowLabel}>Available</Text>
                            <Text style={styles.rowValue}>
                                {car.available ? 'Yes' : 'No'}
                            </Text>
                        </View>
                        <View style={styles.separator} />

                        {/* Owner Name */}
                        <View style={styles.row}>
                            <Text style={styles.rowLabel}>Owner Name</Text>
                            <Text style={styles.rowValue}>
                                {car.ownerFirstName} {car.ownerLastName}
                            </Text>
                        </View>
                        <View style={styles.separator} />

                        {/* Owner Email */}
                        <View style={styles.row}>
                            <Text style={styles.rowLabel}>Owner Email</Text>
                            <Text style={styles.rowValue}>{car.ownerEmail}</Text>
                        </View>
                        <View style={styles.separator} />

                        {/* Owner Phone */}
                        <View style={styles.row}>
                            <Text style={styles.rowLabel}>Owner Phone</Text>
                            <Text style={styles.rowValue}>{car.ownerPhoneNumber}</Text>
                        </View>

                        {/* Описание (если есть) */}
                        {car.description ? (
                            <>
                                <View style={styles.separator} />
                                <View style={[styles.row, { alignItems: 'flex-start' }]}>
                                    <Text style={styles.rowLabel}>Description</Text>
                                    <Text style={[styles.rowValue, { flex: 1 }]}>
                                        {car.description}
                                    </Text>
                                </View>
                            </>
                        ) : null}
                    </View>

                    {/* === Карта с маркером, если заданы координаты === */}
                    {hasCoordinates && (
                        <View style={styles.mapContainer}>
                            <MapView
                                style={styles.map}
                                initialRegion={{
                                    latitude: car.latitude,
                                    longitude: car.longitude,
                                    latitudeDelta: 0.01,
                                    longitudeDelta: 0.01,
                                }}
                            >
                                <Marker
                                    coordinate={{
                                        latitude: car.latitude,
                                        longitude: car.longitude,
                                    }}
                                    title={`${car.brand} ${car.model}`}
                                    description={`${car.city}, ${car.country}`}
                                />
                            </MapView>
                        </View>
                    )}
                </ScrollView>
            </SafeAreaView>
        </LinearGradient>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1 },

    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 16,
        paddingVertical: 12,
    },
    title: { fontSize: 20, fontWeight: '700', color: '#1E2B3B' },

    carousel: {
        width: screenW,
        height: 220,
        marginBottom: 12,
    },
    carouselImage: {
        width: screenW,
        height: 220,
        resizeMode: 'cover',
    },
    dotsContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        gap: 6,
        marginBottom: 24,
    },
    dot: {
        width: 8,
        height: 8,
        borderRadius: 4,
        backgroundColor: '#C5CED6',
    },

    card: {
        borderRadius: 16,
        backgroundColor: 'rgba(255,255,255,0.8)',
        marginHorizontal: 16,
        paddingHorizontal: 20,
        paddingVertical: 16,
        elevation: 2,
        shadowColor: '#000',
        shadowOpacity: 0.1,
        shadowRadius: 6,
        shadowOffset: { width: 0, height: 2 },
        marginBottom: 24,
    },

    row: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 8,
    },
    rowLabel: {
        fontSize: 16,
        fontWeight: '500',
        color: '#3A485A',
    },
    rowValue: {
        fontSize: 16,
        fontWeight: '600',
        color: '#1E2B3B',
        flexShrink: 1,
        textAlign: 'right',
    },
    separator: {
        height: 1,
        backgroundColor: '#E0E6EF',
    },

    mapContainer: {
        height: 200,
        marginHorizontal: 16,
        borderRadius: 16,
        overflow: 'hidden',
        marginTop: 16,
        marginBottom: 24,
    },
    map: {
        flex: 1,
    },
});
