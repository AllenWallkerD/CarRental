import React, { useState, useEffect } from 'react';
import {
    SafeAreaView,
    View,
    Text,
    TouchableOpacity,
    ScrollView,
    TextInput,
    ActivityIndicator,
    Alert,
    StyleSheet,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Location from 'expo-location';
import * as ImagePicker from 'expo-image-picker';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { getMakes, getModels } from 'car-info';
import { addCar } from '../../api/CarRental';

import ImageCarousel from './components/ImageCarousel';
import MapPicker from './components/MapPicker';
import PickerField from './components/PickerField';
import InputField from './components/InputField';
import ChoiceModal from './components/ChoiceModal';

const DEFAULT_REGION = {
    latitude: 43.2220,
    longitude: 76.8512,
    latitudeDelta: 0.05,
    longitudeDelta: 0.05,
};

export default function CarAddScreen({ route }) {
    const navigation = useNavigation();
    const [userId, setUserId] = useState(route?.params?.userId || null);

    useEffect(() => {
        if (!userId) AsyncStorage.getItem('userId').then(setUserId);
    }, []);

    // ─── form state ─────────────────────────────────────────────────────────────
    const [brand, setBrand] = useState('');
    const [model, setModel] = useState('');
    const [year, setYear] = useState('');
    const [color, setColor] = useState('');
    const [pricePerDay, setPricePerDay] = useState('');
    const [country, setCountry] = useState('');
    const [city, setCity] = useState('');
    const [description, setDescription] = useState('');
    const [errors, setErrors] = useState({});

    // ─── images carousel ────────────────────────────────────────────────────────
    const [images, setImages] = useState([]);
    const [page, setPage] = useState(0);
    const pickImages = async () => {
        const left = 4 - images.length;
        if (left === 0) return Alert.alert('You can upload up to 4 images');
        const res = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsMultipleSelection: true,
            selectionLimit: left,
            quality: 0.85,
        });
        if (!res.canceled) {
            setImages(prev => [...prev, ...res.assets.slice(0, left)]);
        }
    };
    const removeImage = idx => {
        setImages(prev => prev.filter((_, i) => i !== idx));
        setPage(prev => Math.min(prev, images.length - 2));
    };

    // ─── map picker ─────────────────────────────────────────────────────────────
    const [region, setRegion] = useState(DEFAULT_REGION);
    const [marker, setMarker] = useState(null);
    useEffect(() => {
        (async () => {
            const { status } = await Location.requestForegroundPermissionsAsync();
            if (status === 'granted') {
                const loc = await Location.getCurrentPositionAsync();
                setRegion(r => ({
                    ...r,
                    latitude: loc.coords.latitude,
                    longitude: loc.coords.longitude,
                }));
            }
        })();
    }, []);

    // ─── make/model modals ──────────────────────────────────────────────────────
    const [brandModal, setBrandModal] = useState(false);
    const [modelModal, setModelModal] = useState(false);
    const [brandSearch, setBrandSearch] = useState('');
    const [modelSearch, setModelSearch] = useState('');
    const makes = getMakes();
    const models = brand ? getModels(brand) : [];

    // ─── submit ─────────────────────────────────────────────────────────────────
    const [loading, setLoading] = useState(false);
    const saveCar = async () => {
        if (!brand || !model || !year || !color || !pricePerDay || !country || !city) {
            return Alert.alert('Fill all required fields');
        }
        if (!marker) return Alert.alert('Please pick a location on the map');
        if (!userId) return Alert.alert('Error', 'User ID not available');

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
            data.append('latitude', marker.latitude.toString());
            data.append('longitude', marker.longitude.toString());
            data.append('description', description);
            images.forEach((img, i) =>
                data.append('images', {
                    uri: img.uri,
                    name: `car_${i}.jpg`,
                    type: 'image/jpeg',
                })
            );
            await addCar(userId, data);
            navigation.goBack();
        } catch (err) {
            console.error(err);
            if (err.response?.data) {
                setErrors({ year: err.response.data });
            } else {
                Alert.alert('Error', 'Unable to save car');
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <LinearGradient colors={['#FFFFFF','#F3F9FF','#E6F2FF']} style={{flex:1}}>
            <SafeAreaView style={styles.container}>

                {/* header */}
                <View style={styles.header}>
                    <TouchableOpacity onPress={()=>navigation.goBack()}>
                        <Ionicons name="chevron-back" size={28} color="#0A84FF"/>
                    </TouchableOpacity>
                    <Text style={styles.title}>Car Registration</Text>
                    <View style={{width:20}}/>
                </View>

                {/* loading overlay */}
                {loading && (
                    <View style={styles.loader}>
                        <ActivityIndicator size="large"/>
                    </View>
                )}

                {/* form */}
                {!loading && (
                    <ScrollView contentContainerStyle={styles.content}>

                        <ImageCarousel
                            images={images}
                            page={page}
                            onPickImages={pickImages}
                            onRemoveImage={removeImage}
                            onPageChange={setPage}
                        />

                        <Text style={styles.label}>Pick Location</Text>
                        <MapPicker
                            region={region}
                            marker={marker}
                            onRegionChange={setRegion}
                            onPick={setMarker}
                        />

                        <BlurView intensity={30} tint="light" style={styles.glass}>
                            <PickerField label="Brand" value={brand} onPress={()=>setBrandModal(true)}/>
                            <PickerField label="Model" value={model} onPress={()=>brand&&setModelModal(true)}/>
                            <InputField
                                label="Year"
                                value={year}
                                onChange={t=>{
                                    setYear(t);
                                    errors.year && setErrors(e=>({...e,year:null}));
                                }}
                                keyboardType="numeric"
                                error={errors.year}
                            />
                            <InputField label="Color" value={color} onChange={setColor}/>
                            <InputField
                                label="Price $/per day"
                                value={pricePerDay}
                                onChange={setPricePerDay}
                                keyboardType="numeric"
                            />
                            <InputField label="Country" value={country} onChange={setCountry}/>
                            <InputField label="City" value={city} onChange={setCity}/>

                            <View style={{marginBottom:14}}>
                                <Text style={styles.label}>Description</Text>
                                <TextInput
                                    style={[styles.input,styles.textarea]}
                                    placeholder="Description"
                                    multiline
                                    value={description}
                                    onChangeText={setDescription}
                                />
                            </View>
                        </BlurView>

                        <TouchableOpacity onPress={saveCar} activeOpacity={0.8}>
                            <LinearGradient colors={['#5EB4FF','#0A84FF']} style={styles.btn}>
                                <Text style={styles.btnTxt}>Save</Text>
                            </LinearGradient>
                        </TouchableOpacity>
                        <View style={{height:24}}/>

                    </ScrollView>
                )}

                {/* brand/model modals */}
                <ChoiceModal
                    visible={brandModal}
                    title="Select a brand"
                    data={makes}
                    search={brandSearch}
                    setSearch={setBrandSearch}
                    onSelect={v=>{ setBrand(v); setModel(''); setBrandModal(false); }}
                    onClose={()=>setBrandModal(false)}
                />
                <ChoiceModal
                    visible={modelModal}
                    title="Select a model"
                    data={models}
                    search={modelSearch}
                    setSearch={setModelSearch}
                    onSelect={v=>{ setModel(v); setModelModal(false); }}
                    onClose={()=>setModelModal(false)}
                />

            </SafeAreaView>
        </LinearGradient>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1 },
    header: {
        flexDirection:'row',
        alignItems:'center',
        justifyContent:'space-between',
        paddingHorizontal:16,
        paddingVertical:12,
    },
    title: { fontSize:22, fontWeight:'700', color:'#1E2B3B' },
    loader: {
        ...StyleSheet.absoluteFillObject,
        alignItems:'center',
        justifyContent:'center',
    },
    content: { padding:16 },
    label: {
        fontSize:15,
        fontWeight:'500',
        color:'#1E2B3B',
        marginBottom:4,
    },
    glass: {
        borderRadius:16,
        padding:16,
        backgroundColor:'rgba(255,255,255,0.4)',
        marginBottom:20,
    },
    input: {
        backgroundColor:'rgba(255,255,255,0.6)',
        borderRadius:12,
        paddingHorizontal:16,
        paddingVertical:12,
    },
    textarea: { height:100, textAlignVertical:'top', marginBottom:14 },
    btn: {
        height:48,
        borderRadius:24,
        alignItems:'center',
        justifyContent:'center',
        shadowColor:'#0A84FF',
        shadowOpacity:0.25,
        shadowRadius:12,
        elevation:6,
    },
    btnTxt: { color:'#FFF', fontSize:17, fontWeight:'600' },
});
