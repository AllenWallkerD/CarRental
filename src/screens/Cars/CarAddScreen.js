import React, { useState, useEffect } from 'react';
import {
    SafeAreaView,
    View,
    Text,
    TouchableOpacity,
    ScrollView,
    Image,
    StyleSheet,
    Dimensions,
    TextInput,
    ActivityIndicator,
    Alert,
    Modal,
    FlatList,
    TouchableWithoutFeedback,
} from 'react-native';
import AsyncStorage from "@react-native-async-storage/async-storage";
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';
import * as ImagePicker from 'expo-image-picker';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { getMakes, getModels } from 'car-info';
import { addCar } from '../../api/CarRental';

const screenW = Dimensions.get('window').width;
const maxImages = 4;
const carouselH = 220;

export default function CarAddScreen({route}) {
    const navigation = useNavigation();
    const [userId, setUserId] = useState(route?.params?.userId || null);

    useEffect(() => {
        if (userId) return;
        AsyncStorage.getItem('userId').then(setUserId);
    }, []);

    const [brand, setBrand] = useState('');
    const [model, setModel] = useState('');
    const [year, setYear] = useState('');
    const [color, setColor] = useState('');
    const [pricePerDay, setPricePerDay] = useState('');
    const [country, setCountry] = useState('');
    const [city, setCity] = useState('');
    const [latitude, setLatitude] = useState('');
    const [longitude, setLongitude] = useState('');
    const [description, setDescription] = useState('');
    const [images, setImages] = useState([]);
    const [page, setPage] = useState(0);
    const [loading, setLoading] = useState(false);

    const [brandModal, setBrandModal] = useState(false);
    const [modelModal, setModelModal] = useState(false);
    const [brandSearch, setBrandSearch] = useState('');
    const [modelSearch, setModelSearch] = useState('');

    const brands = getMakes();
    const models = brand ? getModels(brand) : [];

    const pickImages = async () => {
        const left = maxImages - images.length;
        if (left === 0) return Alert.alert('You can upload up to 4 images');
        const res = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsMultipleSelection: true,
            selectionLimit: left,
            quality: 0.85,
        });
        if (!res.canceled) setImages([...images, ...res.assets.slice(0, left)]);
    };

    const removeImage = (idx) => {
        const next = images.filter((_, i) => i !== idx);
        setImages(next);
        if (page >= next.length) setPage(next.length - 1);
    };

    const saveCar = async () => {
        if (!brand || !model || !year || !color || !pricePerDay || !country || !city) {
            Alert.alert('Fill all required fields');
            return;
        }
        try {
            setLoading(true);
            const data = new FormData();
            data.append('brand', brand);
            data.append('model', model);
            data.append('year', year);
            data.append('color', color);
            data.append('pricePerDay', pricePerDay);
            data.append('country', country);
            data.append('city', city);
            data.append('latitude', latitude);
            data.append('longitude', longitude);
            data.append('description', description);
            images.forEach((img, i) =>
                data.append('images', { uri: img.uri, name: `car_${i}.jpg`, type: 'image/jpeg' })
            );
            const response = await addCar(userId, data);
            navigation.goBack();
        } catch {
            console.log('Save car error:', error);
            Alert.alert('Error', 'Unable to save car');
        } finally {
            setLoading(false);
        }
    };

    return (
        <LinearGradient colors={['#FFFFFF', '#F3F9FF', '#E6F2FF']} style={{ flex: 1 }}>
            <SafeAreaView style={styles.container}>
                <View style={styles.header}>
                    <TouchableOpacity onPress={() => navigation.goBack()}>
                        <Ionicons name="chevron-back" size={28} color="#0A84FF" />
                    </TouchableOpacity>
                    <Text style={styles.title}>Car Registration</Text>
                    <View style={{ width: 20 }}/>
                </View>

                {loading && (
                    <View style={styles.loader}>
                        <ActivityIndicator size="large" />
                    </View>
                )}

                {!loading && (
                    <ScrollView contentContainerStyle={styles.content}>
                        <View style={styles.carouselWrapper}>
                            <ScrollView
                                horizontal
                                pagingEnabled
                                showsHorizontalScrollIndicator={false}
                                onMomentumScrollEnd={(e) =>
                                    setPage(Math.round(e.nativeEvent.contentOffset.x / (screenW - 32)))
                                }
                            >
                                {images.length === 0 ? (
                                    <TouchableOpacity style={styles.placeholder} onPress={pickImages}>
                                        <Ionicons name="add" size={48} color="#AAB4C0" />
                                        <Text style={styles.placeholderTxt}>Tap to add photos</Text>
                                    </TouchableOpacity>
                                ) : (
                                    images.map((img, idx) => (
                                        <View key={idx} style={styles.imageSlot}>
                                            <Image source={{ uri: img.uri }} style={styles.carouselImage} />
                                            <TouchableOpacity
                                                style={styles.deleteBtn}
                                                onPress={() => removeImage(idx)}
                                            >
                                                <Ionicons name="close" size={20} color="#FFF" />
                                            </TouchableOpacity>
                                        </View>
                                    ))
                                )}
                            </ScrollView>
                            {images.length > 0 && (
                                <View style={styles.dots}>
                                    {images.map((_, i) => (
                                        <View
                                            key={i}
                                            style={[styles.dot, i === page && { backgroundColor: '#0A84FF' }]}
                                        />
                                    ))}
                                </View>
                            )}
                            {images.length > 0 && images.length < maxImages && (
                                <TouchableOpacity style={styles.addMoreBtn} onPress={pickImages}>
                                    <Ionicons name="add" size={22} color="#0A84FF" />
                                </TouchableOpacity>
                            )}
                        </View>

                        <BlurView intensity={30} tint="light" style={styles.glass}>
                            <PickerField label="Brand" value={brand} onPress={() => setBrandModal(true)} />
                            <PickerField
                                label="Model"
                                value={model}
                                onPress={() => brand && setModelModal(true)}
                            />
                            {[
                                { l: 'Year', v: year, s: setYear, kb: 'numeric' },
                                { l: 'Color', v: color, s: setColor },
                                { l: 'Price $/per day', v: pricePerDay, s: setPricePerDay, kb: 'numeric' },
                                { l: 'Country', v: country, s: setCountry },
                                { l: 'City', v: city, s: setCity },
                                { l: 'Latitude', v: latitude, s: setLatitude, kb: 'numeric' },
                                { l: 'Longitude', v: longitude, s: setLongitude, kb: 'numeric' },
                            ].map((f) => (
                                <Input key={f.l} label={f.l} value={f.v} onChange={f.s} kb={f.kb} />
                            ))}
                            <Text style={styles.label}>Description</Text>
                            <TextInput
                                style={[styles.input, styles.textarea]}
                                placeholder="Description"
                                multiline
                                value={description}
                                onChangeText={setDescription}
                            />
                        </BlurView>

                        <TouchableOpacity onPress={saveCar} activeOpacity={0.8}>
                            <LinearGradient colors={['#5EB4FF', '#0A84FF']} style={styles.btn}>
                                {loading ? (
                                    <ActivityIndicator color="#FFF" />
                                ) : (
                                    <Text style={styles.btnTxt}>Save</Text>
                                )}
                            </LinearGradient>
                        </TouchableOpacity>
                        <View style={{ height: 24 }} />
                    </ScrollView>
                )}
            </SafeAreaView>

            <ChoiceModal
                visible={brandModal}
                title="Select a brand"
                data={brands}
                search={brandSearch}
                setSearch={setBrandSearch}
                onSelect={(v) => {
                    setBrand(v);
                    setModel('');
                    setBrandModal(false);
                }}
                onClose={() => setBrandModal(false)}
            />

            <ChoiceModal
                visible={modelModal}
                title="Select a model"
                data={models}
                search={modelSearch}
                setSearch={setModelSearch}
                onSelect={(v) => {
                    setModel(v);
                    setModelModal(false);
                }}
                onClose={() => setModelModal(false)}
            />
        </LinearGradient>
    );
}

