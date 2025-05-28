import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ImageBackground,
  Alert,
} from 'react-native';
import { ArrowLeft, Eye, Lock } from 'lucide-react-native';

export default function PasswordScreen({ navigation }) {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState({
    current: false,
    new: false,
    confirm: false,
  });

  const togglePassword = (field) => {
    setShowPassword((prev) => ({ ...prev, [field]: !prev[field] }));
  };

  const handleSubmit = async () => {
    if (!currentPassword || !newPassword || !confirmPassword) {
      Alert.alert('Erreur', 'Tous les champs sont obligatoires.');
      return;
    }

    if (newPassword !== confirmPassword) {
      Alert.alert('Erreur', 'Les mots de passe ne correspondent pas.');
      return;
    }

    try {
      const response = await fetch('http://10.0.2.2:8080/api/users/1/password', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          currentPassword,
          newPassword,
        }),
      });

      const result = await response.json();

      if (response.ok) {
        Alert.alert('Succès', result.message || 'Mot de passe mis à jour.');
        navigation.goBack();
      } else {
        Alert.alert('Erreur', result.message || 'Échec de la mise à jour.');
      }
    } catch (error) {
      console.error(error);
      Alert.alert('Erreur de connexion', 'Impossible de se connecter au serveur.');
    }
  };

  const handleCancel = () => {
    setCurrentPassword('');
    setNewPassword('');
    setConfirmPassword('');
    Alert.alert('Annulé', 'Les champs ont été réinitialisés.');
  };

  return (
    <ImageBackground source={require('../assets/bg.jpg')} style={styles.background}>
      <View style={styles.container}>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <ArrowLeft size={24} color="#333" />
        </TouchableOpacity>

        <View style={styles.titleWrapper}>
          <Lock size={18} color="#1e1e1e" />
          <Text style={styles.title}>Password</Text>
        </View>

        <InputField
          label="Current Password"
          value={currentPassword}
          onChange={setCurrentPassword}
          secure={!showPassword.current}
          toggle={() => togglePassword('current')}
        />
        <InputField
          label="New Password"
          value={newPassword}
          onChange={setNewPassword}
          placeholder="Type your new password"
          secure={!showPassword.new}
          toggle={() => togglePassword('new')}
        />
        <InputField
          label="Confirm New Password"
          value={confirmPassword}
          onChange={setConfirmPassword}
          placeholder="Confirm your new password"
          secure={!showPassword.confirm}
          toggle={() => togglePassword('confirm')}
        />

        <View style={styles.buttonRow}>
          <TouchableOpacity style={styles.cancelButton} onPress={handleCancel}>
            <Text style={styles.cancelText}>Cancel</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
            <Text style={styles.submitText}>Submit</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ImageBackground>
  );
}

const InputField = ({ label, value, onChange, placeholder, secure, toggle }) => (
  <View style={styles.inputRow}>
    <Text style={styles.label}>{label}</Text>
    <View style={styles.inputWrapper}>
      <TextInput
        style={styles.input}
        value={value}
        onChangeText={onChange}
        placeholder={placeholder}
        placeholderTextColor="#888"
        secureTextEntry={secure}
      />
      <TouchableOpacity onPress={toggle}>
        <Eye size={18} color="#444" />
      </TouchableOpacity>
    </View>
  </View>
);

const styles = StyleSheet.create({
  background: {
    flex: 1,
    resizeMode: 'cover',
    justifyContent: 'center',
  },
  container: {
    backgroundColor: '#fff',
    margin: 20,
    borderRadius: 20,
    padding: 20,
    elevation: 4,
  },
  backButton: {
    marginBottom: 12,
  },
  titleWrapper: {
    flexDirection: 'row',
    alignSelf: 'center',
    backgroundColor: '#d9e3d2',
    paddingVertical: 8,
    paddingHorizontal: 20,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 20,
    borderWidth: 2,
    borderColor: '#4e5e30',
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginLeft: 8,
    color: '#1e1e1e',
  },
  inputRow: {
    marginBottom: 20,
  },
  label: {
    marginBottom: 6,
    fontWeight: '600',
    color: '#222',
  },
  inputWrapper: {
    flexDirection: 'row',
    backgroundColor: '#ddd',
    borderRadius: 8,
    alignItems: 'center',
    paddingHorizontal: 12,
    justifyContent: 'space-between',
  },
  input: {
    flex: 1,
    color: '#000',
    paddingVertical: 10,
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 30,
  },
  cancelButton: {
    flex: 1,
    backgroundColor: '#d9e3d2',
    padding: 12,
    marginRight: 10,
    borderRadius: 10,
    alignItems: 'center',
  },
  submitButton: {
    flex: 1,
    backgroundColor: '#d9e3d2',
    padding: 12,
    marginLeft: 10,
    borderRadius: 10,
    alignItems: 'center',
  },
  cancelText: {
    color: '#1e1e1e',
    fontWeight: '600',
  },
  submitText: {
    color: '#1e1e1e',
    fontWeight: '600',
  },
});
