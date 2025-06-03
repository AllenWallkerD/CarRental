// components/RequestsCard.js
import React from 'react';
import { TouchableOpacity, View, Text, Image, StyleSheet, Dimensions, ImageBackground } from 'react-native';
import { BlurView } from 'expo-blur';

const cardWidth = Dimensions.get('window').width - 32;
const cardHeight = 200;

export default function RequestsCard({ request, onPress, onApprove, onReject }) {
    const backgroundUrl = request.carImageUrls?.[0] || null;

    const formatDate = (iso) => {
        const d = new Date(iso);
        return d.toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric',
        });
    };

    return (
        <TouchableOpacity onPress={onPress} style={styles.wrapper}>
            {backgroundUrl ? (
                <ImageBackground
                    source={{ uri: backgroundUrl }}
                    style={styles.card}
                    imageStyle={styles.imageBackground}
                >
                    <BlurView intensity={30} tint="light" style={styles.overlay}>
                        <View style={styles.info}>
                            <Text style={styles.title}>
                                {request.carBrand} {request.carModel} ({request.carYear})
                            </Text>
                            <Text style={styles.subtitle}>
                                {formatDate(request.startDate)} → {formatDate(request.endDate)}
                            </Text>
                            <Text style={[styles.status, statusStyles[request.status]]}>
                                {request.status.charAt(0).toUpperCase() + request.status.slice(1)}
                            </Text>
                        </View>
                        {request.status === 'pending' && (
                            <View style={styles.footer}>
                                <TouchableOpacity style={[styles.button, styles.approve]} onPress={onApprove}>
                                    <Text style={styles.buttonText}>Approve</Text>
                                </TouchableOpacity>
                                <TouchableOpacity style={[styles.button, styles.reject]} onPress={onReject}>
                                    <Text style={styles.buttonText}>Reject</Text>
                                </TouchableOpacity>
                            </View>
                        )}
                    </BlurView>
                </ImageBackground>
            ) : (
                <BlurView intensity={20} tint="light" style={styles.card}>
                    <View style={styles.info}>
                        <Text style={styles.title}>
                            {request.carBrand} {request.carModel} ({request.carYear})
                        </Text>
                        <Text style={styles.subtitle}>
                            {formatDate(request.startDate)} → {formatDate(request.endDate)}
                        </Text>
                        <Text style={[styles.status, statusStyles[request.status]]}>
                            {request.status.charAt(0).toUpperCase() + request.status.slice(1)}
                        </Text>
                    </View>
                    {request.status === 'pending' && (
                        <View style={styles.footer}>
                            <TouchableOpacity style={[styles.button, styles.approve]} onPress={onApprove}>
                                <Text style={styles.buttonText}>Approve</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={[styles.button, styles.reject]} onPress={onReject}>
                                <Text style={styles.buttonText}>Reject</Text>
                            </TouchableOpacity>
                        </View>
                    )}
                </BlurView>
            )}
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
        height: cardHeight,
        borderRadius: 16,
        overflow: 'hidden',
    },
    imageBackground: {
        width: '100%',
        height: '100%',
    },
    overlay: {
        flex: 1,
        justifyContent: 'space-between',
        backgroundColor: 'rgba(255,255,255,0.2)',
    },
    info: {
        padding: 12,
    },
    title: {
        fontSize: 18,
        fontWeight: '700',
        color: '#FFF',
        textShadowColor: '#000',
        textShadowOffset: { width: 0, height: 1 },
        textShadowRadius: 2,
    },
    subtitle: {
        fontSize: 15,
        color: '#EEE',
        marginTop: 4,
        textShadowColor: '#000',
        textShadowOffset: { width: 0, height: 1 },
        textShadowRadius: 2,
    },
    status: {
        marginTop: 6,
        fontSize: 14,
        fontWeight: '600',
        alignSelf: 'flex-start',
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: 8,
        color: '#FFF',
        textShadowColor: '#000',
        textShadowOffset: { width: 0, height: 1 },
        textShadowRadius: 2,
    },
    footer: {
        flexDirection: 'row',
        padding: 12,
        backgroundColor: 'rgba(0,0,0,0.3)',
    },
    button: {
        flex: 1,
        paddingVertical: 10,
        borderRadius: 6,
        alignItems: 'center',
        marginRight: 8,
    },
    approve: {
        backgroundColor: '#5CB85C',
    },
    reject: {
        backgroundColor: '#D9534F',
        marginRight: 0,
        marginLeft: 8,
    },
    buttonText: {
        color: '#FFF',
        fontSize: 15,
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
    completed: {
        backgroundColor: '#007BFF',
    },
});
