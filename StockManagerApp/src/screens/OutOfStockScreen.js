import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  RefreshControl,
  Alert,
  Image,
} from 'react-native';
import { AlertCircle, Home } from 'lucide-react-native';
import TopBar from '../components/TopBar';
import BottomNavBar from '../components/BottomNavBar';
import { useAuth } from '../context/AuthContext';
import { useIsFocused } from '@react-navigation/native';

const API_BASE_URL = 'http://10.0.2.2:8080';

const OutOfStockScreen = ({ navigation, route }) => {
  const { unreadNotificationsCount } = useAuth();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const showLowStock = route.params?.showLowStock || false;
  const isFocused = useIsFocused();

  useEffect(() => {
    if (isFocused) {
      fetchProducts();
    }
  }, [isFocused, showLowStock]);

  const fetchProducts = async () => {
    try {
      const endpoint = showLowStock ? '/produits/low-stock' : '/produits/out-of-stock';
      console.log('Fetching from endpoint:', `${API_BASE_URL}${endpoint}`);
      
      const response = await fetch(`${API_BASE_URL}${endpoint}`);
      console.log('Response status:', response.status);
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error('Error response:', errorText);
        throw new Error(`Server responded with status ${response.status}: ${errorText}`);
      }
      
      let data = await response.json();
      console.log('Received data:', data);
      
      // Ensure data is an array and filter out any null/undefined products or products without 'id'
      if (!Array.isArray(data)) {
        console.error('Received non-array data:', data);
        throw new Error('Invalid data format received from server');
      }
      data = data.filter(product => product != null && typeof product.id !== 'undefined');
      
      setProducts(data);
    } catch (error) {
      console.error('Error fetching products:', error);
      Alert.alert(
        'Error',
        `Failed to load products: ${error.message}. Please try again.`,
        [{ text: 'OK', onPress: () => setProducts([]) }]
      );
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    fetchProducts();
  };

  const handleSettingsPress = () => {
    navigation.navigate('Settings');
  };

  const handleNotificationPress = () => {
    navigation.navigate('AdminNotifications');
  };

  return (
    <View style={styles.container}>
      <TopBar
        title={showLowStock ? "Produits en stock faible" : "Produits en rupture"}
        activeLeftIcon="home"
        onGoBack={() => navigation.goBack()}
        notificationCount={String(unreadNotificationsCount || '')}
        onNotificationPress={handleNotificationPress}
        onSettingsPress={handleSettingsPress}
      />
      
      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContentContainer}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {loading ? (
          <ActivityIndicator size="large" color="#166534" style={styles.loader} />
        ) : products.length === 0 ? (
          <Text style={styles.noProducts}>
            {showLowStock 
              ? "Aucun produit en stock faible" 
              : "Aucun produit en rupture de stock"}
          </Text>
        ) : (
          products.map((product, index) => (
            <View key={product.id ? product.id.toString() : `product-${index}`} style={styles.productCard}>
              <Image
                source={{ uri: product.photo ? `${API_BASE_URL}/images/${product.photo.trim()}` : `${API_BASE_URL}/images/default.jpg` }}
                style={styles.productImage}
              />
              <View style={styles.productDetails}>
                <Text style={styles.productName}>{product.nom || 'N/A'}</Text>
                <View style={styles.quantityContainer}>
                  <Text style={styles.quantity}>Quantité: {product.quantite ?? 0}</Text>
                  <AlertCircle 
                    size={30}
                    color={showLowStock ? "#e69138" : "#cc0000"}
                    style={styles.alertIcon} 
                  />
                </View>
                {showLowStock && (
                  <Text style={styles.stockLevel}>
                    Niveau de stock: {product.stockMin || 'Faible'}
                  </Text>
                )}
              </View>
            </View>
          ))
        )}
      </ScrollView>
      
      <BottomNavBar navigation={navigation} currentRoute="Dashboard" />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f8f8',
  },
  scrollView: {
    flex: 1,
  },
  scrollContentContainer: {
    padding: 16,
    paddingBottom: 80,
  },
  loader: {
    marginTop: 50,
  },
  noProducts: {
    textAlign: 'center',
    fontSize: 18,
    color: '#666',
    marginTop: 50,
  },
  productCard: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  productImage: {
    width: 70,
    height: 70,
    borderRadius: 8,
    marginRight: 16,
    resizeMode: 'cover',
    borderWidth: 1,
    borderColor: '#eee',
  },
  productDetails: {
    flex: 1,
    justifyContent: 'center',
  },
  productName: {
    fontSize: 18,
    fontWeight: '700',
    color: '#333',
    marginBottom: 4,
  },
  quantityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
  },
  quantity: {
    fontSize: 16,
    color: '#555',
    fontWeight: '500',
  },
  alertIcon: {
    marginLeft: 15,
  },
  stockLevel: {
    fontSize: 14,
    color: '#f59e0b',
    fontWeight: '600',
    marginTop: 4,
  },
});

export default OutOfStockScreen; 