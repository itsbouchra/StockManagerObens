import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  StyleSheet,
  Dimensions,
} from 'react-native';
import CheckBox from '@react-native-community/checkbox';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { User, Lock, Eye, EyeOff } from 'lucide-react-native';
import { useNavigation } from '@react-navigation/native';
import loginBg from '../assets/login-bk.png';
import Toast from 'react-native-toast-message';

export default function LoginScreen() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [remember, setRemember] = useState(false);
  const [secure, setSecure] = useState(true);
  const navigation = useNavigation();

  useEffect(() => {
    const loadCredentials = async () => {
      const savedUsername = await AsyncStorage.getItem('rememberedUsername');
      const savedPassword = await AsyncStorage.getItem('rememberedPassword');
      const rememberFlag = await AsyncStorage.getItem('rememberMe');

      if (rememberFlag === 'true') {
        setUsername(savedUsername || '');
        setPassword(savedPassword || '');
        setRemember(true);
      }
    };

    loadCredentials();
  }, []);

  const handleLogin = async () => {
    try {
      const response = await fetch('http://10.0.2.2:8080/api/users/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });

      if (response.ok) {
        const user = await response.json();
        console.log('Login response:', user); // Debug log

        Toast.show({
          type: 'success',
          text1: 'Connexion réussie',
          text2: `Bienvenue ${user.username} !`,
          position: 'top',
        });

        if (remember) {
          await AsyncStorage.setItem('rememberedUsername', username);
          await AsyncStorage.setItem('rememberedPassword', password);
          await AsyncStorage.setItem('rememberMe', 'true');
        } else {
          await AsyncStorage.removeItem('rememberedUsername');
          await AsyncStorage.removeItem('rememberedPassword');
          await AsyncStorage.setItem('rememberMe', 'false');
        }

        // Store user data in AsyncStorage
        await AsyncStorage.setItem('userData', JSON.stringify(user));

        // Debug logs for role check
        console.log('User role:', user.role);
        console.log('Is supplier?', user.role === 'fournisseur');

        // Redirect based on user role
        setTimeout(() => {
          if (user.role === 'fournisseur') {
            console.log('Navigating to SupplierDashboard');
            navigation.reset({
              index: 0,
              routes: [{ name: 'SupplierDashboard' }],
            });
          } else {
            console.log('Navigating to Dashboard');
            navigation.reset({
              index: 0,
              routes: [{ name: 'Dashboard' }],
            });
          }
        }, 1000);
      } else {
        Toast.show({
          type: 'error',
          text1: 'Erreur de connexion',
          text2: 'Identifiants incorrects',
          position: 'top',
        });
        setPassword('');
      }
    } catch (error) {
      console.error('Login error:', error); // Debug log
      Toast.show({
        type: 'error',
        text1: 'Erreur serveur',
        text2: 'Connexion impossible au serveur',
        position: 'top',
      });
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.imageWrapper}>
        <Image source={loginBg} style={styles.backgroundImage} resizeMode="cover" />
        <View style={styles.curve} />
      </View>

      <View style={styles.header}>
        <Text style={styles.title}>welcome back !</Text>
        <Text style={styles.subtitle}>login to your account</Text>
      </View>

      <View style={styles.form}>
        <View style={styles.inputContainer}>
          <User size={20} color="green" />
          <TextInput
            placeholder="Full Name"
            placeholderTextColor="gray"
            value={username}
            onChangeText={setUsername}
            style={styles.input}
          />
        </View>

        <View style={styles.inputContainer}>
          <Lock size={20} color="green" />
          <TextInput
            placeholder="Password"
            placeholderTextColor="gray"
            secureTextEntry={secure}
            value={password}
            onChangeText={setPassword}
            style={styles.input}
          />
          <TouchableOpacity onPress={() => setSecure(!secure)}>
            {secure ? (
              <EyeOff size={20} color="#3d3d3d" />
            ) : (
              <Eye size={20} color="#3d3d3d" />
            )}
          </TouchableOpacity>
        </View>

        <View style={styles.checkboxContainer}>
          <CheckBox value={remember} onValueChange={setRemember} />
          <Text style={styles.checkboxLabel}>Remember me</Text>
        </View>

        <TouchableOpacity style={styles.loginButton} onPress={handleLogin}>
          <Text style={styles.loginText}>Connexion</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const windowWidth = Dimensions.get('window').width;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  imageWrapper: {
    height: 260,
    position: 'relative',
    overflow: 'hidden',
  },
  backgroundImage: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: 600,
    zIndex: -1,
  },
  curve: {
    position: 'absolute',
    bottom: -30,
    width: windowWidth,
    height: 60,
    backgroundColor: 'transparent',
    borderTopLeftRadius: 100,
    borderTopRightRadius: 100,
  },
  header: {
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 10,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#4d4d00',
    fontFamily: 'serif',
  },
  subtitle: {
    color: '#888',
    marginTop: 4,
    fontSize: 14,
  },
  form: {
    paddingHorizontal: 24,
    marginTop: 20,
    gap: 16,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#dce5cc',
    borderRadius: 25,
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  input: {
    marginLeft: 12,
    flex: 1,
    color: '#333',
  },
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  checkboxLabel: {
    color: '#6b8e23',
    marginLeft: 8,
  },
  loginButton: {
    backgroundColor: '#6b8e23',
    borderRadius: 999,
    paddingVertical: 14,
    alignItems: 'center',
    marginTop: 10,
  },
  loginText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
});
