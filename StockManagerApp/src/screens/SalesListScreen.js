import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ActivityIndicator,
  FlatList,
  TouchableOpacity,
} from 'react-native';
import TopBar from '../components/TopBar';
import BottomNavBar from '../components/BottomNavBar';
import Toast from 'react-native-toast-message';
import { API_ENDPOINTS } from '../config/api';

export default function SalesListScreen({ navigation, route }) {
  const [ventes, setVentes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [venteToDelete, setVenteToDelete] = useState(null);

  const fetchVentes = async () => {
    try {
      setLoading(true);
      console.log('Fetching ventes...');
      const response = await fetch(`${API_ENDPOINTS.SALES}`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      console.log('Fetched ventes:', data);
      if (Array.isArray(data)) {
        setVentes(data);
      } else {
        console.error('Received non-array data:', data);
        setVentes([]);
      }
    } catch (error) {
      console.error('Error fetching ventes:', error);
      Toast.show({ type: 'error', text1: 'Erreur', text2: 'Impossible de charger les ventes', position: 'top' });
      setVentes([]);
    } finally {
      setLoading(false);
    }
  };

  const deleteVente = async (id) => {
    if (!id) {
      Toast.show({ type: 'error', text1: 'Erreur', text2: 'ID de vente invalide', position: 'top' });
      return;
    }
    try {
      const response = await fetch(`${API_ENDPOINTS.SALES}/${id}`, {
        method: 'DELETE',
      });
      if (response.ok) {
        Toast.show({ type: 'success', text1: 'Succès', text2: 'Vente supprimée avec succès', position: 'top' });
        fetchVentes();
      } else {
        const error = await response.text();
        Toast.show({ type: 'error', text1: 'Erreur', text2: `Erreur lors de la suppression: ${error}`, position: 'top' });
      }
    } catch (error) {
      console.error('Erreur lors de la suppression:', error);
      Toast.show({ type: 'error', text1: 'Erreur', text2: 'Erreur lors de la suppression de la vente', position: 'top' });
    }
  };

  const handleEditVente = async (id) => {
    try {
      setLoading(true);
      console.log('Fetching vente details for id:', id);
      
      const response = await fetch(`${API_ENDPOINTS.SALES}/${id}`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const venteDetails = await response.json();
      console.log('Vente details:', venteDetails);

      navigation.navigate('EditVenteScreen', { 
        id: id,
        venteDetails: venteDetails 
      });
    } catch (error) {
      console.error('Error fetching vente details:', error);
      Toast.show({ type: 'error', text1: 'Erreur', text2: 'Impossible de charger les détails de la vente', position: 'top' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      console.log('Screen focused, refreshing ventes...');
      fetchVentes();
    });

    return unsubscribe;
  }, [navigation]);

  useEffect(() => {
    fetchVentes();
  }, []);

  useEffect(() => {
    if (route?.params?.refresh) {
      fetchVentes();
    }
  }, [route?.params?.refresh]);

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

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#f3f4f6' }}>
        <ActivityIndicator size="large" color="#00cc99" />
      </View>
    );
  }

  const renderItem = ({ item }) => {
    if (!item || !item.id) {
      console.warn('Item invalide:', item);
      return null;
    }

    return (
      <TouchableOpacity
        onPress={() => navigation.navigate('LivraisonListScreen', { vente: item })}
        activeOpacity={0.85}
        style={{
          padding: 18,
          backgroundColor: '#F9D8D6',
          marginBottom: 18,
          borderRadius: 16,
          marginHorizontal: 16,
          borderWidth: 1,
          borderColor: '#e5e7eb',
          position: 'relative',
        }}>
        {item.statut?.toLowerCase() === 'en attente' && (
          <TouchableOpacity
            onPress={async () => {
              try {
                const res = await fetch(`${API_ENDPOINTS.SALES}/${item.id}/produits`);
                const produits = await res.json();
                if (!Array.isArray(produits)) {
                  throw new Error("Produits n'est pas un tableau");
                }
                navigation.navigate('AddLivraisonScreen', {
                  vente: item,
                  produits,
                });
              } catch (err) {
                console.error('❌ Erreur produits:', err);
                Toast.show({
                  type: 'error',
                  text1: 'Erreur',
                  text2: 'Liste des produits introuvable ou mal formatée.',
                });
              }
            }}
            style={{
              position: 'absolute',
              top: 10,
              right: 10,
              backgroundColor: '#d9f99d',
              borderRadius: 999,
              width: 34,
              height: 34,
              alignItems: 'center',
              justifyContent: 'center',
              borderWidth: 2,
              borderColor: '#65a30d',
              zIndex: 10
            }}
          >
            <Text style={{ fontSize: 22, color: '#365314', fontWeight: 'bold' }}>+</Text>
          </TouchableOpacity>
        )}
        <Text style={{ fontSize: 20, fontWeight: 'bold', color: '#222', marginBottom: 8 }}>
          Vente #{item.id}
        </Text>
        <View style={{ flexDirection: 'row', marginBottom: 4 }}>
          <Text style={{ fontWeight: 'bold', width: 110, color: '#6b7280' }}>Date :</Text>
          <Text>{new Date(item.dateVente).toLocaleDateString()}</Text>
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
        <View style={{ flexDirection: 'row', justifyContent: 'flex-end', gap: 10, marginTop: 10 }}>
          <TouchableOpacity
            style={{
              backgroundColor: '#e0f2fe',
              borderRadius: 22,
              width: 44,
              height: 44,
              alignItems: 'center',
              justifyContent: 'center',
              borderWidth: 2,
              borderColor: '#38bdf8',
              shadowColor: '#38bdf8',
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 0.25,
              shadowRadius: 6,
              elevation: 4,
              marginRight: 2,
            }}
            onPress={() => {
              if (!item.id) {
                Toast.show({ type: 'error', text1: 'Erreur', text2: 'ID de vente invalide', position: 'top' });
                return;
              }
              handleEditVente(item.id);
            }}
          >
            <Text style={{ fontSize: 26, color: '#0ea5e9' }}>{'✏️'}</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={{
              backgroundColor: '#fee2e2',
              borderRadius: 22,
              width: 44,
              height: 44,
              alignItems: 'center',
              justifyContent: 'center',
              borderWidth: 2,
              borderColor: '#ef4444',
              shadowColor: '#ef4444',
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 0.25,
              shadowRadius: 6,
              elevation: 4,
              marginRight: 2,
            }}
            onPress={() => {
              if (!item.id) {
                Toast.show({ type: 'error', text1: 'Erreur', text2: 'ID de vente invalide', position: 'top' });
                return;
              }
              setVenteToDelete(item.id);
              setShowDeleteModal(true);
            }}
          >
            <Text style={{ fontSize: 26, color: '#dc2626' }}>{'🗑️'}</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={{
              backgroundColor: '#fef9c3',
              borderRadius: 22,
              width: 44,
              height: 44,
              alignItems: 'center',
              justifyContent: 'center',
              borderWidth: 2,
              borderColor: '#eab308'
            }}
            onPress={() => {
              if (!item.id) {
                Toast.show({ type: 'error', text1: 'Erreur', text2: 'ID de vente invalide', position: 'top' });
                return;
              }
              const pdfUrl = `${API_ENDPOINTS.SALES}/${item.id}/facture.pdf`;
              navigation.navigate('PdfViewerScreen', { pdfUrl, type: 'vente' });
            }}
          >
            <Text style={{ fontSize: 26, color: '#b45309' }}>🖨</Text>
          </TouchableOpacity>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View style={{ flex: 1, backgroundColor: '#f3f4f6' }}>
      <TopBar
        title="Ventes"
        activeLeftIcon="DollarSign"
        onGoBack={() => navigation.goBack()}
        onNotificationPress={() => console.log('Notifications')}
        onSettingsPress={() => navigation.navigate('Settings')}
      />
      <Text style={{ fontSize: 28, fontWeight: 'bold', textAlign: 'center', marginVertical: 20, color: '#111827' }}>
        Liste des Ventes
      </Text>
      <FlatList
        data={ventes}
        keyExtractor={(item, index) => (item?.id ?? index).toString()}
        renderItem={renderItem}
        contentContainerStyle={{ paddingBottom: 80, paddingTop: 10 }}
        refreshing={loading}
        onRefresh={fetchVentes}
      />
      <TouchableOpacity
        style={{
          backgroundColor: '#ffd700',
          padding: 15,
          borderRadius: 10,
          alignItems: 'center',
          alignSelf: 'flex-end',
          marginHorizontal: 20,
          marginBottom: 10
        }}
        onPress={() => navigation.navigate('AddSaleScreen')}
      >
        <Text style={{ fontSize: 16, fontWeight: 'bold' }}>+ Ajouter une vente</Text>
      </TouchableOpacity>
      <BottomNavBar navigation={navigation} currentRoute="SalesListScreen" />
      {showDeleteModal && (
        <View
          style={{
            position: 'absolute',
            top: 0, left: 0, right: 0, bottom: 0,
            backgroundColor: 'rgba(0,0,0,0.3)',
            justifyContent: 'center',
            alignItems: 'center',
            zIndex: 100,
          }}
        >
          <View
            style={{
              backgroundColor: '#fff',
              borderRadius: 12,
              padding: 24,
              width: '80%',
              alignItems: 'center',
            }}
          >
            <Text style={{ fontSize: 20, fontWeight: 'bold', marginBottom: 12 }}>Supprimer la vente ?</Text>
            <Text style={{ fontSize: 16, marginBottom: 24, textAlign: 'center' }}>
              Êtes-vous sûr de vouloir supprimer cette vente ?
            </Text>
            <View style={{ flexDirection: 'row', gap: 16 }}>
              <TouchableOpacity
                style={{ backgroundColor: '#e5e7eb', padding: 12, borderRadius: 8, minWidth: 80, alignItems: 'center' }}
                onPress={() => {
                  setShowDeleteModal(false);
                  setVenteToDelete(null);
                }}
              >
                <Text style={{ color: '#222', fontWeight: 'bold' }}>Annuler</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={{ backgroundColor: '#ef4444', padding: 12, borderRadius: 8, minWidth: 80, alignItems: 'center' }}
                onPress={async () => {
                  setShowDeleteModal(false);
                  await deleteVente(venteToDelete);
                  setVenteToDelete(null);
                }}
              >
                <Text style={{ color: '#fff', fontWeight: 'bold' }}>Supprimer</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      )}
      <Toast />
    </View>
  );
}