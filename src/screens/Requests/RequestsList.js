    import React, { useState, useCallback } from 'react';
    import {
        SafeAreaView,
        View,
        StyleSheet,
        FlatList,
        ActivityIndicator,
        Text,
        Alert,
    } from 'react-native';
    import { LinearGradient } from 'expo-linear-gradient';
    import { Ionicons } from '@expo/vector-icons';
    import { useFocusEffect } from '@react-navigation/native';
    import { useAuth } from '../../context/AuthContext';
    import {
        listOwnerRequests,
        approveRequest,
        rejectRequest,
    } from '../../api/Requests';
    import RequestsCard from './components/RequestsCard';
    
    const blue = '#0A84FF';
    
    export default function RequestsList({ navigation }) {
        const [requests, setRequests] = useState([]);
        const [loading, setLoading] = useState(true);
        const { userId, userToken } = useAuth();
    
        useFocusEffect(
            useCallback(() => {
                if (userToken === undefined) return;
                if (!userId || !userToken) {
                    navigation.replace('Login');
                    return;
                }
                setLoading(true);
                listOwnerRequests(userId)
                    .then((res) => {
                        console.log('Fetched requests:', res);
                        setRequests(res);
                    })
                    .catch((err) => {
                        console.log(
                            '[RequestsList] fetch error:',
                            err?.response?.data || err.message
                        );
                        setRequests([]);
                    })
                    .finally(() => setLoading(false));
            }, [userId, userToken])
        );
    
        const handleApprove = async (requestId) => {
            console.log(`Calling approveRequest with requestId = ${requestId}`);
            try {
                await approveRequest(userId, requestId);
                setRequests((prev) =>
                    prev.map((r) =>
                        r.id === requestId ? { ...r, status: 'approved' } : r
                    )
                );
            } catch (err) {
                console.log(
                    '[handleApprove] error:',
                    err?.response?.data || err.message
                );
                Alert.alert('Error', 'Unable to approve request');
            }
        };
    
        const handleReject = async (requestId) => {
            console.log(`Calling rejectRequest with requestId = ${requestId}`);
            try {
                await rejectRequest(userId, requestId);
                setRequests((prev) =>
                    prev.map((r) =>
                        r.id === requestId ? { ...r, status: 'rejected' } : r
                    )
                );
            } catch (err) {
                console.log(
                    '[handleReject] error:',
                    err?.response?.data || err.message
                );
                Alert.alert('Error', 'Unable to reject request');
            }
        };
    
        const renderItem = ({ item }) => (
            <RequestsCard
                request={item}
                onPress={() =>
                    navigation.navigate('RequestDetail', { request: item })
                }
                onApprove={() => handleApprove(item.id)}
                onReject={() => handleReject(item.id)}
            />
        );
    
        return (
            <LinearGradient
                colors={['#FFFFFF', '#F3F9FF', '#E6F2FF']}
                start={{ x: 0.5, y: 0 }}
                end={{ x: 0.5, y: 1 }}
                style={{ flex: 1 }}
            >
                <SafeAreaView style={styles.container}>
                    {loading ? (
                        <View style={styles.loader}>
                            <ActivityIndicator size="large" color={blue} />
                        </View>
                    ) : (
                        <FlatList
                            data={requests}
                            keyExtractor={(item) => item.id}
                            renderItem={renderItem}
                            contentContainerStyle={{
                                flexGrow: 1,
                                justifyContent:
                                    requests.length === 0 ? 'center' : 'flex-start',
                                paddingHorizontal: 16,
                                paddingVertical: 16,
                            }}
                            ListEmptyComponent={() => (
                                <View style={styles.emptyContainer}>
                                    <Ionicons
                                        name="alert-circle-outline"
                                        size={64}
                                        color={blue}
                                        style={{ marginBottom: 16 }}
                                    />
                                    <Text style={styles.emptyTitle}>
                                        No Requests Found
                                    </Text>
                                    <Text style={styles.emptySubtitle}>
                                        There are currently no rental requests for your cars.
                                    </Text>
                                </View>
                            )}
                        />
                    )}
                </SafeAreaView>
            </LinearGradient>
        );
    }
    
    const styles = StyleSheet.create({
        container: { flex: 1 },
        loader: { flex: 1, alignItems: 'center', justifyContent: 'center' },
        emptyContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
        emptyTitle: {
            fontSize: 20,
            fontWeight: '600',
            color: blue,
            marginBottom: 8,
        },
        emptySubtitle: {
            fontSize: 16,
            color: '#666',
            textAlign: 'center',
            paddingHorizontal: 24,
        },
    });
