import { StyleSheet } from 'react-native';

export const signUpStyles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        paddingHorizontal: 20,
        backgroundColor: '#FFFFFF',
    },
    logo: {
        width: 200,
        height: 200,
        resizeMode: 'contain',
        alignSelf: 'center',
        marginBottom: 15,
    },
    title: {
        fontSize: 26,
        fontFamily: 'robotoBold',
        marginBottom: 10,
        textAlign: 'center',
        color: '#000000',
    },
    wrap: {
        marginBottom: 12,
    },
    input: {
        padding: 12,
        borderRadius: 10,
        borderWidth: 1,
        borderColor: '#CCCCCC',
        fontSize: 16,
        fontFamily: 'roboto',
        backgroundColor: '#F5F5F5',
        color: '#000000',
    },
    err: {
        color: 'red',
        fontSize: 13,
        marginBottom: 4,
    },
    dateInput: {
        justifyContent: 'center',
    },
    btn: {
        padding: 14,
        borderRadius: 10,
        alignItems: 'center',
        marginTop: 6,
        marginBottom: 15,
        backgroundColor: '#4C8BF5',
    },
    btnTxt: {
        fontSize: 18,
        fontFamily: 'robotoBold',
        color: '#FFFFFF',
    },
    switch: {
        fontSize: 14,
        textAlign: 'center',
        color: '#000000',
    },
    link: {
        fontFamily: 'robotoBold',
        color: '#4C8BF5',
    },
});