function PickerField({ label, value, onPress }) {
    return (
        <>
            <Text style={styles.label}>{label}</Text>
            <TouchableOpacity style={styles.input} onPress={onPress}>
                <Text style={styles.inputTxt}>{value || `Select ${label.toLowerCase()}`}</Text>
            </TouchableOpacity>
        </>
    );
}

function Input({ label, value, onChange, kb }) {
    return (
        <>
            <Text style={styles.label}>{label}</Text>
            <TextInput
                style={styles.input}
                placeholder={label}
                value={value}
                onChangeText={onChange}
                keyboardType={kb || 'default'}
            />
        </>
    );
}

function ChoiceModal({ visible, title, data, search, setSearch, onSelect, onClose }) {
    const filtered = data.filter((d) => d.toLowerCase().includes(search.toLowerCase()));
    return (
        <Modal visible={visible} transparent animationType="slide">
            <TouchableWithoutFeedback onPress={onClose}>
                <View style={styles.modalWrap}>
                    <TouchableWithoutFeedback>
                        <View style={styles.modal}>
                            <View style={styles.modalHeader}>
                                <Text style={styles.modalTitle}>{title}</Text>
                                <TouchableOpacity onPress={onClose}>
                                    <Ionicons name="close" size={24} color="#1E2B3B" />
                                </TouchableOpacity>
                            </View>
                            <TextInput
                                placeholder="Search…"
                                value={search}
                                onChangeText={setSearch}
                                style={styles.searchInput}
                            />
                            <FlatList
                                data={filtered}
                                keyExtractor={(i) => i}
                                renderItem={({ item }) => (
                                    <TouchableOpacity style={styles.item} onPress={() => onSelect(item)}>
                                        <Text style={styles.itemTxt}>{item}</Text>
                                    </TouchableOpacity>
                                )}
                                ListFooterComponent={<View style={{ height: 24 }} />}
                            />
                        </View>
                    </TouchableWithoutFeedback>
                </View>
            </TouchableWithoutFeedback>
        </Modal>
    );
}

