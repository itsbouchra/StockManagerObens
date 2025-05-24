import React, { useEffect, useState } from 'react';
import { View, Text, ActivityIndicator, FlatList, Dimensions } from 'react-native';
import TopBar from '../components/TopBar';
import BottomNavBar from '../components/BottomNavBar';

const windowWidth = Dimensions.get('window').width;
const boxMargin = 16;
const boxPadding = 12;
const boxesPerRow = 2;
const boxWidth = (windowWidth - boxMargin * (boxesPerRow + 1)) / boxesPerRow;

const CategorieScreen = ({ navigation }) => {
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
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#f3f4f6' }}>
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
        numColumns={2} // affiche 2 colonnes
        columnWrapperStyle={{ justifyContent: 'space-between', marginHorizontal: boxMargin / 2 }}
        renderItem={({ item }) => (
          <View
            style={{
              backgroundColor: '#d1d5db',
              width: boxWidth,
              marginBottom: 16,
              paddingVertical: 24,
              paddingHorizontal: boxPadding,
              borderRadius: 12,
              justifyContent: 'center',
              alignItems: 'center',
              shadowColor: '#000',
              shadowOpacity: 0.1,
              shadowRadius: 6,
              elevation: 3,
            }}
          >
            <Text style={{ fontSize: 20, fontWeight: 'bold', color: '#374151', textAlign: 'center' }}>
              {item.nom}
            </Text>
          </View>
        )}
        contentContainerStyle={{ paddingBottom: 80, paddingHorizontal: boxMargin / 2 }}
      />

      <BottomNavBar navigation={navigation} currentRoute="ProductStock" />
    </View>
  );
};

export default CategorieScreen;
 