import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../contexts/AuthContext';

const { width, height } = Dimensions.get('window');

const LoginScreen = () => {
  const { signInWithGoogle } = useAuth();

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <View style={styles.logoContainer}>
          <Text style={styles.googleLogo}>G</Text>
        </View>
      </View>

      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={[styles.button, styles.signUpButton]}
          onPress={signInWithGoogle}
          activeOpacity={0.8}
        >
          <Text style={[styles.buttonText, styles.signUpText]}>Sign up</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.button, styles.logInButton]}
          onPress={signInWithGoogle}
          activeOpacity={0.8}
        >
          <Text style={[styles.buttonText, styles.logInText]}>Log in</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: height * 0.1,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  googleLogo: {
    fontSize: 120,
    fontWeight: 'bold',
    color: '#fff',
    fontFamily: 'System',
  },
  buttonContainer: {
    width: width * 0.8,
    paddingBottom: 50,
  },
  button: {
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 10,
  },
  signUpButton: {
    backgroundColor: '#fff',
  },
  logInButton: {
    backgroundColor: 'transparent',
    borderWidth: 2,
    borderColor: '#fff',
  },
  buttonText: {
    fontSize: 18,
    fontWeight: '600',
  },
  signUpText: {
    color: '#000',
  },
  logInText: {
    color: '#fff',
  },
});

export default LoginScreen; 