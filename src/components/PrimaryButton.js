import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';

const blue = '#0A84FF';
const lightBlue = '#5EB4FF';

export default function PrimaryButton({ title, onPress, style }) {
    return (
        <TouchableOpacity onPress={onPress} style={[styles.btn, style]}>
            <Text style={styles.txt}>{title}</Text>
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    btn: {
        backgroundColor: lightBlue,
        borderColor: blue,
        borderWidth: 1,
        borderRadius: 12,
        paddingVertical: 12,
        alignItems: 'center',
        justifyContent: 'center',
    },
    txt: { color: '#FFF', fontSize: 17, fontWeight: '600' },
});
