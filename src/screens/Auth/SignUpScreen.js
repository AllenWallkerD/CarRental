import React, { useState } from 'react';
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    ActivityIndicator,
    TouchableWithoutFeedback,
    Keyboard,
    StyleSheet
} from 'react-native';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import AuthorizationAPI from '../../api/Authorization';
import { signUpStyles as styles } from './styles/SignUpStyles';
import PhoneInput from "../../components/PhoneInput";

const COUNTRY_OPTIONS = [
    { code: 'KZ🇰🇿', label: 'Kazakhstan', dial: '+7', max: 10},
    { code: 'US🇺🇸', label: 'USA', dial: '+1', max: 10},
    { code: 'GR🇩🇪', label: 'Germany', dial: '+49', max: 11}
];

export default function SignUpScreen({ navigation, route }) {
    const profileData = route?.params || {};
    const [form, setForm] = useState({
        username: '',
        password: '',
        first_name: '',
        last_name: '',
        date_of_birth: null,
        email: ''
    });
    const [phoneDigits, setPhoneDigits] = useState('');
    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false);
    const [isDatePickerVisible, setDatePickerVisible] = useState(false);
    const [dropdownVisible, setDropdownVisible] = useState(false);
    const [selectedCountry, setSelectedCountry] = useState(COUNTRY_OPTIONS[0]);

    const onChange = (k, v) => setForm(prev => ({ ...prev, [k]: v }));
    const onChangePhone = text => {
        const digits = text.replace(/\D/g, '').slice(0, selectedCountry.max);
        setPhoneDigits(digits);
    };
    const formatMask = digits => {
        let p1, p2, p3, p4;
        if (selectedCountry.code === 'KZ🇰🇿') {
            p1 = digits.slice(0, 3);
            p2 = digits.slice(3, 6);
            p3 = digits.slice(6, 8);
            p4 = digits.slice(8, 10);
            return `${p1}${p2 ? ' ' + p2 : ''}${p3 ? ' ' + p3 : ''}${p4 ? '-' + p4 : ''}`;
        }
        if (selectedCountry.code === 'US🇺🇸') {
            p1 = digits.slice(0, 3);
            p2 = digits.slice(3, 6);
            p3 = digits.slice(6, 10);
            return `${p1}${p2 ? ' ' + p2 : ''}${p3 ? '-' + p3 : ''}`;
        }
        if (selectedCountry.code === 'GR🇩🇪') {
            p1 = digits.slice(0, 3);
            p2 = digits.slice(3, 7);
            p3 = digits.slice(7, 11);
            return `${p1}${p2 ? ' ' + p2 : ''}${p3 ? '-' + p3 : ''}`;
        }
        return digits;
    };
    const validate = () => {
        const e = {};
        if (!form.username.trim()) e.username = 'Required';
        if (!form.password || form.password.length < 8) e.password = 'Min 8 chars';
        if (!form.first_name.trim()) e.first_name = 'Required';
        if (!form.last_name.trim()) e.last_name = 'Required';
        if (!form.date_of_birth) e.date_of_birth = 'Pick a date';
        if (!/\S+@\S+\.\S+/.test(form.email)) e.email = 'Invalid email';
        if (phoneDigits.length !== selectedCountry.max) e.phone_number = 'Invalid phone';
        setErrors(e);
        return Object.keys(e).length === 0;
    };
    const handleSignUp = async () => {
        if (!validate()) return;
        setLoading(true);
        setErrors({});
        const payload = {
            ...profileData,
            username: form.username.trim(),
            password: form.password,
            first_name: form.first_name.trim(),
            last_name: form.last_name.trim(),
            email: form.email.trim(),
            phone_number: selectedCountry.dial.replace('+', '') + phoneDigits,
            preferred_language: 'English',
            date_of_birth: form.date_of_birth.toISOString().slice(0, 10)
        };
        try {
            await AuthorizationAPI.register(payload);
            navigation.replace('Login');
        } catch (err) {
            const data = err.response?.data;
            const ne = {};
            if (data?.errors) {
                Object.entries(data.errors).forEach(([f, m]) => {
                    ne[f] = Array.isArray(m) ? m[0] : m;
                });
            } else if (typeof data?.message === 'string') {
                ne.message = data.message;
            } else ne.message = 'Unknown server error.';
            setErrors(ne);
        } finally {
            setLoading(false);
        }
    };
    const formatDate = d => {
        const dd = String(d.getDate()).padStart(2, '0');
        const mm = String(d.getMonth() + 1).padStart(2, '0');
        const yy = d.getFullYear();
        return `${dd}.${mm}.${yy}`;
    };

    return (
        <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
            <View style={styles.container}>
                <Text style={styles.title}>Create account</Text>
                {[
                    { k: 'username', ph: 'Username' },
                    { k: 'password', ph: 'Password', secure: true },
                    { k: 'first_name', ph: 'First Name' },
                    { k: 'last_name', ph: 'Last Name' },
                    { k: 'email', ph: 'Email', kb: 'email-address' }
                ].map(f => (
                    <View style={styles.wrap} key={f.k}>
                        <TextInput
                            style={[styles.input, errors[f.k] && { borderColor: 'red' }]}
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
                    <PhoneInput
                        error={!!errors.phone_number}
                        country={selectedCountry}
                        value={formatMask(phoneDigits)}
                        onChangeText={onChangePhone}
                        onChooseCountry={() => setDropdownVisible(v => !v)}
                    />
                    {dropdownVisible && (
                        <View style={localStyles.dropdown}>
                            {COUNTRY_OPTIONS.map(opt => (
                                <TouchableOpacity
                                    key={opt.code}
                                    style={localStyles.dropdownItem}
                                    onPress={() => {
                                        setSelectedCountry(opt);
                                        setPhoneDigits('');
                                        setDropdownVisible(false);
                                    }}
                                >
                                    <Text style={localStyles.dropdownTxt}>{opt.code}</Text>
                                </TouchableOpacity>
                            ))}
                        </View>
                    )}
                </View>
                {errors.phone_number && <Text style={styles.err}>{errors.phone_number}</Text>}
                <View style={styles.wrap}>
                    <TouchableOpacity
                        style={[styles.input, styles.dateInput, errors.date_of_birth && { borderColor: 'red' }]}
                        onPress={() => setDatePickerVisible(true)}
                    >
                        <Text style={{ color: form.date_of_birth ? '#000' : '#999' }}>
                            {form.date_of_birth ? formatDate(form.date_of_birth) : 'DD.MM.YYYY'}
                        </Text>
                    </TouchableOpacity>
                    {errors.date_of_birth && <Text style={styles.err}>{errors.date_of_birth}</Text>}
                </View>
                <DateTimePickerModal
                    isVisible={isDatePickerVisible}
                    mode="date"
                    maximumDate={new Date()}
                    date={form.date_of_birth || new Date(2000, 0, 1)}
                    onConfirm={d => {
                        setDatePickerVisible(false);
                        onChange('date_of_birth', d);
                    }}
                    onCancel={() => setDatePickerVisible(false)}
                />
                {errors.message && <Text style={[styles.err, { textAlign: 'center', marginBottom: 12 }]}>{errors.message}</Text>}
                <TouchableOpacity style={styles.btn} onPress={handleSignUp} disabled={loading}>
                    {loading ? <ActivityIndicator color="#FFF" /> : <Text style={styles.btnTxt}>Sign Up</Text>}
                </TouchableOpacity>
                <TouchableOpacity onPress={() => navigation.replace('Login')}>
                    <Text style={styles.switch}>
                        Have an account? <Text style={styles.link}>Login</Text>
                    </Text>
                </TouchableOpacity>
            </View>
        </TouchableWithoutFeedback>
    );
}

const localStyles = StyleSheet.create({
    dropdown: {
        position: 'absolute',
        top: '100%',
        backgroundColor: '#FFF',
        borderWidth: 1,
        borderColor: '#4C8BF5',
        borderRadius: 8,
        zIndex: 1000
    },
    dropdownItem: {
        paddingVertical: 8,
        paddingHorizontal: 4
    },
    dropdownTxt: {
        fontSize: 14
    }
});
