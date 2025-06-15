import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, ActivityIndicator, Image, ScrollView } from 'react-native';
import TopBar from '../components/TopBar';
import BottomNavBar from '../components/BottomNavBar';
import { useAuth } from '../context/AuthContext';

const API_BASE_URL = 'http://10.0.2.2:8080';

const ProductReceptionScreen = ({ route, navigation }) => {
  const { productId, productName, productPhoto } = route.params;
  const [receptions, setReceptions] = useState([]);
  const [loading, setLoading] = useState(true);
  const { unreadNotificationsCount } = useAuth();

  useEffect(() => {
    const fetchReceptions = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/receptions/byProduct/${productId}`);
        const data = await res.json();
        setReceptions(data);
      } catch (error) {
        console.error('Erreur lors du chargement des réceptions :', error);
      } finally {
        setLoading(false);
      }
    };
    fetchReceptions();
  }, []);

  const totalStock = receptions.reduce((sum, item) => sum + (item.quantite || 0), 0);

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#00cc99" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <TopBar
        title="Stock Réception"
        onGoBack={() => navigation.goBack()}
        activeLeftIcon="stock"
        onNotificationPress={() => navigation.navigate('AdminNotifications')}
        notificationCount={unreadNotificationsCount}
        onSettingsPress={() => navigation.navigate('Settings')}
      />
      <View style={{ flexDirection: 'row', alignItems: 'center', backgroundColor: '#d1ded7', borderRadius: 10, margin: 16, padding: 12 }}>
        <Image source={{ uri: `${API_BASE_URL}/images/${productPhoto}` }} style={{ width: 60, height: 60, borderRadius: 8, marginRight: 16 }} />
        <Text style={{ fontWeight: 'bold', fontSize: 18 }}>{productName}</Text>
      </View>
      <FlatList
        data={receptions}
        keyExtractor={(item) => item.id.toString()}
        ListHeaderComponent={() => (
          <View style={{
            flexDirection: 'row',
            paddingVertical: 8,
            backgroundColor: '#e5e7eb',
            borderTopLeftRadius: 10,
            borderTopRightRadius: 10,
            marginHorizontal: 8,
          }}>
            <Text style={{ flex: 1.3, fontWeight: 'bold', paddingLeft: 12 }}>Fournisseur</Text>
            <Text style={{ flex: 1, fontWeight: 'bold', paddingLeft: 8 }}>Lot-Ref</Text>
            <Text style={{ flex: 1, fontWeight: 'bold', paddingLeft: 8 }}>Date</Text>
            <Text style={{ flex: 1, fontWeight: 'bold', paddingLeft: 8 }}>En Stock</Text>
          </View>
        )}
        renderItem={({ item }) => (
          <View style={{
            flexDirection: 'row',
            paddingVertical: 8,
            backgroundColor: '#fff',
            borderBottomWidth: 1,
            borderColor: '#e5e7eb',
            marginHorizontal: 8,
          }}>
            <Text style={{ flex: 1.3, paddingLeft: 12 }}>{item.fournisseurNom}</Text>
            <Text style={{ flex: 1, paddingLeft: 8 }}>{item.refLot}</Text>
            <Text style={{ flex: 1, paddingLeft: 8 }}>{item.dateReception}</Text>
            <Text style={{ flex: 1, paddingLeft: 8 }}>{item.quantite}</Text>
          </View>
        )}
        contentContainerStyle={styles.flatListContent}
      />
      <View style={{
        backgroundColor: '#ffe066',
        padding: 16,
        alignItems: 'center',
        marginHorizontal: 16,
        borderRadius: 10,
        marginBottom: 10,
      }}>
        <Text style={{ fontWeight: 'bold', fontSize: 18, color: '#111827' }}>
          Total en stock : {totalStock}
        </Text>
      </View>
      <BottomNavBar navigation={navigation} currentRoute="ProductReception" />
    </View>
  );
};

const styles = {
  container: {
    flex: 1,
    backgroundColor: '#f3f4f6',
  },
  flatListContent: {
    padding: 16,
  },
};

export default ProductReceptionScreen;
