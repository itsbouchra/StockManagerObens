import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  ActivityIndicator,
  FlatList,
  Image,
  Dimensions,
  TouchableOpacity,
} from 'react-native';
import { useIsFocused } from '@react-navigation/native';
import TopBar from '../components/TopBar';
import BottomNavBar from '../components/BottomNavBar';

const windowWidth = Dimensions.get('window').width;
const boxMargin = 16;
const boxesPerRow = 2;
const boxWidth = (windowWidth - boxMargin * (boxesPerRow + 1)) / boxesPerRow;
const API_BASE_URL = 'http://10.0.2.2:8080';

const ProductsAdmin = ({ route, navigation }) => {
  const { id_categorie, categorieNom } = route.params;
  const [produits, setProduits] = useState([]);
  const [loading, setLoading] = useState(true);
  const isFocused = useIsFocused();

  const fetchProduits = async () => {
    try {
      setLoading(true);
      const res = await fetch(`${API_BASE_URL}/produits/byCategorie/${id_categorie}`);
      const data = await res.json();
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

  if (loading) {
    return (
      <View style={{
        flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#f3f4f6'
      }}>
        <ActivityIndicator size="large" color="#00cc99" />
      </View>
    );
  }

  return (
    <View style={{ flex: 1, backgroundColor: '#f3f4f6' }}>
      <TopBar
        title="Produits"
        active="ProductAD"
        onGoBack={() => navigation.goBack()}
      />


<Text
  style={{
    fontSize: 30,
        fontWeight: 'bold',
        marginTop: 19,
        color: '#4A444A',
        marginBottom: 16,
        alignSelf: 'center',
        marginTop: 14,   // Ajouté
  }}
>
  {categorieNom}
</Text>



      <FlatList
  data={produits}
  keyExtractor={(item) => item.id.toString()}
  contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 100 }}
 renderItem={({ item }) => (
  <TouchableOpacity
    onPress={() => {
      console.log("Navigating to details with ID:", item.id); // ✅ This will log
      navigation.navigate('ProductDetailScreen', { id_produit: item.id }); // ✅ This will navigate
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
        source={{
          uri: `${API_BASE_URL}/images/${item.photo?.trim() || 'default.jpg'}`,
        }}
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
        onPress={() =>
          navigation.navigate('AddProductScreen', { id_categorie })
        }
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

export default ProductsAdmin;


