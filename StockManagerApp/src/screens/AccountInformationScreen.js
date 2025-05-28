import React, { useState, useEffect } from 'react';

import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ImageBackground,
} from 'react-native';
import { ArrowLeft, PencilLine, User } from 'lucide-react-native';

export default function AccountInformationScreen({ navigation, route }) {
  // 1. données initiales de route (passées depuis ProfileScreen)
  const initialData = route.params?.userData || {
    username: 'Achraf EL MOUDEN',
    email: 'achrafelmouden@gmail.com',
    phone: '06 44 55 66 77 88',
    role: 'Admin',
  };

  const [form, setForm] = useState(initialData);

   const [originalForm, setOriginalForm] = useState(initialData);
   useEffect(() => {
    setOriginalForm(initialData); // Sauvegarde initiale
  }, []);

  const handleChange = (key, value) => {
    setForm({ ...form, [key]: value });
  };
   const handleSubmit = () => {
    console.log('Données soumises :', form);
    // navigation vers le profil avec les nouvelles données
    navigation.navigate('Profile', { updatedData: form });
  };

  const handleCancel = () => {
    setForm(originalForm); // Rétablir les valeurs initiales
  };

  return (
    <ImageBackground
      source={require('../assets/bg.jpg')} // remplace ce chemin par celui de ton image
      style={styles.background}
    >
      <View style={styles.container}>
        {/* Header */}
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <ArrowLeft size={24} color="#333" />
        </TouchableOpacity>

        <View style={styles.titleWrapper}>
          <User size={18} color="#1e1e1e" />
          <Text style={styles.title}>Account Information</Text>
        </View>

        {/* Form fields */}
        {[
          { label: 'Username', key: 'username' },
          { label: 'Gmail', key: 'email' },
          { label: 'Telephone', key: 'phone' },
          { label: 'Role', key: 'role' },
        ].map(({ label, key }) => (
          <View key={key} style={styles.inputRow}>
            <Text style={styles.label}>{label} :</Text>
            <View style={styles.inputWrapper}>
              <TextInput
                value={form[key]}
                onChangeText={(val) => handleChange(key, val)}
                style={styles.input}
                placeholder={label}
                placeholderTextColor="#999"
              />
              <PencilLine size={16} color="#555" />
            </View>
          </View>
        ))}

        {/* Buttons */}
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
    elevation: 5,
  },
  backButton: {
    marginBottom: 10,
  },
  titleWrapper: {
    flexDirection: 'row',
    backgroundColor: '#d9e3d2',
    alignItems: 'center',
    alignSelf: 'center',
    borderRadius: 6,
    paddingHorizontal: 14,
    paddingVertical: 8,
    marginBottom: 20,
    borderWidth: 2,
    borderColor: '#4e5e30',
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1e1e1e',
    marginLeft: 8,
  },
  inputRow: {
    marginBottom: 15,
  },
  label: {
    fontWeight: '600',
    marginBottom: 5,
    color: '#222',
  },
  inputWrapper: {
    backgroundColor: '#ddd',
    borderRadius: 6,
    paddingHorizontal: 10,
    paddingVertical: 8,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  input: {
    flex: 1,
    color: '#000',
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
