import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default function AddCarButton({ onPress }) {
    return (
        <TouchableOpacity style={styles.addButton} onPress={onPress}>
            <Ionicons
                name="add-circle-outline"
                size={20}
                color="#FFF"
                style={{ marginRight: 8 }}
            />
            <Text style={styles.addText}>Add a Car</Text>
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    addButton: {
        backgroundColor: '#5EB4FF',
        borderColor: '#0A84FF',
        borderWidth: 1,
        borderRadius: 12,
        paddingVertical: 12,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        marginVertical: 12,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5,
    },
    addText: {
        color: '#FFF',
        fontSize: 17,
        fontWeight: '600',
    },
});
