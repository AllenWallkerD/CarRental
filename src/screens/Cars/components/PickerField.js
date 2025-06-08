import React from 'react';
import { Text, TouchableOpacity, StyleSheet } from 'react-native';

export default function PickerField({ label, value, onPress }) {
    return (
        <>
            <Text style={styles.label}>{label}</Text>
            <TouchableOpacity style={styles.input} onPress={onPress}>
                <Text style={styles.inputTxt}>
                    {value || `Select ${label.toLowerCase()}`}
                </Text>
            </TouchableOpacity>
        </>
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
        marginBottom: 14,
    },
    inputTxt: {
        fontSize: 15,
        color: '#1E2B3B',
    },
});
