
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ActivityIndicator,
  FlatList,
  TouchableOpacity,
  Modal,
} from 'react-native';
import { ArrowLeft, DollarSign, Bell, Settings } from 'lucide-react-native';
import BottomNavBar from '../components/BottomNavBar';
import Toast from 'react-native-toast-message';

const API_BASE_URL = 'http://10.0.2.2:8080';

export default function SalesListScreen({ navigation, route }) {
  const [ventes, setVentes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [venteToDelete, setVenteToDelete] = useState(null);

  const fetchVentes = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE_URL}/api/ventes`);
      const data = await res.json();
      setVentes(data);
    } catch (error) {
      console.error('Erreur récupération ventes:', error);
    } finally {
      setLoading(false);
    }
  };

  const deleteVente = async (id) => {
    try {
      const res = await fetch(`${API_BASE_URL}/api/ventes/${id}`, {
        method: 'DELETE',
      });
      if (!res.ok) throw new Error('Échec de la suppression');
      setVentes(prev => prev.filter(v => v.id !== id));
      Toast.show({
        type: 'success',
        text1: 'Vente supprimée avec succès',
      });
    } catch (err) {
      Toast.show({
        type: 'error',
        text1: 'Erreur suppression',
        text2: err.message,
      });
    } finally {
      setShowDeleteModal(false);
      setVenteToDelete(null);
    }
  };

  useEffect(() => {
    fetchVentes();
  }, []);

  useEffect(() => {
    if (route.params?.refresh) {
      fetchVentes();
    }
  }, [route.params?.refresh]);

  const getStatutBadgeStyle = (statut) => {
    switch (statut.toLowerCase()) {
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
    return statut.toLowerCase() === 'confirmée' ? 'LIVRÉE' : statut.toUpperCase();
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
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <ArrowLeft size={22} color="#fff" />
          </TouchableOpacity>
          <DollarSign size={22} color="#f5c518" />
          <Text style={styles.headerTitle}>Ventes</Text>
        </View>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
          <TouchableOpacity>
            <Bell size={20} color="#fff" />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => navigation.navigate('Settings')}>
            <Settings size={24} color="#fff" />
          </TouchableOpacity>
        </View>
      </View>

      <Text style={{ fontSize: 28, fontWeight: 'bold', textAlign: 'center', marginVertical: 20, color: '#111827' }}>
        Liste des Ventes
      </Text>

      <FlatList
        data={ventes}
        keyExtractor={(item, index) => (item.id ?? index).toString()}
        renderItem={({ item }) => (
          <View style={{ padding: 18, backgroundColor: '#F9D8D6', marginBottom: 18, borderRadius: 16, marginHorizontal: 16, borderWidth: 1, borderColor: '#e5e7eb' }}>
            <Text style={{ fontSize: 20, fontWeight: 'bold', color: '#222', marginBottom: 8 }}>
              Vente #{item.id}
            </Text>
            <View style={{ flexDirection: 'row', marginBottom: 4 }}>
              <Text style={{ fontWeight: 'bold', width: 110, color: '#6b7280' }}>Date :</Text>
              <Text>{item.dateVente}</Text>
            </View>
            <View style={{ flexDirection: 'row', marginBottom: 4 }}>
              <Text style={{ fontWeight: 'bold', width: 110, color: '#6b7280' }}>Client :</Text>
              <Text>{item.nomClient || '—'}</Text>
            </View>
            <View style={{ flexDirection: 'row', marginBottom: 4 }}>
              <Text style={{ fontWeight: 'bold', width: 110, color: '#6b7280' }}>Montant :</Text>
              <Text>{item.montantTotal} DH</Text>
            </View>
            <View style={{ flexDirection: 'row', marginBottom: 4, alignItems: 'center' }}>
              <Text style={{ fontWeight: 'bold', width: 110, color: '#6b7280' }}>Statut :</Text>
              <View style={{ backgroundColor: getStatutBadgeStyle(item.statut).backgroundColor, borderColor: getStatutBadgeStyle(item.statut).borderColor, borderWidth: 1.8, paddingVertical: 4, paddingHorizontal: 12, borderRadius: 20 }}>
                <Text style={{ color: getStatutBadgeStyle(item.statut).textColor, fontWeight: 'bold', fontSize: 12, textTransform: 'uppercase' }}>
                  {formatStatutLabel(item.statut)}
                </Text>
              </View>
            </View>

            <View style={{ flexDirection: 'row', justifyContent: 'flex-end', gap: 10, marginTop: 10 }}>
              <TouchableOpacity
                style={{ backgroundColor: '#e0f2fe', borderRadius: 22, width: 44, height: 44, alignItems: 'center', justifyContent: 'center', borderWidth: 2, borderColor: '#38bdf8' }}
                onPress={() => navigation.navigate('EditVenteScreen', { idVente: item.id })}
              >
                <Text style={{ fontSize: 26, color: '#0ea5e9' }}>✏️</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={{ backgroundColor: '#fee2e2', borderRadius: 22, width: 44, height: 44, alignItems: 'center', justifyContent: 'center', borderWidth: 2, borderColor: '#ef4444' }}
                onPress={() => deleteVente(item.id)}
              >
                <Text style={{ fontSize: 26, color: '#dc2626' }}>🗑️</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={{ backgroundColor: '#fef9c3', borderRadius: 22, width: 44, height: 44, alignItems: 'center', justifyContent: 'center', borderWidth: 2, borderColor: '#eab308', shadowColor: '#eab308', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.25, shadowRadius: 6, elevation: 4 }}
              >
                <Text style={{ fontSize: 26, color: '#b45309' }}>🖨️</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
        contentContainerStyle={{ paddingBottom: 80, paddingTop: 10 }}
      />

      <TouchableOpacity
        style={{ backgroundColor: '#ffd700', padding: 15, borderRadius: 10, alignItems: 'center', alignSelf: 'flex-end', marginHorizontal: 20, marginBottom: 10 }}
        onPress={() => navigation.navigate('AddSaleScreen')}
      >
        <Text style={{ fontSize: 16, fontWeight: 'bold' }}>+ Ajouter une vente</Text>
      </TouchableOpacity>

      <BottomNavBar navigation={navigation} currentRoute="SalesListScreen" />
      <Toast />
    </View>
  );
}

const styles = {
  header: {
    flexDirection: 'row',
    backgroundColor: '#7a8b2d',
    padding: 14,
    paddingHorizontal: 16,
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  headerTitle: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 20,
    fontFamily: 'serif',
    marginLeft: 6,
  },
};
