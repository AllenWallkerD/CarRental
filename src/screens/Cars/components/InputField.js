import React from 'react';
import { View, Text, TextInput, StyleSheet } from 'react-native';

export default function InputField({
                                       label,
                                       value,
                                       onChange,
                                       keyboardType,
                                       error,
                                   }) {
    return (
        <View style={{ marginBottom: 14 }}>
            <Text style={styles.label}>{label}</Text>
            <TextInput
                style={[styles.input, error && { borderColor: 'red', borderWidth: 1 }]}
                placeholder={label}
                value={value}
                keyboardType={keyboardType || 'default'}
                onChangeText={onChange}
            />
            {error && <Text style={styles.errorText}>{error}</Text>}
        </View>
    );
}

const styles = StyleSheet.create({
    label: {
        fontSize: 15,
        fontWeight: '500',
        color: '#1E2B3B',
        marginBottom: 4,
    },
    input: {
        backgroundColor: 'rgba(255,255,255,0.6)',
        borderRadius: 12,
        paddingHorizontal: 16,
        paddingVertical: 12,
    },
    errorText: {
        color: 'red',
        marginTop: 4,
    },
});
