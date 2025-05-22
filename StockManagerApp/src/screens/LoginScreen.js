import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  Alert,
  StyleSheet,
   Dimensions,
} from 'react-native';
import CheckBox from '@react-native-community/checkbox';
import { User, Lock, Eye, EyeOff} from 'lucide-react-native'; // ✅ Using Lucide icons
import { useNavigation } from '@react-navigation/native';
import loginBg from '../assets/login-bk.png'; // Local image



export default function LoginScreen() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [remember, setRemember] = useState(false);
    const [secure, setSecure] = useState(true);
  const navigation = useNavigation();

  const handleLogin = async () => {
     try {
      const response = await fetch('http://10.0.2.2:8080/api/users');
      const users = await response.json();

      const foundUser = users.find(
        (user) => user.username === username && user.password === password
      );

      if (foundUser) {
          Alert.alert('Success', `Welcome ${foundUser.username}!`);
        navigation.navigate('Dashboard');
      } else {
        Alert.alert('Error', 'Invalid credentials');
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to connect to server');
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
    <EyeOff size={20} color="#3d3d3d" /> // 👁‍🗨 Masqué
  ) : (
    <Eye size={20} color="#3d3d3d" />    // 👁 Visible
  )}
</TouchableOpacity>

        </View>
        <View style={styles.checkboxContainer}>
          <CheckBox value={remember} onValueChange={setRemember} />
          <Text style={styles.checkboxLabel}>Remember me</Text>
        </View>

        <TouchableOpacity style={styles.loginButton} onPress={handleLogin}>
          <Text style={styles.loginText}>Login</Text>
        </TouchableOpacity>

        <Text style={styles.signupText}>
          Don’t have account?{' '}
          <Text style={styles.signupLink}>Sign up</Text>
        </Text>
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
    height: 260, // ✅ fixe une hauteur suffisante pour voir l’image
    position: 'relative',
    overflow: 'hidden',
  },
    backgroundImage: {
    position: 'absolute', // ✅ pour être derrière les éléments
    top: 0,
    left: 0,
    width: '100%',
    height: 600, // même hauteur que le wrapper
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
  marginTop: 20, // ✅ remonte dans l'image, ajuste selon visuel
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
  signupText: {
    textAlign: 'center',
    color: '#6b6b6b',
    marginTop: 20,
  },
  signupLink: {
    color: '#6b8e23',
    fontWeight: '600',
    textDecorationLine: 'underline',
  },
});