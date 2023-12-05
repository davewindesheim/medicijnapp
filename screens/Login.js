import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    const handleLogin = () => {
        console.log('Login testing');
    };

    return (
        <View style={styles.container}>
            <View style={styles.logoContainer}>
                <FontAwesome name="lock" size={50} color="#0096FF" />
                <Text style={styles.header}>MedicijnApp</Text>
            </View>
            <View style={styles.loginContainer}>
                <Text style={styles.header}>Inloggen</Text>
                <Text style={styles.textInputHeaders}>E-mail</Text>
                <TextInput
                    placeholder="Jouw e-mailadres"
                    style={styles.input}
                    value={email}
                    onChangeText={setEmail}
                />
                <Text style={styles.textInputHeaders}>Wachtwoord</Text>
                <View style={styles.passwordContainer}>
                    <TextInput
                        placeholder="Jouw wachtwoord"
                        secureTextEntry={!showPassword}
                        style={styles.passwordInput}
                        value={password}
                        onChangeText={setPassword}
                    />
                    <TouchableOpacity onPress={togglePasswordVisibility} style={styles.eyeIcon}>
                        <FontAwesome name={showPassword ? 'eye-slash' : 'eye'} size={20} color="#0096FF" />
                    </TouchableOpacity>
                </View>
                <TouchableOpacity
                    onPress={handleLogin}
                    style={styles.loginButton}
                >
                    <Text style={styles.buttonText}>Inloggen</Text>
                </TouchableOpacity>
                <View style={styles.socialLoginContainer}>
                    <Text style={styles.loginText}>Of login met</Text>
                </View>
                <View style={styles.socialButtonsContainer}>
                    <TouchableOpacity style={styles.socialButtonApple}>
                        <FontAwesome name="apple" size={20} color="#fff" />
                        <Text style={styles.socialButtonTextApple}>Apple</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.socialButtonGoogle}>
                        <FontAwesome name="google" size={20} color="#fff" />
                        <Text style={styles.socialButtonTextGoogle}>Google</Text>
                    </TouchableOpacity>
                </View>
                <View style={styles.extraContainer}>
                    <TouchableOpacity>
                        <Text style={styles.lostPassword}>Wachtwoord vergeten?</Text>
                    </TouchableOpacity>
                    <TouchableOpacity>
                        <Text style={styles.register}>Registreren</Text>
                    </TouchableOpacity>
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
    logoContainer: {
        alignItems: 'center',
        color: 'grey',
    },
    loginContainer: {
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
        color: '#0096FF'
    },
    input: {
        borderBottomWidth: 1,
        marginTop: 10,
        borderColor: 'gray',
        width: '100%',
    },
    passwordContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        position: 'relative',
    },
    passwordInput: {
        borderBottomWidth: 1,
        borderColor: 'gray',
        marginTop: 10,
        width: '100%',
    },
    eyeIcon: {
        position: 'absolute',
        right: 0,
        marginRight: 6,
    },
    loginButton: {
        backgroundColor: '#0096FF',
        padding: 10,
        borderRadius: 6,
        marginTop: 40,
        width: '80%',
        alignItems: 'center',
        alignSelf: 'center',
        shadowColor: '#000',
        shadowOpacity: 0.5,
        shadowRadius: 4,
        elevation: 5, // An android only feature? *compare with iphone later
    },
    buttonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
    },
    socialLoginContainer: {
        alignItems: 'center',
        marginTop: 20,
    },
    loginText: {
        fontSize: 14,
        color: 'gray',
    },
    socialButtonsContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        marginTop: 20,
    },
    socialButtonApple: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#0d0d0d',
        padding: 12,
        borderRadius: 6,
        marginHorizontal: 10,
    },
    socialButtonTextApple: {
        marginLeft: 6,
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
    },
    socialButtonGoogle: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#0096FF',
        padding: 12,
        borderRadius: 6,
        marginHorizontal: 10,
    },
    socialButtonTextGoogle: {
        marginLeft: 6,
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
    },
    extraContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        marginTop: 30,
    },
    lostPassword: {
        color: 'gray',
        fontSize: 14,
        marginRight: 24,
    },
    register: {
        color: '#0096FF',
        fontSize: 14,
    },

});

export default Login;
