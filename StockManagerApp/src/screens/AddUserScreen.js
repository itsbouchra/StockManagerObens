import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  Image,
   ScrollView,
  Alert,
} from 'react-native';
import DropDownPicker from 'react-native-dropdown-picker';
import { ArrowLeft, Settings, Bell, Eye, UploadCloud } from 'lucide-react-native';
import BottomNavBar from '../components/BottomNavBar';
import { launchImageLibrary } from 'react-native-image-picker';




export default function AddUserScreen({ navigation }) {
  const [form, setForm] = useState({
    username: '',
    email: '',
    password: '',
    phone: '',
  });

  const [role, setRole] = useState('admin');
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [image, setImage] = useState(null);
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (key, value) => {
    setForm({ ...form, [key]: value });
  };

  const handleImagePick = () => {
    const options = {
      mediaType: 'photo',
      quality: 1,
    };

    launchImageLibrary(options, (response) => {
      if (response.didCancel) {
        console.log('Sélection d\'image annulée');
      } else if (response.errorCode) {
        Alert.alert('Erreur', response.errorMessage);
      } else if (response.assets && response.assets.length > 0) {
        setImage(response.assets[0].uri);
      }
    });
  };

  const handleCancel = () => {
    setForm({
      username: '',
      email: '',
      password: '',
      phone: '',
    });
    setRole('admin');
    setImage(null);
    setShowPassword(false);
    navigation.navigate('UsersScreen');
  };

  const handleSave = async () => {
    const user = {
      username: form.username,
      email: form.email,
      password: form.password,
      telephone: form.phone,
      role,
    };

    try {
      const res = await fetch('http://10.0.2.2:8080/api/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(user),
      });

      if (res.ok) {
        Alert.alert('Succès', 'Utilisateur ajouté');
        navigation.navigate('UsersScreen');
      } else {
        const error = await res.text();
        Alert.alert('Erreur', error || 'Erreur d’enregistrement');
      }
    } catch (err) {
      Alert.alert('Erreur réseau', err.message);
    }
  };

  return (
  <SafeAreaView style={styles.container}>
    <View style={{ flex: 1 }}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <ArrowLeft size={22} color="#fff" />
          </TouchableOpacity>
          <Settings size={24} color="#f5c518" />
          <Text style={styles.headerTitle}>Paramètres</Text>
        </View>
        <TouchableOpacity>
          <Bell size={20} color="#fff" />
        </TouchableOpacity>
      </View>

      {/* Scrollable content */}
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.title}>Ajouter un utilisateur</Text>

        <View style={styles.form}>
          <Text style={styles.label}>Nom d'utilisateur :</Text>
          <TextInput
            style={styles.input}
            placeholder="Entrez le nom d'utilisateur"
            value={form.username}
            onChangeText={(text) => handleChange('username', text)}
          />

          <Text style={styles.label}>Email :</Text>
          <TextInput
            style={styles.input}
            placeholder="Entrez l'email"
            value={form.email}
            onChangeText={(text) => handleChange('email', text)}
          />

          <Text style={styles.label}>Mot de passe :</Text>
          <View style={styles.passwordWrapper}>
            <TextInput
              style={styles.passwordInput}
              placeholder="Entrez le mot de passe"
              secureTextEntry={!showPassword}
              value={form.password}
              onChangeText={(text) => handleChange('password', text)}
            />
            <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
              <Eye size={20} color="#444" />
            </TouchableOpacity>
          </View>

          <Text style={styles.label}>Téléphone :</Text>
          <TextInput
            style={styles.input}
            placeholder="Entrez le numéro"
            keyboardType="phone-pad"
            value={form.phone}
            onChangeText={(text) => handleChange('phone', text)}
          />

          <Text style={styles.label}>Rôle :</Text>
          <View style={{ zIndex: 1000 }}>
            <DropDownPicker
              open={dropdownOpen}
              value={role}
              items={[
                { label: 'Admin', value: 'admin' },
                { label: 'Fournisseur', value: 'supplier' },
                { label: 'Client', value: 'customer' },
              ]}
              setOpen={setDropdownOpen}
              setValue={setRole}
              style={styles.dropdown}
              textStyle={styles.dropdownText}
              dropDownContainerStyle={styles.dropdownContainer}
            />
          </View>

          <View style={styles.uploadContainer}>
            <Text style={styles.label}>Télécharger une image :</Text>
            <TouchableOpacity style={styles.uploadBtn} onPress={handleImagePick}>
              {image ? (
                <Image source={{ uri: image }} style={{ width: 90, height: 90, borderRadius: 10 }} />
              ) : (
                <UploadCloud size={26} color="#4a4a4a" />
              )}
            </TouchableOpacity>
          </View>

          <View style={styles.buttonRow}>
            <TouchableOpacity style={styles.cancelBtn} onPress={handleCancel}>
              <Text style={styles.btnText}>Annuler</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.saveBtn} onPress={handleSave}>
              <Text style={styles.btnText}>Enregistrer</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </View>

    {/* Fixed Bottom NavBar */}
    <View style={styles.bottomBarContainer}>
      <BottomNavBar navigation={navigation} currentRoute="AddUser" />
    </View>
  </SafeAreaView>
);

  
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  scrollContent: {
  paddingBottom: 220, // Laisse assez de place pour les boutons + navbar
},

  header: {
    flexDirection: 'row',
    backgroundColor: '#7a8b2d',
    padding: 14,
    paddingHorizontal: 16,
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  headerLeft: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  headerTitle: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 20,
    fontFamily: 'serif',
    marginLeft: 6,
  },
  title: {
    textAlign: 'center',
    fontSize: 24,
    fontWeight: 'bold',
    marginVertical: 20,
    fontFamily: 'serif',
    color: '#222',
  },
  form: { paddingHorizontal: 20, gap: 10, zIndex: 0 },
  label: { fontWeight: '600', fontSize: 14, fontFamily: 'serif', color: '#222' },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    backgroundColor: '#f1f9ed',
    padding: 10,
    borderRadius: 10,
    fontSize: 14,
  },
  passwordWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ccc',
    backgroundColor: '#f1f9ed',
    borderRadius: 10,
    paddingHorizontal: 10,
  },
  passwordInput: { flex: 1, fontSize: 14, paddingVertical: 10 },
  dropdown: {
    borderColor: '#ccc',
    backgroundColor: '#f1f9ed',
    borderRadius: 10,
  },
  dropdownText: {
    fontSize: 16,
    color: '#222',
    fontWeight: '500',
  },
  dropdownContainer: {
    backgroundColor: '#fff',
    borderColor: '#ccc',
    borderRadius: 10,
    marginTop: 2,
    zIndex: 1000,
  },
  uploadContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
    gap: 20,
  },
  uploadBtn: {
    backgroundColor: '#d9ead3',
    width: 90,
    height: 90,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
    marginBottom: 100,
  },
  cancelBtn: {
    flex: 1,
    backgroundColor: '#FFF4B1',
    padding: 12,
    borderRadius: 10,
    marginRight: 10,
    alignItems: 'center',
  },
  saveBtn: {
    flex: 1,
    backgroundColor: '#FFF4B1',
    padding: 12,
    borderRadius: 10,
    marginLeft: 20,
    alignItems: 'center',
  },
  btnText: { fontWeight: '600', color: '#333' },
  bottomBarContainer: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: '#fff',
    zIndex: 10,
    elevation: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
});
