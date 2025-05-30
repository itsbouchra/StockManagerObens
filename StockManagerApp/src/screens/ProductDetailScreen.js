import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  ActivityIndicator,
  Image,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { Pencil, Trash2 } from 'lucide-react-native';
import { useIsFocused } from '@react-navigation/native';
import Toast from 'react-native-toast-message';


import TopBar from '../components/TopBar';
import BottomNavBar from '../components/BottomNavBar';

const API_BASE_URL = 'http://10.0.2.2:8080';

const ProductDetailScreen = ({ route, navigation }) => {
  const { id_produit } = route.params;
  const [produit, setProduit] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const isFocused = useIsFocused();

  const fetchProduit = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/produits/${id_produit}`);
      if (!response.ok) throw new Error('Erreur serveur');
      const data = await response.json();
      setProduit(data);
    } catch (err) {
      console.error('Erreur chargement produit :', err);
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  const supprimerProduit = () => {
  Alert.alert(
    'Confirmation',
    'Voulez-vous vraiment supprimer ce produit ?',
    [
      { text: 'Annuler', style: 'cancel' },
      {
        text: 'Supprimer',
        style: 'destructive',
        onPress: async () => {
          try {
            const response = await fetch(`${API_BASE_URL}/produits/${produit.id}`, {
              method: 'DELETE',
            });

            if (!response.ok) {
              throw new Error('Erreur de suppression');
            }

            Toast.show({
              type: 'success',
              text1: 'Succès',
              text2: 'Produit supprimé avec succès 👋',
            });

            navigation.goBack();
          } catch (error) {
            console.error('Erreur lors de la suppression :', error);
            Toast.show({
              type: 'error',
              text1: 'Erreur',
              text2: 'Échec de la suppression ❌',
            });
          }
        },
      },
    ]
  );
};


  useEffect(() => {
    if (isFocused) {
      fetchProduit();
    }
  }, [isFocused]);

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#00cc99" />
      </View>
    );
  }

  if (error || !produit?.nom) {
    return (
      <View style={styles.centered}>
        <Text style={{ fontSize: 18, color: 'red' }}>
          Échec du chargement du produit.
        </Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <TopBar
        title="Produits"
        active="ProductAD"
        onGoBack={() => navigation.goBack()}
      />
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.detailTitle}>Détail Produit</Text>

        <Image
          source={{
            uri: produit.photo
              ? `${API_BASE_URL}/images/${produit.photo.trim()}`
              : `${API_BASE_URL}/images/default.jpg`,
          }}
          style={styles.image}
        />

        <View style={styles.infoBox}>
          <Text style={styles.label}>
            Nom : <Text style={styles.text}>{produit.nom}</Text>
          </Text>
          <Text style={styles.label}>
            Prix : <Text style={styles.text}>{produit.prix} DH</Text>
          </Text>
          <Text style={styles.label}>
            Catégorie : <Text style={styles.text}>{produit.nomCategorie}</Text>
          </Text>
          <Text style={styles.label}>
            Description :<Text style={styles.text}>{produit.description}</Text>
          </Text>
        </View>

        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={styles.actionButton}
            onPress={() =>
              navigation.navigate('EditProductScreen', { id_produit: produit.id })
            }
          >
            <Pencil color="#E1B12C" size={20} />
            <Text style={styles.buttonText}>Modifier</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.actionButton} onPress={supprimerProduit}>
            <Trash2 color="#E1B12C" size={20} />
            <Text style={styles.buttonText}>Supprimer</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
      <BottomNavBar navigation={navigation} currentRoute="ProductAD" />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f3f4f6',
  },
  content: {
    padding: 20,
    alignItems: 'center',
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f3f4f6',
  },
  detailTitle: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: 20,
  },
  image: {
    width: 200,
    height: 200,
    borderRadius: 10,
    marginBottom: 20,
  },
  infoBox: {
    backgroundColor: '#e5e7eb',
    padding: 15,
    borderRadius: 10,
    width: '100%',
    marginTop: 10,
  },
  label: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 5,
  },
  text: {
    fontSize: 16,
    fontWeight: 'normal',
    color: '#374151',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 80,
    width: '100%',
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF4B1',
    paddingVertical: 20,
    paddingHorizontal: 18,
    borderRadius: 18,
  },
  buttonText: {
    color: '#000',
    fontWeight: 'bold',
    marginLeft: 8,
    fontSize: 19,
  },
  
});

export default ProductDetailScreen;
