import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  ActivityIndicator,
  FlatList,
  StyleSheet,
  Image,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { API_ENDPOINTS, handleApiError, API_BASE_URL } from '../config/api';
import Toast from 'react-native-toast-message';
import TopBar from '../components/TopBar';
import BottomNavBar from '../components/BottomNavBar';

const LivraisonListScreen = () => {
  const [livraisons, setLivraisons] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigation = useNavigation();
  const route = useRoute();
  const { vente } = route.params;

  useEffect(() => {
    fetchLivraisons();
  }, []);

  const fetchLivraisons = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API_ENDPOINTS.DELIVERIES}/vente/${vente.idVente || vente.id}`);
      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }
      const data = await res.json();
      setLivraisons(data);
    } catch (error) {
      const errorInfo = handleApiError(error);
      Toast.show({
        type: 'error',
        text1: 'Erreur',
        text2: errorInfo.message,
        position: 'top',
      });
    } finally {
      setLoading(false);
    }
  };

  const renderItem = ({ item }) => (
    <View style={styles.card}>
      <Image
        source={{
          uri: `${API_BASE_URL}/images/${item.produit?.photo || 'placeholder.jpg'}`,
        }}
        style={styles.image}
      />
      <View style={styles.info}>
        <Text style={styles.title}>{item.produit?.nom}</Text>
        <Text style={styles.detail}>Date : {item.dateLivraison || ''}</Text>
        <Text style={styles.detail}>
          Quantité : {item.quantite} {item.produit?.unit}
        </Text>
        <Text style={styles.detail}>
          Statut : <Text style={{ fontWeight: 'bold' }}>{item.statut ?? 'Non défini'}</Text>
        </Text>
        <Text style={styles.detail}>
          Lot : {item.refLot ?? 'Aucun'}
        </Text>
      </View>
    </View>
  );

  const handleDelete = async (id) => {
    try {
      const res = await fetch(`${API_ENDPOINTS.DELIVERIES}/${id}`, {
        method: 'DELETE',
      });
      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }
      Toast.show({
        type: 'success',
        text1: 'Succès',
        text2: 'Livraison supprimée avec succès',
        position: 'top',
      });
      fetchLivraisons();
    } catch (error) {
      const errorInfo = handleApiError(error);
      Toast.show({
        type: 'error',
        text1: 'Erreur',
        text2: errorInfo.message,
        position: 'top',
      });
    }
  };

  const getStatusColor = (status) => {
    switch (status.toLowerCase()) {
      case 'en cours':
        return '#fef3c7';
      case 'terminée':
        return '#dcfce7';
      case 'annulée':
        return '#fee2e2';
      default:
        return '#e5e7eb';
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#6b8e23" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <TopBar
        title="Livraisons"
        onGoBack={() => navigation.goBack()}
        activeLeftIcon="DollarSign"
        onNotificationPress={() => navigation.navigate('Notifications')}
        onSettingsPress={() => navigation.navigate('Settings')}
      />
      <Text style={styles.screenTitle}>Livraisons pour Vente #{vente.idVente || vente.id}</Text>
      <FlatList
        data={livraisons}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={{ paddingBottom: 80 }}
        ListEmptyComponent={() => (
          <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', padding: 32 }}>
            <Text style={styles.empty}>Aucune livraison trouvée pour cette vente.</Text>
          </View>
        )}
        renderItem={renderItem}
      />
      <TouchableOpacity
        style={styles.addButton}
        onPress={() => navigation.navigate('AddLivraisonScreen', { vente })}
      >
        <Text style={styles.addButtonText}>+</Text>
      </TouchableOpacity>
      <BottomNavBar navigation={navigation} currentRoute="SalesScreen"/>
    </View>
  );
};

export default LivraisonListScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f3f4f6',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f3f4f6',
  },
  screenTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    textAlign: 'center',
    marginVertical: 20,
    color: '#111827',
  },
  card: {
    backgroundColor: '#ffffff',
    marginHorizontal: 16,
    marginBottom: 18,
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.12,
    shadowRadius: 6,
    elevation: 4,
    flexDirection: 'row',
    gap: 12,
  },
  image: {
    width: 70,
    height: 70,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#d1d5db',
  },
  info: {
    flex: 1,
    justifyContent: 'center',
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: 4,
  },
  detail: {
    fontSize: 14,
    color: '#374151',
    marginBottom: 2,
  },
  empty: {
    textAlign: 'center',
    fontSize: 16,
    color: '#6b7280',
    marginTop: 40,
  },
  addButton: {
    position: 'absolute',
    right: 20,
    bottom: 20,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#6b8e23',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
  },
  addButtonText: {
    fontSize: 24,
    color: '#fff',
    fontWeight: 'bold',
  },
});