import React, { useEffect, useState } from 'react';
import { View, Text, ActivityIndicator, FlatList, Image, Dimensions, TouchableOpacity } from 'react-native';
import TopBar from '../components/TopBar';
import BottomNavBar from '../components/BottomNavBar';

const windowWidth = Dimensions.get('window').width;
const boxMargin = 16;
const boxPadding = 12;
const boxesPerRow = 2;
const boxWidth = (windowWidth - boxMargin * (boxesPerRow + 1)) / boxesPerRow;

const ProduitScreen = ({ route, navigation }) => {
  const { id_categorie, categorieNom } = route.params;
  const [produits, setProduits] = useState([]);
  const [loading, setLoading] = useState(true);
  const API_BASE_URL = 'http://10.0.2.2:8080';

  useEffect(() => {
    const fetchProduits = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/produits/byCategorie/${route.params.id_categorie}`);
        const data = await res.json();
        setProduits(data);
      } catch (error) {
        console.error('Erreur lors du chargement des produits :', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProduits();
  }, []);

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#00cc99" />
      </View>
    );
  }

  return (
    <View style={{ flex: 1, backgroundColor: '#f3f4f6' }}>
      <TopBar
        title="Stock"
        active="stock"
        onGoBack={() => navigation.goBack()}
      />

      <Text style={{
        fontSize: 28,
        fontWeight: 'bold',
        textAlign: 'center',
        marginVertical: 20,
        color: '#111827',
      }}>
        {categorieNom}
      </Text>

      <FlatList
        data={produits}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={{ paddingBottom: 80, paddingHorizontal: 16 }}
        renderItem={({ item }) => (
          <TouchableOpacity
            onPress={() => navigation.navigate('ProductReceptionScreen', {
              productId: item.id,
              productName: item.nom,
              productPhoto: item.photo && item.photo.trim() !== '' ? item.photo : 'default.jpg'
            })}
          >
            <View style={{
              flexDirection: 'row',
              backgroundColor: '#e5e7eb',
              marginBottom: 12,
              padding: 12,
              borderRadius: 10,
              alignItems: 'center',
              elevation: 2,
            }}>
              <Image
                source={{
                  uri: `${API_BASE_URL}/images/${item.photo && item.photo.trim() !== '' ? item.photo : 'default.jpg'}`
                }}
                style={{ width: 70, height: 70, borderRadius: 8, marginRight: 16 }}
                resizeMode="cover"
              />
              <View style={{ flex: 1 }}>
                <Text style={{ fontWeight: 'bold', fontSize: 16, color: '#111827' }}>
                  {item.nom}
                </Text>
                <Text style={{ color: '#6b7280', fontSize: 14 }}>
                  {item.prix} DH       
                </Text>
              </View>
            </View>
          </TouchableOpacity>
        )}
      />

      <BottomNavBar navigation={navigation} currentRoute="ProductStock" />
    </View>
  );
};

export default ProduitScreen;
