import React, { useState } from 'react';
import {
    View, Text, TextInput, TouchableOpacity,
    ActivityIndicator, Alert
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import AuthorizationAPI from "../../api/Authorization";
import { loginStyles as styles } from './styles/LoginStyles';

export default function LoginScreen({ navigation }) {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [loading,  setLoading]  = useState(false);

    const handleLogin = async () => {
        if (!username.trim() || !password.trim()) {
            Alert.alert('Error', 'Please enter both username and password.');
            return;
        }
        setLoading(true);
        try {
            const { userId, token } = await AuthorizationAPI.login({ username, password });

            await AsyncStorage.setItem('userToken', token);
            await AsyncStorage.setItem('userId',    userId.toString());

            navigation.replace('App');
        } catch (err) {
            Alert.alert('Error', err?.response?.data?.message || 'Something went wrong.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Tour Guide</Text>
            <Text style={styles.subtitle}>Sign in to continue</Text>

            <TextInput
                style={styles.input}
                placeholder="Username"
                value={username}
                onChangeText={setUsername}
                autoCapitalize="none"
            />
            <TextInput
                style={styles.input}
                placeholder="Password"
                value={password}
                onChangeText={setPassword}
                secureTextEntry
            />

            <TouchableOpacity style={styles.btn} onPress={handleLogin} disabled={loading}>
                {loading
                    ? <ActivityIndicator color="#FFF" />
                    : <Text style={styles.btnTxt}>Login</Text>}
            </TouchableOpacity>

            <TouchableOpacity onPress={() => navigation.navigate('SignUp')}>
                <Text style={styles.switch}>
                    Don’t have an account? <Text style={styles.link}>Sign up</Text>
                </Text>
            </TouchableOpacity>
        </View>
    );
}
