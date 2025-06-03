import React from 'react';
import {
    TouchableOpacity,
    View,
    Text,
    Image,
    StyleSheet,
    Dimensions,
} from 'react-native';
import { BlurView } from 'expo-blur';
import { Ionicons } from '@expo/vector-icons';

const width = Dimensions.get('window').width;

export default function CarCard({ item, onPress, onDelete }) {
    const imageUrl =
        item.imageUrls && item.imageUrls.length > 0 ? item.imageUrls[0] : null;

    return (
        <TouchableOpacity onPress={onPress} style={styles.wrapper}>
            <BlurView intensity={20} tint="light" style={styles.card}>
                <TouchableOpacity style={styles.deleteIcon} onPress={onDelete}>
                    <Ionicons name="trash-outline" size={20} color="#FF3B30" />
                </TouchableOpacity>

                {imageUrl ? (
                    <Image source={{ uri: imageUrl }} style={styles.image} />
                ) : (
                    <View style={styles.placeholder}>
                        <Text style={styles.placeholderText}>No Image</Text>
                    </View>
                )}

                <View style={styles.info}>
                    <Text style={styles.brand}>{item.brand}</Text>
                    <Text style={styles.model}>{item.model}</Text>
                    <Text style={styles.year}>
                        {item.year} · {item.color}
                    </Text>
                </View>
            </BlurView>
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    wrapper: {
        marginBottom: 18,
        alignItems: 'center',
    },
    card: {
        width: width - 32,
        height: 120,
        borderRadius: 16,
        flexDirection: 'row',
        overflow: 'hidden',
        backgroundColor: "#D7E7FF",
    },
    deleteIcon: {
        position: 'absolute',
        top: 8,
        right: 8,
        zIndex: 1,
        backgroundColor: 'rgba(255,255,255,0.8)',
        borderRadius: 12,
        padding: 4,
    },
    image: {
        width: 140,
        height: '100%',
        resizeMode: 'cover',
    },
    placeholder: {
        width: 140,
        height: '100%',
        backgroundColor: '#E0E6EF',
        justifyContent: 'center',
        alignItems: 'center',
    },
    placeholderText: {
        color: '#6E7A8A',
        fontSize: 14,
    },
    info: {
        flex: 1,
        padding: 16,
        justifyContent: 'center',
    },
    brand: {
        fontSize: 18,
        fontWeight: '700',
        color: '#1E2B3B',
    },
    model: {
        fontSize: 16,
        fontWeight: '500',
        color: '#3A485A',
        marginTop: 4,
    },
    year: {
        fontSize: 14,
        color: '#6E7A8A',
        marginTop: 4,
    },
});
