import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
} from 'react-native';
import { ArrowLeft, Settings, Bell } from 'lucide-react-native';
import BottomNavBar from '../components/BottomNavBar';

export default function AddCategorieScreen({ navigation, route }) {
  const [name, setName] = useState(route.params?.nom || '');
  const [description, setDescription] = useState(route.params?.description || '');
  const [categorieId] = useState(route.params?.id_categorie || null);

  const handleCancel = () => {
    setName('');
    setDescription('');
    navigation.navigate('SettingsCategorieScreen');
  };

  const handleSave = async () => {
    if (!name || !description) {
      Alert.alert('Erreur', 'Veuillez remplir tous les champs.');
      return;
    }

    const newCategorie = { nom: name, description };

    try {
      const res = await fetch('http://10.0.2.2:8080/categories', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newCategorie),
      });

      if (res.ok) {
        Alert.alert('Succès', 'Catégorie ajoutée avec succès.');
        setName('');
        setDescription('');
        navigation.navigate('SettingsCategorieScreen', { refresh: true });
      } else {
        const error = await res.text();
        Alert.alert('Erreur', error || "Échec de l’ajout.");
      }
    } catch (err) {
      Alert.alert('Erreur réseau', err.message);
    }
  };

  const handleDelete = async () => {
    if (!categorieId) {
      Alert.alert('Erreur', 'Aucune catégorie sélectionnée pour suppression.');
      return;
    }

    try {
      const res = await fetch(`http://10.0.2.2:8080/categories/${categorieId}`, {
        method: 'DELETE',
      });

      if (res.ok) {
        Alert.alert('Supprimé', 'Catégorie supprimée avec succès.');
        navigation.navigate('SettingsCategorieScreen', { refresh: true });
      } else {
        const error = await res.text();
        Alert.alert('Erreur', error || "Échec de la suppression.");
      }
    } catch (err) {
      Alert.alert('Erreur réseau', err.message);
    }
  };

  return (
    <View style={styles.container}>
      {/* En-tête */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <ArrowLeft size={22} color="#fff" />
        </TouchableOpacity>
        <View style={styles.headerContent}>
          <Settings size={25} color="#f5c518" />
          <Text style={styles.headerTitle}>Paramètres</Text>
        </View>
        <Bell size={20} color="#fff" />
      </View>

      {/* Formulaire */}
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.title}>Ajouter une catégorie</Text>

        <Text style={styles.label}>Nom de la catégorie :</Text>
        <TextInput
          style={styles.input}
          placeholder="Saisissez le nom"
          placeholderTextColor="#999"
          value={name}
          onChangeText={setName}
        />

        <Text style={styles.label}>Description :</Text>
        <TextInput
          style={[styles.input, { height: 60 }]}
          placeholder="Saisissez la description"
          placeholderTextColor="#999"
          value={description}
          onChangeText={setDescription}
        />

        <View style={styles.buttonRow}>
          <TouchableOpacity style={styles.cancelBtn} onPress={handleCancel}>
            <Text style={styles.btnText}>Annuler</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.saveBtn} onPress={handleSave}>
            <Text style={styles.btnText}>Enregistrer</Text>
          </TouchableOpacity>
        </View>

        {/* Bouton Supprimer (seulement en mode édition) */}
        {categorieId && (
          <TouchableOpacity style={styles.deleteBtn} onPress={handleDelete}>
            <Text style={[styles.btnText, { color: '#fff' }]}>Supprimer</Text>
          </TouchableOpacity>
        )}

        <View style={{ height: 100 }} />
      </ScrollView>

      <View style={styles.navbarWrapper}>
        <BottomNavBar navigation={navigation} currentRoute="Settings" />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: '#7a8b2d',
    padding: 14,
    alignItems: 'center',
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  headerTitle: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 20,
    marginLeft: 8,
  },
  content: {
    padding: 20,
    paddingBottom: 0,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    textAlign: 'center',
    marginVertical: 20,
    fontFamily: 'serif',
    color: '#000',
  },
  label: {
    marginBottom: 6,
    fontWeight: '600',
    color: '#444',
  },
  input: {
    backgroundColor: '#e5edd6',
    borderColor: '#aaa',
    borderWidth: 1,
    borderRadius: 10,
    padding: 10,
    marginBottom: 20,
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  cancelBtn: {
    flex: 1,
    backgroundColor: '#cfe8b0',
    borderRadius: 10,
    paddingVertical: 10,
    marginRight: 10,
    alignItems: 'center',
  },
  saveBtn: {
    flex: 1,
    backgroundColor: '#cfe8b0',
    borderRadius: 10,
    paddingVertical: 10,
    marginLeft: 10,
    alignItems: 'center',
  },
  deleteBtn: {
    marginTop: 20,
    backgroundColor: '#cc3b3b',
    padding: 12,
    borderRadius: 10,
    alignItems: 'center',
  },
  btnText: {
    fontWeight: 'bold',
    color: '#1e1e1e',
  },
  navbarWrapper: {
    position: 'absolute',
    bottom: 0,
    width: '100%',
  },
});
