import React, { useState } from 'react';
import { SafeAreaView, ScrollView, View, Text, Image, TouchableOpacity, StyleSheet, Dimensions, Alert } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useAuth } from '../../context/AuthContext';
import { approveRequest, rejectRequest } from '../../api/Requests';

const screenW = Dimensions.get('window').width;
const blue = '#0A84FF';

export default function RequestDetail({ route }) {
    const { request } = route.params;
    const [status, setStatus] = useState(request.status);
    const { userId } = useAuth();

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
        <LinearGradient
            colors={['#FFFFFF', '#F3F9FF', '#E6F2FF']}
            start={{ x: 0.5, y: 0 }}
            end={{ x: 0.5, y: 1 }}
            style={{ flex: 1 }}
        >
            <SafeAreaView style={styles.container}>
                <ScrollView contentContainerStyle={styles.content}>
                    {request.carImageUrls?.[0] && (
                        <Image source={{ uri: request.carImageUrls[0] }} style={styles.carImage} />
                    )}
                    <View style={styles.section}>
                        <Text style={styles.label}>Request ID</Text>
                        <Text style={styles.value}>{request.id}</Text>
                    </View>
                    <View style={styles.section}>
                        <Text style={styles.label}>User ID</Text>
                        <Text style={styles.value}>{request.userId}</Text>
                    </View>
                    <View style={styles.section}>
                        <Text style={styles.label}>Car ID</Text>
                        <Text style={styles.value}>{request.carId}</Text>
                    </View>
                    <View style={styles.section}>
                        <Text style={styles.label}>Car</Text>
                        <Text style={styles.value}>
                            {request.carBrand} {request.carModel} ({request.carYear})
                        </Text>
                    </View>
                    <View style={styles.section}>
                        <Text style={styles.label}>Driving License</Text>
                        {request.drivingLicenseUrl ? (
                            <Image source={{ uri: request.drivingLicenseUrl }} style={styles.documentImage} />
                        ) : (
                            <Text style={styles.value}>N/A</Text>
                        )}
                    </View>
                    <View style={styles.section}>
                        <Text style={styles.label}>Selfie</Text>
                        {request.selfieUrl ? (
                            <Image source={{ uri: request.selfieUrl }} style={styles.documentImage} />
                        ) : (
                            <Text style={styles.value}>N/A</Text>
                        )}
                    </View>
                    <View style={styles.section}>
                        <Text style={styles.label}>Start Date</Text>
                        <Text style={styles.value}>{request.startDate}</Text>
                    </View>
                    <View style={styles.section}>
                        <Text style={styles.label}>End Date</Text>
                        <Text style={styles.value}>{request.endDate}</Text>
                    </View>
                    <View style={styles.section}>
                        <Text style={styles.label}>Status</Text>
                        <Text style={[styles.statusText, statusStyles[status]]}>
                            {status.charAt(0).toUpperCase() + status.slice(1)}
                        </Text>
                    </View>
                    {status === 'pending' && (
                        <View style={styles.buttonContainer}>
                            <TouchableOpacity style={[styles.button, styles.approveButton]} onPress={handleApprove}>
                                <Text style={styles.buttonText}>Approve</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={[styles.button, styles.rejectButton]} onPress={handleReject}>
                                <Text style={styles.buttonText}>Reject</Text>
                            </TouchableOpacity>
                        </View>
                    )}
                </ScrollView>
            </SafeAreaView>
        </LinearGradient>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1 },
    content: { padding: 16, alignItems: 'center' },
    carImage: { width: screenW - 32, height: 200, borderRadius: 12, marginBottom: 16, resizeMode: 'cover' },
    section: { width: '100%', marginBottom: 12 },
    label: { fontSize: 14, fontWeight: '500', color: '#3A485A', marginBottom: 4 },
    value: { fontSize: 16, fontWeight: '600', color: '#1E2B3B' },
    documentImage: { width: screenW - 64, height: 180, borderRadius: 8, resizeMode: 'contain', marginTop: 4 },
    statusText: { fontSize: 16, fontWeight: '600', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 8, color: '#FFF', alignSelf: 'flex-start', marginTop: 4 },
    buttonContainer: { flexDirection: 'row', marginTop: 24, width: '100%', justifyContent: 'space-between' },
    button: { flex: 1, paddingVertical: 12, borderRadius: 8, alignItems: 'center' },
    approveButton: { backgroundColor: '#5CB85C', marginRight: 8 },
    rejectButton: { backgroundColor: '#D9534F', marginLeft: 8 },
    buttonText: { color: '#FFF', fontSize: 16, fontWeight: '600' },
});

const statusStyles = StyleSheet.create({
    pending: { backgroundColor: '#F0AD4E' },
    approved: { backgroundColor: '#5CB85C' },
    rejected: { backgroundColor: '#D9534F' },
});
