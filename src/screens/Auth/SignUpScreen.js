import React, { useState } from 'react';
import {
    View, Text, TextInput, TouchableOpacity,
    ActivityIndicator, Platform
} from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import AuthorizationAPI from '../../api/Authorization';
import { signUpStyles as styles } from './styles/SignUpStyles';

export default function SignUpScreen({ navigation, route }) {
    const profileData = route?.params || {};

    const [form, setForm] = useState({
        username: '', password: '',
        first_name: '', last_name: '',
        date_of_birth: null,
        email: '', phone_number: '',
        preferred_language: 'English',
    });

    const [errors,  setErrors]  = useState({});
    const [loading, setLoading] = useState(false);
    const [showDate, setShowDate] = useState(false);

    const onChange = (k, v) => setForm(prev => ({ ...prev, [k]: v }));

    const validate = () => {
        const e = {};
        if (!form.username.trim())            e.username = 'Required';
        if (!form.password || form.password.length < 8) e.password = 'Min 8 chars';
        if (!form.first_name.trim())          e.first_name = 'Required';
        if (!form.last_name.trim())           e.last_name  = 'Required';
        if (!form.date_of_birth)              e.date_of_birth = 'Pick a date';
        if (!/\S+@\S+\.\S+/.test(form.email)) e.email = 'Invalid email';
        if (!/^\d{10,15}$/.test(form.phone_number)) e.phone_number = 'Digits only';
        setErrors(e);
        return Object.keys(e).length === 0;
    };

    const handleSignUp = async () => {
        if (!validate()) return;
        setLoading(true);
        setErrors({});

        const payload = {
            ...profileData,
            ...form,
            date_of_birth: form.date_of_birth.toISOString().slice(0, 10),
        };


        try {
            const res = await AuthorizationAPI.register(payload);
            navigation.replace('Login');
        } catch (err) {
            console.log('ERROR RESPONSE ←', err.response?.data);
            const data = err.response?.data;
            if (data?.errors)       setErrors(data.errors);
            else if (data?.message) setErrors({ message: data.message });
            else                    setErrors({ message: 'Unknown server error.' });
        } finally {
            setLoading(false);
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Create account</Text>

            {[
                { k:'username',  ph:'Username' },
                { k:'password',  ph:'Password', secure:true },
                { k:'first_name', ph:'First Name' },
                { k:'last_name',  ph:'Last Name' },
                { k:'email',      ph:'Email', kb:'email-address' },
                { k:'phone_number', ph:'Phone Number', kb:'phone-pad' },
                { k:'preferred_language', ph:'Preferred Language' },
            ].map(f => (
                <View style={styles.wrap} key={f.k}>
                    <TextInput
                        style={[
                            styles.input,
                            errors[f.k] && { borderColor: 'red' },
                        ]}
                        placeholder={f.ph}
                        value={form[f.k]}
                        onChangeText={v => onChange(f.k, v)}
                        autoCapitalize="none"
                        secureTextEntry={f.secure}
                        keyboardType={f.kb || 'default'}
                    />
                    {errors[f.k] && <Text style={styles.err}>{errors[f.k]}</Text>}
                </View>
            ))}

            <View style={styles.wrap}>
                <TouchableOpacity
                    style={[
                        styles.input,
                        styles.dateInput,
                        errors.date_of_birth && { borderColor: 'red' },
                    ]}
                    onPress={() => setShowDate(true)}
                >
                    <Text>
                        {form.date_of_birth
                            ? form.date_of_birth.toISOString().slice(0, 10)
                            : 'Date of Birth'}
                    </Text>
                </TouchableOpacity>
                {errors.date_of_birth && <Text style={styles.err}>{errors.date_of_birth}</Text>}
            </View>

            {showDate && (
                <DateTimePicker
                    value={form.date_of_birth || new Date(2000, 0, 1)}
                    mode="date"
                    maximumDate={new Date()}
                    display="default"
                    onChange={(_, d) => {
                        if (Platform.OS !== 'ios') setShowDate(false);
                        if (d) onChange('date_of_birth', d);
                    }}
                />
            )}

            {errors.message && (
                <Text style={[styles.err, { textAlign: 'center' }]}>{errors.message}</Text>
            )}

            <TouchableOpacity
                style={styles.btn}
                onPress={handleSignUp}
                disabled={loading}
            >
                {loading
                    ? <ActivityIndicator color="#FFF" />
                    : <Text style={styles.btnTxt}>Sign Up</Text>}
            </TouchableOpacity>

            <TouchableOpacity onPress={() => navigation.replace('Login')}>
                <Text style={styles.switch}>
                    Have an account? <Text style={styles.link}>Login</Text>
                </Text>
            </TouchableOpacity>
        </View>
    );
}
