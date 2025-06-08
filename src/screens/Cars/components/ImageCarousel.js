import React from 'react';
import {
    View,
    ScrollView,
    TouchableOpacity,
    Image,
    StyleSheet,
    Dimensions,
    Text,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const screenW = Dimensions.get('window').width;
const carouselH = 220;
const maxImages = 4;

export default function ImageCarousel({
                                          images,
                                          page,
                                          onPickImages,
                                          onRemoveImage,
                                          onPageChange,
                                      }) {
    return (
        <View style={styles.wrapper}>
            <ScrollView
                horizontal
                pagingEnabled
                showsHorizontalScrollIndicator={false}
                onMomentumScrollEnd={e => {
                    const w = screenW - 32;
                    const idx = Math.round(e.nativeEvent.contentOffset.x / w);
                    onPageChange(idx);
                }}
            >
                {images.length === 0 ? (
                    <TouchableOpacity style={styles.placeholder} onPress={onPickImages}>
                        <Ionicons name="add" size={48} color="#AAB4C0" />
                        <Text style={styles.placeholderTxt}>Tap to add photos</Text>
                    </TouchableOpacity>
                ) : (
                    images.map((img, idx) => (
                        <View key={idx} style={styles.imageSlot}>
                            <Image source={{ uri: img.uri }} style={styles.image} />
                            <TouchableOpacity
                                style={styles.deleteBtn}
                                onPress={() => onRemoveImage(idx)}
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
                            style={[
                                styles.dot,
                                i === page && { backgroundColor: '#0A84FF' },
                            ]}
                        />
                    ))}
                </View>
            )}

            {images.length > 0 && images.length < maxImages && (
                <TouchableOpacity style={styles.addMore} onPress={onPickImages}>
                    <Ionicons name="add" size={22} color="#0A84FF" />
                </TouchableOpacity>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    wrapper: {
        height: carouselH,
        marginBottom: 20,
        position: 'relative',
    },
    placeholder: {
        width: screenW - 32,
        height: carouselH,
        borderRadius: 12,
        backgroundColor: '#F4F6FA',
        alignItems: 'center',
        justifyContent: 'center',
    },
    placeholderTxt: {
        marginTop: 6,
        color: '#AAB4C0',
    },
    imageSlot: {
        width: screenW - 32,
        height: carouselH,
        marginRight: 16,
    },
    image: {
        width: '100%',
        height: '100%',
        borderRadius: 12,
    },
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
    dot: {
        width: 8,
        height: 8,
        borderRadius: 4,
        backgroundColor: '#C5CED6',
    },
    addMore: {
        position: 'absolute',
        right: 16,
        bottom: 16,
        backgroundColor: '#FFFFFFDD',
        borderRadius: 16,
        padding: 6,
    },
});
