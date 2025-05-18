import { StyleSheet } from 'react-native';

export const loginStyles = StyleSheet.create({
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
        marginBottom: 20,
    },
    title: {
        fontSize: 28,
        fontFamily: 'robotoBold',
        marginBottom: 8,
        textAlign: 'center',
        color: '#000000',
    },
    subtitle: {
        fontSize: 16,
        fontFamily: 'robotoMedium',
        marginBottom: 20,
        textAlign: 'center',
        color: '#000000',
    },
    input: {
        padding: 12,
        borderRadius: 10,
        borderWidth: 1,
        borderColor: '#CCCCCC',
        fontSize: 16,
        fontFamily: 'roboto',
        marginBottom: 14,
        color: '#000000',
        backgroundColor: '#F5F5F5',
    },
    btn: {
        padding: 14,
        borderRadius: 10,
        alignItems: 'center',
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
