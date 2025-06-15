import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  ActivityIndicator,
  FlatList,
  Dimensions,
  TouchableOpacity,
  Image,
  StyleSheet,
  TextInput,
} from 'react-native';
import Toast from 'react-native-toast-message';
import { useIsFocused } from '@react-navigation/native';
import TopBar from '../components/TopBar';
import BottomNavBar from '../components/BottomNavBar';
import { useAuth } from '../context/AuthContext';

const API_BASE_URL = 'http://10.0.2.2:8080';
const windowWidth = Dimensions.get('window').width;
const numColumns = 2;

const ProductsAdmin = ({ route, navigation }) => {
  const { unreadNotificationsCount } = useAuth();
  const { id_categorie, categorieNom } = route.params;
  const [produits, setProduits] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const isFocused = useIsFocused();

  const fetchProduits = async () => {
    try {
      setLoading(true);
      const res = await fetch(
        `${API_BASE_URL}/produits/byCategorie/${id_categorie}`
      );
      const data = await res.json();
      console.log('Fetched products data:', data);
      setProduits(data);
    } catch (error) {
      console.error('Erreur chargement produits :', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isFocused) fetchProduits();
  }, [isFocused]);

  const filteredProducts = produits.filter((product) =>
    product.nom.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getImageSource = (photo) => {
    if (photo && photo.trim() !== '') {
      return { uri: `${API_BASE_URL}/images/${photo.trim()}` };
    }
    return require('../assets/default.png');
  };

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#f3f4f6' }}>
        <ActivityIndicator size="large" color="#00cc99" />
      </View>
    );
  }

  return (
    <View style={{ flex: 1, backgroundColor: '#f3f4f6' }}>
      <TopBar
        title="Produits"
        activeLeftIcon="ProductAD"
        onGoBack={() => navigation.goBack()}
        onNotificationPress={() => navigation.navigate('AdminNotifications')}
        notificationCount={unreadNotificationsCount}
        onSettingsPress={() => navigation.navigate('Settings')}
      />

      <TextInput
        style={styles.searchInput}
        placeholder="Rechercher un produit..."
        value={searchQuery}
        onChangeText={setSearchQuery}
      />

      <Text
        style={{
          fontSize: 30,
          fontWeight: 'bold',
          color: '#4A444A',
          marginBottom: 16,
          alignSelf: 'center',
          marginTop: 14,
        }}
      >
        {categorieNom}
      </Text>

      <FlatList
        data={filteredProducts}
        keyExtractor={(item, index) => (item.id_produit !== undefined && item.id_produit !== null) ? item.id_produit.toString() : `_temp_${index}`}
        contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 100 }}
        renderItem={({ item }) => (
          <TouchableOpacity
            onPress={() => {
              const product_id_to_navigate = parseInt(item.id, 10);
              if (isNaN(product_id_to_navigate)) {
                console.error("Error: Invalid id for item:", item);
                Toast.show({
                  type: 'error',
                  text1: 'Erreur',
                  text2: 'ID produit manquant ou invalide pour la navigation ❌',
                });
                return;
              }
              console.log("Navigating to details with ID:", product_id_to_navigate);
              navigation.navigate('ProductDetailScreen', { id_produit: product_id_to_navigate });
            }}
            style={{
              flexDirection: 'row',
              backgroundColor: '#e5e7eb',
              marginBottom: 12,
              padding: 12,
              borderRadius: 10,
              alignItems: 'center',
              elevation: 2,
            }}
          >
            <Image
              source={getImageSource(item.photo?.trim())}
              style={{ width: 70, height: 70, borderRadius: 8, marginRight: 16 }}
            />
            <View style={{ flex: 1 }}>
              <Text style={{ fontWeight: 'bold', fontSize: 16, color: '#111827' }}>
                {item.nom}
              </Text>
              <Text style={{ color: '#6b7280', fontSize: 14 }}>{item.prix} DH</Text>
            </View>
          </TouchableOpacity>
        )}
      />

      <TouchableOpacity
        onPress={() => navigation.navigate('AddProductScreen', { id_categorie: id_categorie })}
        style={{
          position: 'absolute',
          bottom: 90,
          right: 20,
          backgroundColor: '#facc15',
          paddingVertical: 12,
          paddingHorizontal: 20,
          borderRadius: 30,
          elevation: 4,
        }}
      >
        <Text style={{ color: '#000', fontWeight: 'bold', fontSize: 16 }}>
          + Ajouter
        </Text>
      </TouchableOpacity>

      <BottomNavBar navigation={navigation} currentRoute="ProductAD" />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f3f4f6',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  searchInput: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    borderRadius: 8,
    margin: 16,
    paddingHorizontal: 10,
  },
});

export default ProductsAdmin;
