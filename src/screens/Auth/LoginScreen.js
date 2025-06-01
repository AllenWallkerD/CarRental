import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ActivityIndicator, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import AuthorizationAPI from '../../api/Authorization';
import { loginStyles as styles } from './styles/LoginStyles';
import { useAuth } from '../../context/AuthContext';

export default function LoginScreen({ navigation }) {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [loading,  setLoading]  = useState(false);

    const { login } = useAuth();

    const handleLogin = async () => {
        if (!username.trim() || !password.trim()) {
            return Alert.alert('Error', 'Please enter both username and password.');
        }

        setLoading(true);
        try {
            const { userId, token } = await AuthorizationAPI.login({ username, password });

            await login({ userId, token });
            // после этого RootNavigation должен показать AppTabs
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
