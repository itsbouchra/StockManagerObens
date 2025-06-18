import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ImageBackground,
  Alert,
} from 'react-native';
import { ArrowLeft, PencilLine, User } from 'lucide-react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function AccountInformationScreen({ navigation, route }) {
  const utilisateurParDefaut = {
    id_user: null,
    username: '',
    email: '',
    telephone: '',
    role: '',
  };

  const donneesInitiales = { ...utilisateurParDefaut, ...(route.params?.userData || {}) };
  const [formulaire, setFormulaire] = useState(donneesInitiales);
  const [formulaireOriginal, setFormulaireOriginal] = useState(donneesInitiales);

  useEffect(() => {
    setFormulaireOriginal(donneesInitiales);
  }, []);

  const champs = [
    { label: "Nom d'utilisateur", key: 'username' },
    { label: 'Gmail', key: 'email' },
    { label: 'Téléphone', key: 'telephone' },
    { label: 'Rôle', key: 'role' },
  ];

  const gererChangement = (cle, valeur) => {
    setFormulaire({ ...formulaire, [cle]: valeur });
  };

  const gererValidation = async () => {
    if (!formulaire.id_user) {
      Alert.alert('Erreur', 'ID utilisateur manquant.');
      return;
    }

    try {
      const response = await fetch(`http://10.0.2.2:8080/api/users/${formulaire.id_user}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formulaire),
      });

      if (response.ok) {
        Alert.alert('Succès', 'Informations mises à jour.');
        await AsyncStorage.setItem('userData', JSON.stringify(formulaire));
        navigation.navigate('Profile', { updatedData: formulaire });
      } else {
        Alert.alert('Erreur', 'Échec de la mise à jour.');
      }
    } catch (err) {
      console.error('Erreur réseau :', err);
      Alert.alert('Erreur', 'Problème de connexion au serveur.');
    }
  };

  const gererAnnulation = () => {
    setFormulaire(formulaireOriginal);
  };

  return (
    <ImageBackground source={require('../assets/bg.jpg')} style={styles.background}>
      <View style={styles.container}>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <ArrowLeft size={24} color="#333" />
        </TouchableOpacity>

        <View style={styles.titleWrapper}>
          <User size={18} color="#1e1e1e" />
          <Text style={styles.title}>Informations du compte</Text>
        </View>

        {champs.map(({ label, key }) => (
          <View key={key} style={styles.inputRow}>
            <Text style={styles.label}>{label} :</Text>
            <View style={styles.inputWrapper}>
              <TextInput
                value={formulaire[key]}
                onChangeText={(val) => gererChangement(key, val)}
                style={styles.input}
                placeholder={label}
                placeholderTextColor="#999"
              />
              <PencilLine size={16} color="#555" />
            </View>
          </View>
        ))}

        <View style={styles.buttonRow}>
          <TouchableOpacity style={styles.cancelButton} onPress={gererAnnulation}>
            <Text style={styles.cancelText}>Annuler</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.submitButton} onPress={gererValidation}>
            <Text style={styles.submitText}>Valider</Text>
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
    backgroundColor: '#FFF4B1',
    padding: 12,
    marginRight: 10,
    borderRadius: 10,
    alignItems: 'center',
  },
  submitButton: {
    flex: 1,
    backgroundColor: '#FFF4B1',
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