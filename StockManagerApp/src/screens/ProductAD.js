import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  ActivityIndicator,
  FlatList,
  Dimensions,
  TouchableOpacity,
} from 'react-native';
import TopBar from '../components/TopBar';
import BottomNavBar from '../components/BottomNavBar';

const windowWidth = Dimensions.get('window').width;
const boxMargin = 16;
const boxesPerRow = 2;
const boxWidth = (windowWidth - boxMargin * (boxesPerRow + 1)) / boxesPerRow;

const ProductAD = ({ navigation }) => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const API_BASE_URL = 'http://10.0.2.2:8080';

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/categories/all`);
        const data = await res.json();
        setCategories(data);
      } catch (error) {
        console.error('Error fetching categories:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  if (loading) {
    return (
      <View
        style={{
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center',
          backgroundColor: '#f3f4f6',
        }}
      >
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
        notificationCount={0}
        onSettingsPress={() => navigation.navigate('Settings')}
      />

      <Text
        style={{
          fontSize: 28,
          fontWeight: 'bold',
          textAlign: 'center',
          marginVertical: 20,
          color: '#111827',
        }}
      >
        Catégories
      </Text>

      <FlatList
        data={categories}
        keyExtractor={(item) => item.id_categorie.toString()}
        numColumns={2}
        columnWrapperStyle={{
          justifyContent: 'space-between',
          paddingHorizontal: boxMargin,
        }}
        renderItem={({ item }) => (
          <TouchableOpacity
            onPress={() =>
              navigation.navigate('ProductsAdmin', {
                id_categorie: item.id_categorie,
                categorieNom: item.nom,
              })
            }
            style={{
              backgroundColor: '#d1d5db',
              width: boxWidth,
              height: 120,
              marginBottom: 16,
              borderRadius: 12,
              justifyContent: 'center',
              alignItems: 'center',
              shadowColor: '#000',
              shadowOpacity: 0.1,
              shadowRadius: 6,
              elevation: 3,
            }}
          >
            <Text
              style={{
                fontSize: 20,
                fontWeight: 'bold',
                color: '#374151',
                textAlign: 'center',
              }}
            >
              {item.nom}
            </Text>
          </TouchableOpacity>
        )}
        contentContainerStyle={{ paddingBottom: 80, paddingTop: 10 }}
      />

      {/* Product icon active here */}
      <BottomNavBar navigation={navigation} currentRoute="ProductAD" />
    </View>
  );
};

export default ProductAD;
