// screens/Cars/CarDetailScreen.js
import React, { useLayoutEffect, useEffect, useState } from 'react';
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
    Text,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import MapView, { Marker } from 'react-native-maps';
import * as ImagePicker from 'expo-image-picker';
import useCarDetail from './hooks/useCarDetail';
import ChoiceModal from './components/ChoiceModal';

const { width: screenW } = Dimensions.get('window');
const blue = '#0A84FF';
const maxImages = 4;
const carouselH = 220;

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

    // Manage images: remote vs local
    const [images, setImages] = useState(
        initialCar.imageUrls.map((url) => ({ uri: url, isRemote: true }))
    );
    const [page, setPage] = useState(0);

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
                <TouchableOpacity onPress={() => navigation.goBack()} style={{ paddingHorizontal: 12 }}>
                    <Ionicons name="chevron-back" size={28} color={blue} />
                </TouchableOpacity>
            ),
            headerRight: () => {
                if (loading) {
                    return <ActivityIndicator style={{ marginRight: 16 }} size="small" color={blue} />;
                }
                return (
                    <View style={styles.icons}>
                        {editMode ?
                            <TouchableOpacity onPress={cancelEdit}>
                                <Ionicons name="close-circle-outline" size={24} color={blue} />
                            </TouchableOpacity>
                        :
                            <TouchableOpacity onPress={toggleEditMode}>
                                <Ionicons name={'pencil-outline'} size={24} color={blue} />
                            </TouchableOpacity>
                        }
                    </View>
                );
            },
        });
    }, [navigation, car, editMode, loading]);

    useEffect(() => {
        navigation.setOptions({ headerTitle: `${brand || car.brand} ${model || car.model}` });
    }, [brand, model, navigation, car.brand, car.model]);

    const pickImages = async () => {
        const left = maxImages - images.length;
        if (left === 0) {
            Alert.alert('You can upload up to 4 images');
            return;
        }
        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsMultipleSelection: true,
            selectionLimit: left,
            quality: 0.85,
        });
        if (!result.canceled) {
            const picked = result.assets.slice(0, left).map((asset) => ({
                uri: asset.uri,
                isRemote: false,
            }));
            setImages((prev) => [...prev, ...picked]);
        }
    };

    const removeImage = (idx) => {
        const next = images.filter((_, i) => i !== idx);
        setImages(next);
        if (page >= next.length) {
            setPage(next.length - 1);
        }
    };

    const onSave = async () => {
        // Build FormData for changed fields + images
        const formData = new FormData();
        formData.append('brand', brand.trim());
        formData.append('model', model.trim());
        formData.append('year', year.trim());
        formData.append('color', color.trim());
        formData.append('pricePerDay', pricePerDay.trim());
        formData.append('country', country.trim());
        formData.append('city', city.trim());
        formData.append('latitude', latitude.trim());
        formData.append('longitude', longitude.trim());
        formData.append('description', description.trim());

        // Send list of existing remote URLs to keep
        const existingUrls = images.filter((img) => img.isRemote).map((img) => img.uri);
        formData.append('existingImageUrls', JSON.stringify(existingUrls));

        // Append new images
        images
            .filter((img) => !img.isRemote)
            .forEach((img, i) => {
                formData.append('newImages', {
                    uri: img.uri,
                    name: `car_${i}.jpg`,
                    type: 'image/jpeg',
                });
            });

        await handleSave(formData);
    };

    return (
        <LinearGradient
            colors={['#FFFFFF', '#F3F9FF', '#E6F2FF']}
            start={{ x: 0.5, y: 0 }}
            end={{ x: 0.5, y: 1 }}
            style={{ flex: 1 }}
        >
            <SafeAreaView style={styles.container}>
                <ScrollView contentContainerStyle={{ paddingBottom: 24 }}>
                    {/* Image Carousel */}
                    <ScrollView
                        horizontal
                        pagingEnabled
                        showsHorizontalScrollIndicator={false}
                        style={styles.carousel}
                        onMomentumScrollEnd={(e) => {
                            const idx = Math.round(e.nativeEvent.contentOffset.x / screenW);
                            setPage(idx);
                        }}
                    >
                        {images.length === 0 ? (
                            <View style={styles.placeholder}>
                                <Ionicons name="image-outline" size={48} color="#AAB4C0" />
                                <Text style={styles.placeholderTxt}>No photos</Text>
                            </View>
                        ) : (
                            images.map((img, idx) => (
                                <View key={idx} style={styles.imageSlot}>
                                    <Image source={{ uri: img.uri }} style={styles.carouselImage} />
                                    {editMode && (
                                        <TouchableOpacity style={styles.deleteBtn} onPress={() => removeImage(idx)}>
                                            <Ionicons name="close" size={20} color="#FFF" />
                                        </TouchableOpacity>
                                    )}
                                </View>
                            ))
                        )}
                    </ScrollView>

                    <View style={styles.dotsContainer}>
                        {images.map((_, idx) => (
                            <View key={idx} style={[styles.dot, idx === page && { backgroundColor: blue }]} />
                        ))}
                    </View>

                    {editMode && images.length < maxImages && (
                        <TouchableOpacity style={styles.addMoreBtn} onPress={pickImages}>
                            <Ionicons name="add" size={22} color="#0A84FF" />
                        </TouchableOpacity>
                    )}

                    {/* Data Card */}
                    <View style={styles.card}>
                        {/* Brand */}
                        <View style={styles.row}>
                            <View style={styles.labelContainer}>
                                <Text style={styles.rowLabel}>Brand</Text>
                            </View>
                            {editMode ? (
                                <TouchableOpacity style={styles.rowInput} onPress={() => setBrandModalVisible(true)}>
                                    <Text style={styles.rowValue}>{brand || 'Select brand'}</Text>
                                </TouchableOpacity>
                            ) : (
                                <Text style={styles.rowValue}>{car.brand}</Text>
                            )}
                        </View>
                        <View style={styles.separator} />

                        {/* Model */}
                        <View style={styles.row}>
                            <View style={styles.labelContainer}>
                                <Text style={styles.rowLabel}>Model</Text>
                            </View>
                            {editMode ? (
                                <TouchableOpacity style={styles.rowInput} onPress={() => brand && setModelModalVisible(true)}>
                                    <Text style={styles.rowValue}>{model || 'Select model'}</Text>
                                </TouchableOpacity>
                            ) : (
                                <Text style={styles.rowValue}>{car.model}</Text>
                            )}
                        </View>
                        <View style={styles.separator} />

                        {/* Year */}
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

                        {/* Color */}
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

                        {/* Price/Day */}
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

                        {/* Country */}
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

                        {/* City */}
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

                        {/* Latitude */}
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
                                <Text style={styles.rowValue}>{car.latitude?.toFixed(6) ?? '—'}</Text>
                            )}
                        </View>
                        <View style={styles.separator} />

                        {/* Longitude */}
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
                                <Text style={styles.rowValue}>{car.longitude?.toFixed(6) ?? '—'}</Text>
                            )}
                        </View>
                        <View style={styles.separator} />

                        {/* Available */}
                        <View style={styles.row}>
                            <View style={styles.labelContainer}>
                                <Text style={styles.rowLabel}>Available</Text>
                            </View>
                            <Text style={styles.rowValue}>{car.available ? 'Yes' : 'No'}</Text>
                        </View>
                        <View style={styles.separator} />

                        {/* Owner Name */}
                        <View style={styles.row}>
                            <View style={styles.labelContainer}>
                                <Text style={styles.rowLabel}>Owner Name</Text>
                            </View>
                            <Text style={styles.rowValue}>
                                {car.ownerFirstName} {car.ownerLastName}
                            </Text>
                        </View>
                        <View style={styles.separator} />

                        {/* Owner Email */}
                        <View style={styles.row}>
                            <View style={styles.labelContainer}>
                                <Text style={styles.rowLabel}>Owner Email</Text>
                            </View>
                            <Text style={styles.rowValue}>{car.ownerEmail}</Text>
                        </View>
                        <View style={styles.separator} />

                        {/* Owner Phone */}
                        <View style={styles.row}>
                            <View style={styles.labelContainer}>
                                <Text style={styles.rowLabel}>Owner Phone</Text>
                            </View>
                            <Text style={styles.rowValue}>{car.ownerPhoneNumber}</Text>
                        </View>
                        <View style={styles.separator} />

                        {/* Description */}
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
                                <Text style={[styles.rowValue, { flex: 1 }]}>{car.description || '—'}</Text>
                            )}
                        </View>
                    </View>

                    {/* Map View */}
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
                                    coordinate={{ latitude: car.latitude, longitude: car.longitude }}
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

            {editMode && (
                <TouchableOpacity style={styles.saveButton} onPress={onSave}>
                    {loading ? <ActivityIndicator color="#FFF" /> : <Text style={styles.saveButtonText}>Save Changes</Text>}
                </TouchableOpacity>
            )}
        </LinearGradient>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    icons: {
      alignSelf: 'center',
      justifyContent: 'center',
    },
    carousel: {
        width: screenW,
        height: carouselH,
        marginBottom: 12,
    },
    placeholder: {
        width: screenW,
        height: carouselH,
        backgroundColor: '#F0F3F6',
        alignItems: 'center',
        justifyContent: 'center',
    },
    placeholderTxt: { marginTop: 6, color: '#AAB4C0' },
    imageSlot: {
        width: screenW,
        height: carouselH,
        position: 'relative',
    },
    carouselImage: {
        width: screenW,
        height: carouselH,
        resizeMode: 'cover',
    },
    deleteBtn: {
        position: 'absolute',
        top: 8,
        right: 8,
        backgroundColor: 'rgba(0,0,0,0.6)',
        borderRadius: 12,
        padding: 4,
    },
    dotsContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        gap: 6,
        marginBottom: 16,
    },
    dot: {
        width: 8,
        height: 8,
        borderRadius: 4,
        backgroundColor: '#C5CED6',
    },
    addMoreBtn: {
        position: 'absolute',
        right: 16,
        top: carouselH - 48,
        backgroundColor: '#FFFFFFDD',
        borderRadius: 16,
        padding: 6,
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

    saveButton: {
        position: 'absolute',
        bottom: 16,
        right: 16,
        left: 16,
        backgroundColor: blue,
        borderRadius: 24,
        paddingVertical: 14,
        alignItems: 'center',
        marginHorizontal: 16,
        elevation: 4,
    },
    saveButtonText: {
        color: '#FFF',
        fontSize: 17,
        fontWeight: '600',
    },
});
