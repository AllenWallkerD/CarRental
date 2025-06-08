// PhoneInput.js
import React from 'react';
import { View, StyleSheet, Dimensions, TouchableOpacity, Text, TextInput, Image } from 'react-native';
import { AntDesign } from '@expo/vector-icons';
const { width } = Dimensions.get('screen');

const PhoneInput = ({ error, country, value, onChangeText, onChooseCountry }) => (
    <View style={styles.box}>
        <TouchableOpacity style={styles.countryBtn} onPress={onChooseCountry}>
            <Text style={styles.countryTxt}>{country.code}</Text>
            <AntDesign name="caretdown" size={12} color="#888" />
        </TouchableOpacity>
        <View style={[styles.inputBox, error && styles.error]}>
            <Text>{country.dial}</Text>
            <TextInput
                style={styles.input}
                keyboardType="number-pad"
                value={value}
                onChangeText={onChangeText}
            />
        </View>
    </View>
);

export default PhoneInput;

const styles = StyleSheet.create({
    box: {
        width: '100%',
        flexDirection: 'row',
        alignItems: 'center'
    },
    countryBtn: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 12,
        borderWidth: 1,
        borderColor: '#ddd',
        borderRadius: 8,
        marginRight: 8
    },
    countryTxt: {
        fontSize: 16,
        marginRight: 4
    },
    flag: {
        width: 24,
        height: 16,
        borderRadius: 2,
        marginRight: 4
    },
    inputBox: {
        flexDirection: 'row',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#ddd',
        borderRadius: 8,
        paddingHorizontal: 12,
        height: 48,
        flex: 1
    },
    input: {
        flex: 1,
        marginLeft: 5
    },
    error: {
        borderColor: 'red',
        borderWidth: 1.5
    }
});
