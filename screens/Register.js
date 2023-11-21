import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';

const Register = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [agreeTerms, setAgreeTerms] = useState(false);

    const handleRegister = () => {
        console.log('Registratie test');
    };

    const handleLoginRedirect = () => {
        console.log('Terug naar login test');
    };

    const handleTermsClick = () => {
        console.log('Servicevoorwaarden test');
    };

    const handlePrivacyClick = () => {
        console.log('Privacyvoorwaarden test');
    };

    return (
        <View style={styles.container}>
            <View style={styles.registerContainer}>
                <Text style={styles.header}>Registreren</Text>
                <Text style={styles.textInputHeaders}>E-mail</Text>
                <TextInput
                    placeholder="Jouw e-mailadres"
                    style={styles.input}
                    value={email}
                    onChangeText={setEmail}
                />
                <Text style={styles.textInputHeaders}>Wachtwoord</Text>
                <TextInput
                    placeholder="Jouw wachtwoord"
                    secureTextEntry
                    style={styles.passwordInput}
                    value={password}
                    onChangeText={setPassword}
                />
                <View style={styles.checkboxContainer}>
                    <TouchableOpacity
                        onPress={() => setAgreeTerms(!agreeTerms)}
                        style={[
                            styles.checkbox,
                            { borderColor: agreeTerms ? '#0096FF' : 'gray' },
                        ]}
                    >
                        {agreeTerms && (
                            <Text style={{ color: '#0096FF', fontSize: 18, fontWeight: 'bold' }}>
                                ✓
                            </Text>
                        )}
                    </TouchableOpacity>
                    <Text style={styles.checkboxText}>
                        Ik ga akkoord met de {' '}
                        <Text style={styles.checkClickableText} onPress={handleTermsClick}>
                            Servicevoorwaarden</Text>
                        {' '} en het {' '}
                        <Text style={styles.checkClickableText} onPress={handlePrivacyClick}>
                            Privacybeleid</Text>
                    </Text>
                </View>
                <TouchableOpacity
                    onPress={handleRegister}
                    style={styles.registerButton}
                    disabled={!agreeTerms}
                >
                    <Text style={styles.buttonTextWhite}>Doorgaan</Text>
                </TouchableOpacity>
                <View style={styles.loginRedirectContainer}>
                    <Text style={styles.redirectText}>
                        <Text style={styles.readyText}>Heb je al een account? {' '}</Text>
                        <Text style={styles.loginText} onPress={handleLoginRedirect}>
                            Login
                        </Text>
                    </Text>
                </View>

            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        justifyContent: 'center',
        backgroundColor: '#fff',
    },
    registerContainer: {
        padding: 40,
    },
    header: {
        fontSize: 24,
        fontWeight: 'bold',
        marginTop: 10,
        marginBottom: 20,
    },
    textInputHeaders: {
        fontSize: 16,
        fontWeight: 'bold',
        marginTop: 26,
        color: '#0096FF',
    },
    input: {
        borderBottomWidth: 1,
        marginTop: 10,
        borderColor: 'gray',
        width: '100%',
    },
    passwordInput: {
        borderBottomWidth: 1,
        borderColor: 'gray',
        marginTop: 10,
        width: '100%',
    },
    checkboxContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 20,
    },
    checkbox: {
        width: 20,
        height: 20,
        borderWidth: 1,
        marginRight: 10,
        alignItems: 'center',
        justifyContent: 'center',
    },
    checkboxText: {
        fontSize: 14,
        color: 'gray',
        fontWeight: 'bold',
    },
    checkClickableText: {
        color: '#0096FF',
        fontWeight: 'bold',
    },
    registerButton: {
        backgroundColor: '#0096FF',
        padding: 10,
        borderRadius: 6,
        marginTop: 40,
        width: '80%',
        alignItems: 'center',
        alignSelf: 'center',
    },
    buttonTextWhite: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
    },
    loginRedirectContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        marginTop: 20,
    },
    redirectText: {
        color: 'gray',
    },
    readyText: {
        fontWeight: 'bold',
        fontSize: 14,
    },
    loginText: {
        fontWeight: 'bold',
        fontSize: 18,
        color: '#0096FF',
    },
});

export default Register;
