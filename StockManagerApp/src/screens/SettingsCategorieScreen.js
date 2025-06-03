import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Alert,
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { ArrowLeft, Plus, Settings, Bell, Trash2 } from 'lucide-react-native';
import BottomNavBar from '../components/BottomNavBar';

export default function SettingsCategorieScreen({ navigation }) {
  const [categories, setCategories] = useState([]);
  const [error, setError] = useState(null);
  const [selectedId, setSelectedId] = useState(null);

  const fetchCategories = async () => {
    try {
      const res = await fetch('http://10.0.2.2:8080/categories/all');
      const data = await res.json();
      setCategories(data);
      setError(null);
    } catch (err) {
      console.error('Erreur de chargement des catégories :', err);
      setError('Impossible de charger les catégories.');
    }
  };

  const handleDelete = async () => {
    if (!selectedId) {
      Alert.alert('Avertissement', 'Veuillez sélectionner une catégorie.');
      return;
    }
    Alert.alert(
      'Confirmation',
      'Voulez-vous vraiment supprimer cette catégorie ?',
      [
        { text: 'Annuler', style: 'cancel' },
        {
          text: 'Supprimer',
          onPress: async () => {
            try {
              const res = await fetch(`http://10.0.2.2:8080/categories/${selectedId}`, {
                method: 'DELETE',
              });
              if (res.ok) {
                fetchCategories();
                setSelectedId(null);
              } else {
                Alert.alert('Erreur', 'Échec de la suppression.');
              }
            } catch (err) {
              Alert.alert('Erreur réseau', err.message);
            }
          },
        },
      ]
    );
  };

  useFocusEffect(
    useCallback(() => {
      fetchCategories();
    }, [])
  );

  return (
    <View style={styles.container}>
      {/* En-tête */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <ArrowLeft size={22} color="#fff" />
          </TouchableOpacity>
          <Settings size={25} color="#f5c518" />
          <Text style={styles.headerTitle}>Paramètres</Text>
        </View>
        <TouchableOpacity>
          <Bell size={20} color="#fff" />
        </TouchableOpacity>
      </View>

      <Text style={styles.title}>Catégories</Text>

      {/* Liste des catégories */}
      <ScrollView contentContainerStyle={styles.list}>
        {error ? (
          <Text style={{ color: 'red', textAlign: 'center' }}>{error}</Text>
        ) : categories.length === 0 ? (
          <Text style={{ textAlign: 'center', marginTop: 20 }}>Aucune catégorie trouvée.</Text>
        ) : (
          categories.map((item, index) => {
            const isSelected = selectedId === item.id_categorie;
            return (
              <TouchableOpacity
                key={index}
                style={[styles.categoryButton, isSelected && styles.selectedCategory]}
                onPress={() => setSelectedId(item.id_categorie)}
              >
                <Text style={styles.categoryText}>
                  {(item.nom || 'Sans nom').toUpperCase()}
                </Text>
              </TouchableOpacity>
            );
          })
        )}
      </ScrollView>

      {/* Boutons d'action */}
      <View style={styles.actionButtons}>
        <TouchableOpacity style={styles.deleteButton} onPress={handleDelete}>
          <Trash2 size={20} color="#333" />
          <Text style={styles.deleteText}>Supprimer Catégorie</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.addButton}
          onPress={() => navigation.navigate('AddCategorieScreen')}
        >
          <Plus size={16} color="#333" />
          <Text style={styles.addText}>Ajouter Catégorie</Text>
        </TouchableOpacity>
      </View>

      {/* Barre de navigation */}
      <BottomNavBar navigation={navigation} currentRoute="Categories" />
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
  headerLeft: {
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
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    textAlign: 'center',
    marginVertical: 16,
    fontFamily: 'serif',
    color: '#000',
  },
  list: {
    paddingHorizontal: 20,
    paddingBottom: 100,
  },
  categoryButton: {
    backgroundColor: '#e3e3e3',
    paddingVertical: 12,
    borderRadius: 10,
    marginBottom: 12,
    alignItems: 'center',
  },
  selectedCategory: {
    backgroundColor: '#cde9bd',
    borderColor: 'green',
    borderWidth: 2,
  },
  categoryText: {
    fontWeight: 'bold',
    color: '#333',
  },
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginHorizontal: 20,
    marginBottom: 70,
    gap: 12,
  },
  deleteButton: {
    flexDirection: 'row',
    backgroundColor: '#f8c7c7',
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 10,
    alignItems: 'center',
    flex: 1,
    justifyContent: 'center',
  },
  deleteText: {
    marginLeft: 8,
    fontWeight: 'bold',
    color: '#333',
  },
  addButton: {
    flexDirection: 'row',
    backgroundColor: '#FFF4B1',
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 10,
    alignItems: 'center',
    flex: 1,
    justifyContent: 'center',
  },
  addText: {
    marginLeft: 8,
    fontWeight: 'bold',
    color: '#333',
  },
});
