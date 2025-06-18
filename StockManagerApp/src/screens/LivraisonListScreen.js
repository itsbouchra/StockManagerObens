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
import { API_ENDPOINTS, handleApiError } from '../config/api';
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
      const res = await fetch(`${API_ENDPOINTS.DELIVERIES}/vente/${vente.idVente}`);
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
    <View style={styles.itemContainer}>
      <View style={styles.itemHeader}>
        <Text style={styles.itemTitle}>Livraison #{item.id}</Text>
        <Text style={styles.itemDate}>
          {new Date(item.dateLivraison).toLocaleDateString()}
        </Text>
      </View>
      <View style={styles.itemDetails}>
        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>Produit:</Text>
          <Text style={styles.detailValue}>{item.produit?.nom || 'N/A'}</Text>
        </View>
        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>Quantité:</Text>
          <Text style={styles.detailValue}>{item.quantite}</Text>
        </View>
        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>Statut:</Text>
          <View style={[styles.statusBadge, { backgroundColor: getStatusColor(item.statut) }]}>
            <Text style={styles.statusText}>{item.statut}</Text>
          </View>
        </View>
      </View>
      <View style={styles.actions}>
        <TouchableOpacity
          style={[styles.actionButton, styles.editButton]}
          onPress={() => navigation.navigate('EditLivraisonScreen', { livraison: item })}
        >
          <Text style={styles.actionButtonText}>✏️</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.actionButton, styles.deleteButton]}
          onPress={() => handleDelete(item.id)}
        >
          <Text style={styles.actionButtonText}>🗑️</Text>
        </TouchableOpacity>
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
        onNotificationPress={() => navigation.navigate('Notifications')}
        onSettingsPress={() => navigation.navigate('Settings')}
      />
      <Text style={styles.title}>Liste des Livraisons</Text>
      <FlatList
        data={livraisons}
        renderItem={renderItem}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={styles.list}
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
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    textAlign: 'center',
    marginVertical: 20,
    color: '#111827',
  },
  list: {
    padding: 16,
    paddingBottom: 80,
  },
  itemContainer: {
    backgroundColor: '#fff',
    padding: 16,
    marginVertical: 8,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  itemHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  itemTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  itemDate: {
    fontSize: 14,
    color: '#666',
  },
  itemDetails: {
    gap: 8,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  detailLabel: {
    width: 80,
    fontSize: 14,
    color: '#666',
    fontWeight: '500',
  },
  detailValue: {
    fontSize: 14,
    color: '#333',
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#333',
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 8,
    marginTop: 12,
  },
  actionButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  editButton: {
    backgroundColor: '#e0f2fe',
    borderWidth: 1,
    borderColor: '#38bdf8',
  },
  deleteButton: {
    backgroundColor: '#fee2e2',
    borderWidth: 1,
    borderColor: '#ef4444',
  },
  actionButtonText: {
    fontSize: 18,
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