const blue = '#0A84FF';
const light = '#F4F6FA';

const styles = StyleSheet.create({
    container: { flex: 1 },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 16,
        paddingVertical: 12,
    },
    title: { fontSize: 22, fontWeight: '700', color: '#1E2B3B' },
    loader: { ...StyleSheet.absoluteFillObject, alignItems: 'center', justifyContent: 'center' },
    content: { padding: 16 },
    carouselWrapper: { height: carouselH, marginBottom: 20, position: 'relative' },
    placeholder: {
        width: screenW - 32,
        height: carouselH,
        borderRadius: 12,
        backgroundColor: light,
        alignItems: 'center',
        justifyContent: 'center',
    },
    placeholderTxt: { marginTop: 6, color: '#AAB4C0' },
    imageSlot: { width: screenW - 32, height: carouselH, marginRight: 16 },
    carouselImage: { width: '100%', height: '100%', borderRadius: 12 },
    deleteBtn: {
        position: 'absolute',
        top: 8,
        right: 8,
        backgroundColor: 'rgba(0,0,0,0.6)',
        borderRadius: 12,
        padding: 4,
    },
    dots: {
        position: 'absolute',
        bottom: 8,
        width: '100%',
        flexDirection: 'row',
        justifyContent: 'center',
        gap: 6,
    },
    dot: { width: 8, height: 8, borderRadius: 4, backgroundColor: '#C5CED6' },
    addMoreBtn: {
        position: 'absolute',
        right: 16,
        bottom: 16,
        backgroundColor: '#FFFFFFDD',
        borderRadius: 16,
        padding: 6,
    },
    glass: {
        borderRadius: 16,
        padding: 16,
        backgroundColor: 'rgba(255,255,255,0.4)',
        marginBottom: 20,
    },
    label: { fontSize: 15, fontWeight: '500', color: '#1E2B3B', marginBottom: 4 },
    input: {
        backgroundColor: 'rgba(255,255,255,0.6)',
        borderRadius: 12,
        paddingHorizontal: 16,
        paddingVertical: 12,
        marginBottom: 14,
    },
    inputTxt: { fontSize: 15, color: '#1E2B3B' },
    textarea: { height: 100, textAlignVertical: 'top' },
    btn: {
        height: 48,
        borderRadius: 24,
        alignItems: 'center',
        justifyContent: 'center',
        shadowColor: blue,
        shadowOpacity: 0.25,
        shadowRadius: 12,
        elevation: 6,
    },
    btnTxt: { color: '#FFF', fontSize: 17, fontWeight: '600' },
    modalWrap: { flex: 1, justifyContent: 'flex-end' },
    modal: {
        height: '80%',
        backgroundColor: '#FFF',
        borderTopLeftRadius: 8,
        borderTopRightRadius: 8,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5,
    },
    modalHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 20,
        paddingVertical: 12,
    },
    modalTitle: { fontSize: 18, fontWeight: '600', color: '#1E2B3B' },
    searchInput: {
        backgroundColor: '#F0F3F6',
        borderRadius: 8,
        paddingHorizontal: 12,
        paddingVertical: 8,
        marginHorizontal: 20,
        marginBottom: 8,
    },
    item: { paddingVertical: 12, paddingHorizontal: 20 },
    itemTxt: { fontSize: 16, color: '#1E2B3B' },
});
