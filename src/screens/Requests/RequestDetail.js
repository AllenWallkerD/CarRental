// screens/Requests/RequestDetail.js
import React, { useState, useLayoutEffect } from 'react';
import {
    SafeAreaView,
    ScrollView,
    View,
    Text,
    Image,
    ImageBackground,
    TouchableOpacity,
    StyleSheet,
    Dimensions,
    Alert,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useAuth } from '../../context/AuthContext';
import { approveRequest, rejectRequest } from '../../api/Requests';

const screenW = Dimensions.get('window').width;
const blue = '#0A84FF';

export default function RequestDetail({ route, navigation }) {
    const { request } = route.params;
    const [status, setStatus] = useState(request.status);
    const { userId } = useAuth();

    useLayoutEffect(() => {
        navigation.setOptions({ headerShown: false });
    }, [navigation]);

    const formatDate = (iso) => {
        const d = new Date(iso);
        return d.toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric',
        });
    };

    const handleApprove = async () => {
        try {
            await approveRequest(userId, request.id);
            setStatus('approved');
            Alert.alert('Request Approved');
        } catch {
            Alert.alert('Error', 'Unable to approve request');
        }
    };

    const handleReject = async () => {
        try {
            await rejectRequest(userId, request.id);
            setStatus('rejected');
            Alert.alert('Request Rejected');
        } catch {
            Alert.alert('Error', 'Unable to reject request');
        }
    };

    return (
        <SafeAreaView style={styles.container}>
            <ImageBackground
                source={{ uri: request.carImageUrls?.[0] }}
                style={styles.headerImage}
            >
                <LinearGradient
                    colors={['rgba(0,0,0,0.3)', 'rgba(0,0,0,0.6)']}
                    style={styles.headerOverlay}
                />
                <TouchableOpacity
                    style={styles.backButton}
                    onPress={() => navigation.goBack()}
                >
                    <Ionicons name="chevron-back" size={28} color="#FFF" />
                </TouchableOpacity>
                <View style={styles.headerTextContainer}>
                    <Text style={styles.headerTitle}>
                        {request.carBrand} {request.carModel}
                    </Text>
                    <View style={styles.yearStatusRow}>
                        <Text style={styles.headerSubtitle}>{request.carYear}</Text>
                        <Text style={[styles.statusBadge, statusStyles[status]]}>
                            {status.charAt(0).toUpperCase() + status.slice(1)}
                        </Text>
                    </View>
                </View>
            </ImageBackground>

            <ScrollView contentContainerStyle={styles.content}>
                <View style={styles.periodCard}>
                    <MaterialCommunityIcons
                        name="calendar-range"
                        size={20}
                        color={blue}
                        style={styles.infoIcon}
                    />
                    <Text style={styles.periodText}>
                        {formatDate(request.startDate)} → {formatDate(request.endDate)}
                    </Text>
                </View>

                <View style={styles.card}>
                    <Text style={styles.sectionLabel}>Driving License</Text>
                    {request.drivingLicenseUrl ? (
                        <Image
                            source={{ uri: request.drivingLicenseUrl }}
                            style={styles.licenseImage}
                        />
                    ) : (
                        <View style={styles.placeholder}>
                            <Ionicons name="document-outline" size={40} color="#AAA" />
                        </View>
                    )}
                </View>

                <View style={styles.card}>
                    <Text style={styles.sectionLabel}>Photo of the Driver</Text>
                    {request.selfieUrl ? (
                        <Image
                            source={{ uri: request.selfieUrl }}
                            style={styles.selfieImage}
                        />
                    ) : (
                        <View style={[styles.placeholder, styles.selfiePlaceholder]}>
                            <Ionicons name="camera-outline" size={40} color="#AAA" />
                        </View>
                    )}
                </View>
            </ScrollView>

            {status === 'pending' && (
                <View style={styles.footer}>
                    <TouchableOpacity
                        style={[styles.footerButton, styles.rejectButton]}
                        onPress={handleReject}
                    >
                        <Text style={styles.footerButtonText}>Reject</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={[styles.footerButton, styles.approveButton]}
                        onPress={handleApprove}
                    >
                        <Text style={styles.footerButtonText}>Approve</Text>
                    </TouchableOpacity>
                </View>
            )}
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#F7F9FC' },
    headerImage: { width: '100%', height: 240, position: 'relative' },
    headerOverlay: { ...StyleSheet.absoluteFillObject },
    backButton: { position: 'absolute', top: 16, left: 16, padding: 8 },
    headerTextContainer: { position: 'absolute', bottom: 16, left: 16 },
    headerTitle: { fontSize: 24, fontWeight: '700', color: '#FFF' },
    yearStatusRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 4,
    },
    headerSubtitle: { fontSize: 16, color: '#DDD' },
    statusBadge: {
        marginLeft: 12,
        paddingHorizontal: 10,
        paddingVertical: 6,
        borderRadius: 8,
        fontSize: 14,
        fontWeight: '600',
        color: '#FFF',
        textAlign: 'center',
    },

    content: { paddingHorizontal: 16, paddingTop: 16, paddingBottom: 80 },
    periodCard: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#FFF',
        alignSelf: 'center',
        width: screenW * 0.9,
        borderRadius: 12,
        paddingVertical: 12,
        paddingHorizontal: 16,
        marginBottom: 16,
        shadowColor: '#000',
        shadowOpacity: 0.1,
        shadowRadius: 8,
        shadowOffset: { width: 0, height: 4 },
        elevation: 4,
    },
    infoIcon: { marginRight: 8 },
    periodText: { fontSize: 16, fontWeight: '600', color: '#1E2B3B' },

    card: {
        backgroundColor: '#FFF',
        borderRadius: 12,
        padding: 16,
        marginBottom: 16,
        shadowColor: '#000',
        shadowOpacity: 0.1,
        shadowRadius: 8,
        shadowOffset: { width: 0, height: 4 },
        elevation: 4,
    },
    sectionLabel: {
        fontSize: 14,
        fontWeight: '600',
        color: '#3A485A',
        marginBottom: 8,
    },
    licenseImage: {
        width: '100%',
        aspectRatio: 16 / 9,
        borderRadius: 8,
        resizeMode: 'cover',
    },
    selfieImage: {
        alignSelf: 'center',
        width: screenW * 0.6,
        aspectRatio: 9 / 16,
        borderRadius: 8,
        resizeMode: 'cover',
    },
    selfiePlaceholder: {
        aspectRatio: 9 / 16,
    },
    placeholder: {
        width: '100%',
        aspectRatio: 16 / 9,
        borderRadius: 8,
        backgroundColor: '#EEE',
        justifyContent: 'center',
        alignItems: 'center',
    },

    footer: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        flexDirection: 'row',
        borderTopWidth: 1,
        borderTopColor: '#E0E6EF',
        backgroundColor: '#FFF',
        padding: 12,
    },
    footerButton: {
        flex: 1,
        paddingVertical: 14,
        borderRadius: 8,
        alignItems: 'center',
    },
    rejectButton: { backgroundColor: '#D9534F', marginRight: 8 },
    approveButton: { backgroundColor: '#5CB85C', marginLeft: 8 },
    footerButtonText: { color: '#FFF', fontSize: 16, fontWeight: '600' },
});

const statusStyles = StyleSheet.create({
    pending: { backgroundColor: '#F0AD4E' },
    approved: { backgroundColor: '#5CB85C' },
    rejected: { backgroundColor: '#D9534F' },
    completed: { backgroundColor: '#007BFF' },
});
