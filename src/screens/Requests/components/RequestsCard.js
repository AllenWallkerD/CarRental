import React from 'react';
import { TouchableOpacity, View, Text, Image, StyleSheet, Dimensions } from 'react-native';
import { BlurView } from 'expo-blur';

const cardWidth = Dimensions.get('window').width - 32;

export default function RequestsCard({ request, onPress, onApprove, onReject }) {
    const thumbnailUrl = request.carImageUrls?.[0] || null;
    return (
        <TouchableOpacity onPress={onPress} style={styles.wrapper}>
            <BlurView intensity={20} tint="light" style={styles.card}>
                {thumbnailUrl ? (
                    <Image source={{ uri: thumbnailUrl }} style={styles.image} />
                ) : (
                    <View style={styles.placeholder}>
                        <Text style={styles.placeholderText}>No Image</Text>
                    </View>
                )}
                <View style={styles.info}>
                    <Text style={styles.title}>
                        {request.carBrand} {request.carModel}
                    </Text>
                    <Text style={styles.subtitle}>
                        {request.carYear} · {request.startDate} → {request.endDate}
                    </Text>
                    <Text style={[styles.status, statusStyles[request.status]]}>
                        {request.status.charAt(0).toUpperCase() + request.status.slice(1)}
                    </Text>
                    {request.status === 'pending' && (
                        <View style={styles.buttonRow}>
                            <TouchableOpacity style={[styles.button, styles.approve]} onPress={onApprove}>
                                <Text style={styles.buttonText}>Approve</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={[styles.button, styles.reject]} onPress={onReject}>
                                <Text style={styles.buttonText}>Reject</Text>
                            </TouchableOpacity>
                        </View>
                    )}
                </View>
            </BlurView>
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    wrapper: {
        marginBottom: 16,
        alignItems: 'center',
    },
    card: {
        width: cardWidth,
        borderRadius: 16,
        flexDirection: 'row',
        overflow: 'hidden',
        backgroundColor: 'rgba(255,255,255,0.4)',
    },
    image: {
        width: 100,
        height: 120,
        resizeMode: 'cover',
    },
    placeholder: {
        width: 100,
        height: 120,
        backgroundColor: '#E0E6EF',
        justifyContent: 'center',
        alignItems: 'center',
    },
    placeholderText: {
        color: '#6E7A8A',
        fontSize: 12,
    },
    info: {
        flex: 1,
        paddingHorizontal: 12,
        paddingVertical: 10,
        justifyContent: 'space-between',
    },
    title: {
        fontSize: 16,
        fontWeight: '700',
        color: '#1E2B3B',
    },
    subtitle: {
        fontSize: 14,
        color: '#3A485A',
        marginTop: 2,
    },
    status: {
        marginTop: 4,
        fontSize: 13,
        fontWeight: '600',
        alignSelf: 'flex-start',
        paddingHorizontal: 8,
        paddingVertical: 2,
        borderRadius: 8,
        color: '#FFF',
    },
    buttonRow: {
        flexDirection: 'row',
        marginTop: 8,
        justifyContent: 'flex-start',
    },
    button: {
        flex: 1,
        paddingVertical: 6,
        borderRadius: 6,
        alignItems: 'center',
        marginRight: 8,
    },
    approve: {
        backgroundColor: '#5CB85C',
    },
    reject: {
        backgroundColor: '#D9534F',
    },
    buttonText: {
        color: '#FFF',
        fontSize: 14,
        fontWeight: '600',
    },
});

const statusStyles = StyleSheet.create({
    pending: {
        backgroundColor: '#F0AD4E',
    },
    approved: {
        backgroundColor: '#5CB85C',
    },
    rejected: {
        backgroundColor: '#D9534F',
    },
});
