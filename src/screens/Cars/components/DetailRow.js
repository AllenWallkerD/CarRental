import React from 'react'
import { View, Text, TextInput, StyleSheet } from 'react-native'

export default function DetailRow({
                                      label,
                                      value,
                                      onChange,
                                      editable,
                                      placeholder,
                                      keyboardType,
                                      multiline
                                  }) {
    return (
        <View style={styles.row}>
            <View style={styles.labelContainer}>
                <Text style={styles.rowLabel}>{label}</Text>
            </View>
            {editable ? (
                <TextInput
                    style={[styles.rowInput, multiline && { height: 80 }]}
                    value={value}
                    onChangeText={onChange}
                    placeholder={placeholder}
                    keyboardType={keyboardType}
                    multiline={multiline}
                    textAlign="right"
                />
            ) : (
                <Text style={[styles.rowValue, multiline && { flex: 1 }]}>{value || '—'}</Text>
            )}
        </View>
    )
}

const styles = StyleSheet.create({
    row: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 8
    },
    labelContainer: {
        width: 100
    },
    rowLabel: {
        fontSize: 16,
        fontWeight: '500',
        color: '#3A485A'
    },
    rowValue: {
        fontSize: 16,
        fontWeight: '600',
        color: '#1E2B3B',
        flexShrink: 1,
        textAlign: 'right'
    },
    rowInput: {
        flex: 1,
        fontSize: 16,
        fontWeight: '600',
        color: '#1E2B3B',
        borderWidth: 1,
        borderColor: '#C5CED6',
        borderRadius: 8,
        paddingHorizontal: 8,
        paddingVertical: 4,
        backgroundColor: '#FFF'
    }
})
