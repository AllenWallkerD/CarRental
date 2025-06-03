import React from 'react';
import { Modal, View, Text, TouchableOpacity, StyleSheet } from 'react-native';

export default function LogoutModal({ visible, onConfirm, onCancel }) {
    return (
        <Modal transparent visible={visible} animationType="fade">
            <View style={styles.overlay}>
                <View style={styles.container}>
                    <Text style={styles.text}>Are you sure you want to logout?</Text>
                    <View style={styles.buttons}>
                        <TouchableOpacity style={styles.noButton} onPress={onCancel}>
                            <Text style={styles.noText}>No</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.yesButton} onPress={onConfirm}>
                            <Text style={styles.yesText}>Yes</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        </Modal>
    );
}

const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.4)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    container: {
        width: 280,
        padding: 20,
        backgroundColor: '#FFF',
        borderRadius: 12,
        alignItems: 'center',
    },
    text: {
        fontSize: 16,
        color: '#333',
        marginBottom: 20,
        textAlign: 'center',
    },
    buttons: {
        flexDirection: 'row',
        width: '100%',
        justifyContent: 'space-between',
    },
    noButton: {
        flex: 1,
        marginRight: 8,
        paddingVertical: 10,
        borderRadius: 8,
        backgroundColor: '#ccc',
        alignItems: 'center',
    },
    yesButton: {
        flex: 1,
        marginLeft: 8,
        paddingVertical: 10,
        borderRadius: 8,
        backgroundColor: '#D9534F',
        alignItems: 'center',
    },
    noText: {
        color: '#333',
        fontSize: 15,
        fontWeight: '500',
    },
    yesText: {
        color: '#FFF',
        fontSize: 15,
        fontWeight: '500',
    },
});
