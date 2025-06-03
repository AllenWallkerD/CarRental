import React, { useLayoutEffect, useEffect } from 'react';
import {
    SafeAreaView,
    View,
    Image,
    ScrollView,
    TouchableOpacity,
    TextInput,
    Alert,
    ActivityIndicator,
    StyleSheet,
    Dimensions,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import MapView, { Marker } from 'react-native-maps';
import useCarDetail from './hooks/useCarDetail';
import ChoiceModal from './components/ChoiceModal';
import { Text } from 'react-native';

const { width: screenW } = Dimensions.get('window');
const blue = '#0A84FF';

export default function CarDetailScreen({ navigation, route }) {
    const { car: initialCar } = route.params;
    const {
        car,
        editMode,
        loading,
        brand,
        setBrand,
        model,
        setModel,
        year,
        setYear,
        color,
        setColor,
        pricePerDay,
        setPricePerDay,
        country,
        setCountry,
        city,
        setCity,
        latitude,
        setLatitude,
        longitude,
        setLongitude,
        description,
        setDescription,
        brandModalVisible,
        setBrandModalVisible,
        modelModalVisible,
        setModelModalVisible,
        brandSearch,
        setBrandSearch,
        modelSearch,
        setModelSearch,
        allBrands,
        allModels,
        hasCoordinates,
        toggleEditMode,
        cancelEdit,
        handleSave,
    } = useCarDetail(initialCar);

    useLayoutEffect(() => {
        navigation.setOptions({
            headerShown: true,
            headerTitle: `${car.brand} ${car.model}`,
            headerTitleAlign: 'center',
            headerTintColor: blue,
            headerTitleStyle: {
                fontSize: 20,
                fontWeight: '700',
                color: '#1E2B3B',
            },
            headerLeft: () => (
                <TouchableOpacity
                    onPress={() => navigation.goBack()}
                    style={{ paddingHorizontal: 12 }}
                >
                    <Ionicons name="chevron-back" size={28} color={blue} />
                </TouchableOpacity>
            ),
            headerRight: () => {
                if (loading) {
                    return <ActivityIndicator style={{ marginRight: 16 }} size="small" color={blue} />;
                }
                return (
                    <View style={{ flexDirection: 'row', alignItems: 'center', marginRight: 8 }}>
                        {editMode && (
                            <TouchableOpacity onPress={cancelEdit} style={{ paddingHorizontal: 8 }}>
                                <Ionicons name="close-circle-outline" size={24} color={blue} />
                            </TouchableOpacity>
                        )}
                        <TouchableOpacity onPress={toggleEditMode} style={{ paddingHorizontal: 8 }}>
                            <Ionicons
                                name={editMode ? 'checkmark-circle-outline' : 'pencil-outline'}
                                size={24}
                                color={blue}
                            />
                        </TouchableOpacity>
                    </View>
                );
            },
        });
    }, [navigation, car, editMode, loading]);

    useEffect(() => {
        navigation.setOptions({
            headerTitle: `${brand || car.brand} ${model || car.model}`,
        });
    }, [brand, model, navigation, car.brand, car.model]);

    return (
        <LinearGradient
            colors={['#FFFFFF', '#F3F9FF', '#E6F2FF']}
            start={{ x: 0.5, y: 0 }}
            end={{ x: 0.5, y: 1 }}
            style={{ flex: 1 }}
        >
            <SafeAreaView style={styles.container}>
                <ScrollView contentContainerStyle={{ paddingBottom: 24 }}>
                    <ScrollView
                        horizontal
                        pagingEnabled
                        showsHorizontalScrollIndicator={false}
                        style={styles.carousel}
                    >
                        {car.imageUrls.map((url, idx) => (
                            <Image key={idx} source={{ uri: url }} style={styles.carouselImage} />
                        ))}
                    </ScrollView>

                    <View style={styles.dotsContainer}>
                        {car.imageUrls.map((_, idx) => (
                            <View key={idx} style={styles.dot} />
                        ))}
                    </View>

                    <View style={styles.card}>
                        <View style={styles.row}>
                            <View style={styles.labelContainer}>
                                <Text style={styles.rowLabel}>Brand</Text>
                            </View>
                            {editMode ? (
                                <TouchableOpacity
                                    style={styles.rowInput}
                                    onPress={() => setBrandModalVisible(true)}
                                >
                                    <Text style={styles.rowValue}>{brand || 'Select brand'}</Text>
                                </TouchableOpacity>
                            ) : (
                                <Text style={styles.rowValue}>{car.brand}</Text>
                            )}
                        </View>
                        <View style={styles.separator} />

                        <View style={styles.row}>
                            <View style={styles.labelContainer}>
                                <Text style={styles.rowLabel}>Model</Text>
                            </View>
                            {editMode ? (
                                <TouchableOpacity
                                    style={styles.rowInput}
                                    onPress={() => brand && setModelModalVisible(true)}
                                >
                                    <Text style={styles.rowValue}>{model || 'Select model'}</Text>
                                </TouchableOpacity>
                            ) : (
                                <Text style={styles.rowValue}>{car.model}</Text>
                            )}
                        </View>
                        <View style={styles.separator} />

                        <View style={styles.row}>
                            <View style={styles.labelContainer}>
                                <Text style={styles.rowLabel}>Year</Text>
                            </View>
                            {editMode ? (
                                <TextInput
                                    style={styles.rowInput}
                                    value={year}
                                    onChangeText={setYear}
                                    placeholder="Year"
                                    keyboardType="numeric"
                                    textAlign="right"
                                />
                            ) : (
                                <Text style={styles.rowValue}>{car.year}</Text>
                            )}
                        </View>
                        <View style={styles.separator} />

                        <View style={styles.row}>
                            <View style={styles.labelContainer}>
                                <Text style={styles.rowLabel}>Color</Text>
                            </View>
                            {editMode ? (
                                <TextInput
                                    style={styles.rowInput}
                                    value={color}
                                    onChangeText={setColor}
                                    placeholder="Color"
                                    textAlign="right"
                                />
                            ) : (
                                <Text style={styles.rowValue}>{car.color}</Text>
                            )}
                        </View>
                        <View style={styles.separator} />

                        <View style={styles.row}>
                            <View style={styles.labelContainer}>
                                <Text style={styles.rowLabel}>Price/Day</Text>
                            </View>
                            {editMode ? (
                                <TextInput
                                    style={styles.rowInput}
                                    value={pricePerDay}
                                    onChangeText={setPricePerDay}
                                    placeholder="Price"
                                    keyboardType="numeric"
                                    textAlign="right"
                                />
                            ) : (
                                <Text style={styles.rowValue}>${car.pricePerDay}</Text>
                            )}
                        </View>
                        <View style={styles.separator} />

                        <View style={styles.row}>
                            <View style={styles.labelContainer}>
                                <Text style={styles.rowLabel}>Country</Text>
                            </View>
                            {editMode ? (
                                <TextInput
                                    style={styles.rowInput}
                                    value={country}
                                    onChangeText={setCountry}
                                    placeholder="Country"
                                    textAlign="right"
                                />
                            ) : (
                                <Text style={styles.rowValue}>{car.country}</Text>
                            )}
                        </View>
                        <View style={styles.separator} />

                        <View style={styles.row}>
                            <View style={styles.labelContainer}>
                                <Text style={styles.rowLabel}>City</Text>
                            </View>
                            {editMode ? (
                                <TextInput
                                    style={styles.rowInput}
                                    value={city}
                                    onChangeText={setCity}
                                    placeholder="City"
                                    textAlign="right"
                                />
                            ) : (
                                <Text style={styles.rowValue}>{car.city}</Text>
                            )}
                        </View>
                        <View style={styles.separator} />

                        <View style={styles.row}>
                            <View style={styles.labelContainer}>
                                <Text style={styles.rowLabel}>Latitude</Text>
                            </View>
                            {editMode ? (
                                <TextInput
                                    style={styles.rowInput}
                                    value={latitude}
                                    onChangeText={setLatitude}
                                    placeholder="Latitude"
                                    keyboardType="numeric"
                                    textAlign="right"
                                />
                            ) : (
                                <Text style={styles.rowValue}>
                                    {car.latitude?.toFixed(6) ?? '—'}
                                </Text>
                            )}
                        </View>
                        <View style={styles.separator} />

                        <View style={styles.row}>
                            <View style={styles.labelContainer}>
                                <Text style={styles.rowLabel}>Longitude</Text>
                            </View>
                            {editMode ? (
                                <TextInput
                                    style={styles.rowInput}
                                    value={longitude}
                                    onChangeText={setLongitude}
                                    placeholder="Longitude"
                                    keyboardType="numeric"
                                    textAlign="right"
                                />
                            ) : (
                                <Text style={styles.rowValue}>
                                    {car.longitude?.toFixed(6) ?? '—'}
                                </Text>
                            )}
                        </View>
                        <View style={styles.separator} />

                        <View style={styles.row}>
                            <View style={styles.labelContainer}>
                                <Text style={styles.rowLabel}>Available</Text>
                            </View>
                            <Text style={styles.rowValue}>
                                {car.available ? 'Yes' : 'No'}
                            </Text>
                        </View>
                        <View style={styles.separator} />

                        <View style={styles.row}>
                            <View style={styles.labelContainer}>
                                <Text style={styles.rowLabel}>Owner Name</Text>
                            </View>
                            <Text style={styles.rowValue}>
                                {car.ownerFirstName} {car.ownerLastName}
                            </Text>
                        </View>
                        <View style={styles.separator} />

                        <View style={styles.row}>
                            <View style={styles.labelContainer}>
                                <Text style={styles.rowLabel}>Owner Email</Text>
                            </View>
                            <Text style={styles.rowValue}>{car.ownerEmail}</Text>
                        </View>
                        <View style={styles.separator} />

                        <View style={styles.row}>
                            <View style={styles.labelContainer}>
                                <Text style={styles.rowLabel}>Owner Phone</Text>
                            </View>
                            <Text style={styles.rowValue}>{car.ownerPhoneNumber}</Text>
                        </View>
                        <View style={styles.separator} />

                        <View style={[styles.row, { alignItems: 'flex-start' }]}>
                            <View style={styles.labelContainer}>
                                <Text style={styles.rowLabel}>Description</Text>
                            </View>
                            {editMode ? (
                                <TextInput
                                    style={[styles.rowInput, { height: 80 }]}
                                    value={description}
                                    onChangeText={setDescription}
                                    placeholder="Description"
                                    multiline
                                    textAlign="right"
                                />
                            ) : (
                                <Text style={[styles.rowValue, { flex: 1 }]}>
                                    {car.description || '—'}
                                </Text>
                            )}
                        </View>
                    </View>

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

            <ChoiceModal
                visible={brandModalVisible}
                title="Select a brand"
                data={allBrands}
                search={brandSearch}
                setSearch={setBrandSearch}
                onSelect={(v) => {
                    setBrand(v);
                    setModel('');
                    setBrandModalVisible(false);
                }}
                onClose={() => setBrandModalVisible(false)}
            />

            <ChoiceModal
                visible={modelModalVisible}
                title="Select a model"
                data={allModels}
                search={modelSearch}
                setSearch={setModelSearch}
                onSelect={(v) => {
                    setModel(v);
                    setModelModalVisible(false);
                }}
                onClose={() => setModelModalVisible(false)}
            />
        </LinearGradient>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
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
    labelContainer: {
        width: 100,
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
    rowInput: {
        flex: 1,
        fontSize: 16,
        fontWeight: '600',
        color: '#1E2B3B',
        borderWidth: 1,
        borderColor: '#C5CED6',
        borderRadius: 8,
        paddingHorizontal: 8,
        paddingVertical: 4,
        backgroundColor: '#FFF',
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
