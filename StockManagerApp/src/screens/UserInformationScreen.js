import React, { useState } from 'react';
import {
  View, Text, TextInput, TouchableOpacity,
  Image, StyleSheet, Alert, PermissionsAndroid, Platform,
} from 'react-native';
import { ArrowLeft, Settings, Eye, Bell, Camera } from 'lucide-react-native';
import DropDownPicker from 'react-native-dropdown-picker';
import { launchImageLibrary } from 'react-native-image-picker';
import BottomNavBar from '../components/BottomNavBar';

export default function UserInformationScreen({ route, navigation }) {
  const { user } = route.params;
  const [form, setForm] = useState(user);
  const [showPassword, setShowPassword] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [imageUri, setImageUri] = useState(null);

  const handleChange = (key, value) => {
    setForm({ ...form, [key]: value });
  };

  const requestPermission = async () => {
    if (Platform.OS === 'android') {
      try {
        if (Platform.Version >= 33) {
          const granted = await PermissionsAndroid.request(
            PermissionsAndroid.PERMISSIONS.READ_MEDIA_IMAGES,
            {
              title: 'Permission requise',
              message: 'L’application a besoin d’accéder à vos images.',
              buttonPositive: 'OK',
              buttonNegative: 'Annuler',
            }
          );
          return granted === PermissionsAndroid.RESULTS.GRANTED;
        } else {
          const granted = await PermissionsAndroid.request(
            PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
            {
              title: 'Permission requise',
              message: 'L’application a besoin d’accéder à votre galerie.',
              buttonPositive: 'OK',
              buttonNegative: 'Annuler',
            }
          );
          return granted === PermissionsAndroid.RESULTS.GRANTED;
        }
      } catch (err) {
        console.warn('Erreur permission:', err);
        return false;
      }
    }
    return true;
  };

  const pickImage = async () => {
    const permission = await requestPermission();
    if (!permission) {
      Alert.alert('Permission refusée', 'Impossible d’accéder à la galerie.');
      return;
    }

    launchImageLibrary({ mediaType: 'photo' }, (response) => {
      if (response.didCancel) return;
      if (response.errorCode) {
        Alert.alert('Erreur', response.errorMessage);
      } else {
        setImageUri(response.assets[0].uri);
        // Tu peux aussi stocker l'URI dans le form si tu veux l'envoyer plus tard
      }
    });
  };

  const handleUpdate = async () => {
    if (!form.username || !form.email || !form.password || !form.telephone || !form.role) {
      Alert.alert('Erreur', 'Tous les champs sont obligatoires.');
      return;
    }

    try {
      const res = await fetch(`http://10.0.2.2:8080/api/users/${form.id_user}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });

      const data = await res.text();

      if (res.ok) {
        Alert.alert('Succès', 'Utilisateur mis à jour');
        navigation.goBack();
      } else {
        Alert.alert('Erreur', data || 'Échec de la mise à jour');
      }
    } catch (err) {
      Alert.alert('Erreur réseau', err.message);
    }
  };

  const handleDelete = async () => {
    try {
      const res = await fetch(`http://10.0.2.2:8080/api/users/${form.id_user}`, {
        method: 'DELETE',
      });
      if (res.ok) {
        Alert.alert('Utilisateur supprimé');
        navigation.goBack();
      } else {
        Alert.alert('Erreur', 'Suppression échouée');
      }
    } catch (err) {
      Alert.alert('Erreur réseau', err.message);
    }
  };

  return (
    <View style={styles.container}>
      {/* En-tête */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.iconButton}>
            <ArrowLeft size={22} color="#fff" />
          </TouchableOpacity>
          <Settings size={25} color="#f5c518" />
          <Text style={styles.headerTitle}>Paramètres</Text>
        </View>
        <TouchableOpacity>
          <Bell size={20} color="#fff" />
        </TouchableOpacity>
      </View>

      <Text style={styles.title}>Informations de l'utilisateur</Text>

      {/* Avatar + Icône Caméra */}
      <View style={styles.avatarContainer}>
        <TouchableOpacity onPress={pickImage}>
          <View>
            <Image
              source={imageUri ? { uri: imageUri } : require('../assets/sophie.jpg')}
              style={styles.avatar}
            />
            <View style={styles.cameraIconWrapper}>
              <Camera size={16} color="#fff" />
            </View>
          </View>
        </TouchableOpacity>
      </View>

      <View style={styles.form}>
        <Text>Nom d'utilisateur :</Text>
        <TextInput style={styles.input} value={form.username} onChangeText={(t) => handleChange('username', t)} />

        <Text>Email :</Text>
        <TextInput style={styles.input} value={form.email} onChangeText={(t) => handleChange('email', t)} />

        <Text>Mot de passe :</Text>
        <View style={styles.passwordWrapper}>
          <TextInput
            style={styles.passwordInput}
            secureTextEntry={!showPassword}
            value={form.password}
            onChangeText={(t) => handleChange('password', t)}
          />
          <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
            <Eye size={20} color="#444" />
          </TouchableOpacity>
        </View>

        <Text>Téléphone :</Text>
        <TextInput style={styles.input} value={form.telephone} onChangeText={(t) => handleChange('telephone', t)} />

        <Text>Rôle :</Text>
        <DropDownPicker
          open={dropdownOpen}
          value={form.role}
          items={[
            { label: 'Admin', value: 'admin' },
            { label: 'Fournisseur', value: 'fournisseur' },
            { label: 'Client', value: 'client' },
          ]}
          setOpen={setDropdownOpen}
          setValue={(callback) => {
            const newRole = callback(form.role);
            handleChange('role', newRole);
          }}
          style={styles.dropdown}
        />
      </View>

      {/* Boutons bas */}
      <View style={styles.bottomActions}>
        <View style={styles.actions}>
          <TouchableOpacity style={styles.btnEdit} onPress={handleUpdate}>
            <Text style={styles.btnText}>Modifier</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.btnDelete} onPress={handleDelete}>
            <Text style={styles.btnText}>Supprimer</Text>
          </TouchableOpacity>
        </View>
        <BottomNavBar navigation={navigation} currentRoute="Users" />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  header: {
    flexDirection: 'row',
    backgroundColor: '#7a8b2d',
    paddingVertical: 14,
    paddingHorizontal: 20,
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  headerLeft: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  headerTitle: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 20,
    fontFamily: 'serif',
  },
  iconButton: { marginRight: 8 },
  title: {
    textAlign: 'center',
    fontSize: 22,
    fontWeight: 'bold',
    marginTop: 20,
    fontFamily: 'serif',
    color: '#000',
  },
  avatarContainer: { alignItems: 'center', marginVertical: 20 },
  avatar: { width: 100, height: 100, borderRadius: 50 },
  cameraIcon: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 4,
  },
  form: { paddingHorizontal: 20, gap: 10, paddingBottom: 140 },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    backgroundColor: '#e5edd6',
    padding: 10,
    borderRadius: 10,
  },
  passwordWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ccc',
    backgroundColor: '#e5edd6',
    borderRadius: 10,
    paddingHorizontal: 10,
  },
  passwordInput: { flex: 1, paddingVertical: 10 },
  dropdown: { marginTop: 10, borderRadius: 10 },
  bottomActions: {
    position: 'absolute',
    bottom: 0,
    width: '100%',
    backgroundColor: '#fff',
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 10,
    paddingHorizontal: 16,
  },
  btnEdit: {
    flex: 1,
    backgroundColor: '#FFF4B1',
    paddingVertical: 12,
    marginRight: 10,
    borderRadius: 20,
    alignItems: 'center',
  },
  btnDelete: {
    flex: 1,
    backgroundColor: '#FFF4B1',
    paddingVertical: 12,
    marginLeft: 10,
    borderRadius: 20,
    alignItems: 'center',
  },
  btnText: { fontWeight: 'bold' },
  cameraIconWrapper: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: '#7a8b2d', // Vert olive comme demandé
    borderRadius: 999,
    padding: 6,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 3,
  },
});
