import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  ActivityIndicator,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  RefreshControl,
} from 'react-native';
import Toast from 'react-native-toast-message';
import { useNavigation } from '@react-navigation/native';
import {
  ArrowLeft,
  Bell,
  Settings,
  ClipboardList,
} from 'lucide-react-native';
import CustomerBottomNavBar from '../components/CustomerBottomNavBar';
import CustomerTopBar from '../components/CustomerTopBar';
import { API_ENDPOINTS, handleApiError } from '../config/api';
import { useAuth } from '../context/AuthContext';

const CustomerOrderScreen = ({ route }) => {
  const navigation = useNavigation();
  const { user } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const res = await fetch(API_ENDPOINTS.SALES);
      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }
      const data = await res.json();
      setOrders(data);
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
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  useEffect(() => {
    if (route.params?.refresh) {
      fetchOrders();
    }
  }, [route.params?.refresh]);

  const onRefresh = () => {
    setRefreshing(true);
    fetchOrders();
  };

  // Status badge style function (copied from SalesListScreen)
  const getStatutBadgeStyle = (statut) => {
    switch (statut?.toLowerCase()) {
      case 'livree':
      case 'livré':
      case 'livrée':
      case 'confirmée':
        return {
          borderColor: '#3b82f6',
          backgroundColor: '#dbeafe',
          textColor: '#1e3a8a',
        };
      case 'en attente':
        return {
          borderColor: '#facc15',
          backgroundColor: '#fef3c7',
          textColor: '#92400e',
        };
      case 'annulée':
        return {
          borderColor: '#ef4444',
          backgroundColor: '#fee2e2',
          textColor: '#991b1b',
        };
      default:
        return {
          borderColor: '#d1d5db',
          backgroundColor: '#f3f4f6',
          textColor: '#374151',
        };
    }
  };

  const formatStatutLabel = (statut) => {
    return statut?.toLowerCase() === 'confirmée' ? 'LIVRÉE' : statut?.toUpperCase();
  };

  const renderOrderItem = ({ item }) => (
    <View style={{
      padding: 18,
      backgroundColor: '#F9D8D6',
      marginBottom: 18,
      borderRadius: 16,
      marginHorizontal: 16,
      borderWidth: 1,
      borderColor: '#e5e7eb',
      position: 'relative',
    }}>
      <Text style={{ fontSize: 20, fontWeight: 'bold', color: '#222', marginBottom: 8 }}>
        Commande #{item.id}
      </Text>
      <View style={{ flexDirection: 'row', marginBottom: 4 }}>
        <Text style={{ fontWeight: 'bold', width: 110, color: '#6b7280' }}>Date :</Text>
        <Text>{item.date ? new Date(item.date).toLocaleDateString() : ''}</Text>
      </View>
      <View style={{ flexDirection: 'row', marginBottom: 4 }}>
        <Text style={{ fontWeight: 'bold', width: 110, color: '#6b7280' }}>Client :</Text>
        <Text>{item.nomClient ? String(item.nomClient) : '—'}</Text>
      </View>
      <View style={{ flexDirection: 'row', marginBottom: 4 }}>
        <Text style={{ fontWeight: 'bold', width: 110, color: '#6b7280' }}>Montant :</Text>
        <Text>{typeof item.montantTotal === 'number' && !isNaN(item.montantTotal) ? item.montantTotal.toFixed(2) : '0.00'} DH</Text>
      </View>
      <View style={{ flexDirection: 'row', marginBottom: 4, alignItems: 'center' }}>
        <Text style={{ fontWeight: 'bold', width: 110, color: '#6b7280' }}>Statut :</Text>
        <View style={{
          backgroundColor: getStatutBadgeStyle(item.statut).backgroundColor,
          borderColor: getStatutBadgeStyle(item.statut).borderColor,
          borderWidth: 1.8,
          paddingVertical: 4,
          paddingHorizontal: 12,
          borderRadius: 20,
        }}>
          <Text style={{
            color: getStatutBadgeStyle(item.statut).textColor,
            fontWeight: 'bold',
            fontSize: 12,
            textTransform: 'uppercase',
          }}>
            {formatStatutLabel(item.statut)}
          </Text>
        </View>
      </View>
    </View>
  );

  if (loading) {
    return (
      <View style={styles.container}>
        <CustomerTopBar
          title="Mes commandes"
          active="orders"
          onGoBack={() => navigation.goBack()}
          onNotificationPress={() => navigation.navigate('Notifications')}
          onSettingsPress={() => navigation.navigate('CustomerSettingsScreen')}
        />
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#6b8e23" />
        </View>
      </View>
    );
  }

  return (
    <View style={{ flex: 1, backgroundColor: '#f3f4f6' }}>
      <CustomerTopBar
        title="Mes commandes"
        active="orders"
        onGoBack={() => navigation.goBack()}
        onNotificationPress={() => navigation.navigate('Notifications')}
        onSettingsPress={() => navigation.navigate('CustomerSettingsScreen')}
      />
      <Text style={{ fontSize: 28, fontWeight: 'bold', textAlign: 'center', marginVertical: 20, color: '#111827' }}>
        Historique des Commandes
      </Text>
      <FlatList
        data={user ? orders.filter(item => item.idClient === user.id_user) : []}
        keyExtractor={(item) => item.id?.toString()}
        renderItem={renderOrderItem}
        contentContainerStyle={{ paddingBottom: 80, paddingTop: 10 }}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={['#6b8e23']}
          />
        }
        ListEmptyComponent={() => (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>Aucune commande trouvée</Text>
          </View>
        )}
      />
      <CustomerBottomNavBar navigation={navigation} currentRoute="CustomerOrderScreen" />
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
  listContainer: {
    padding: 16,
  },
  orderItem: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 16,
    marginBottom: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
  },
  orderHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  orderNumber: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1f2937',
  },
  orderStatus: {
    fontSize: 14,
    fontWeight: '500',
  },
  orderDate: {
    fontSize: 14,
    color: '#6b7280',
    marginBottom: 4,
  },
  orderTotal: {
    fontSize: 16,
    fontWeight: '600',
    color: '#166534',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  emptyText: {
    fontSize: 16,
    color: '#6b7280',
    textAlign: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    textAlign: 'center',
    marginVertical: 20,
    color: '#111827',
  },
});

export default CustomerOrderScreen;