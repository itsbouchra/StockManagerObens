import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  ActivityIndicator,
  FlatList,
  TouchableOpacity,
  Linking,
  StyleSheet,
} from 'react-native';
import TopBar from '../components/TopBar';
import BottomNavBar from '../components/BottomNavBar';
import Toast from 'react-native-toast-message';
import { useAuth } from '../context/AuthContext';

const API_BASE_URL = 'http://10.0.2.2:8080';

const BuysScreen = ({ navigation, route }) => {
  const { unreadNotificationsCount } = useAuth();
  const [achats, setAchats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [achatToDelete, setAchatToDelete] = useState(null);

  const fetchAchats = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE_URL}/api/achats`);
      const data = await res.json();
      setAchats(data);
    } catch (error) {
      console.error('Error fetching achats:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAchats();
  }, []);

  useEffect(() => {
    if (route.params?.refresh) {
      fetchAchats();
    }
  }, [route.params?.refresh]);

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
        title="Achats"
        activeLeftIcon="BuysScreen"
        onGoBack={() => navigation.goBack()}
        onNotificationPress={() => navigation.navigate('AdminNotifications')}
        notificationCount={unreadNotificationsCount}
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
        Listes des Achats
      </Text>

      <FlatList
        data={achats}
        keyExtractor={(item) => item.idAchat.toString()}
        renderItem={({ item }) => (
          <TouchableOpacity
            onPress={() => navigation.navigate('ReceptionListScreen', { achat: item })}
            activeOpacity={0.7}
          >
            <View
              style={{
                padding: 18,
                backgroundColor: '#D3E3CE',
                marginBottom: 18,
                borderRadius: 16,
                marginHorizontal: 16,
                shadowColor: '#000',
                shadowOffset: { width: 1, height: 2 },
                shadowOpacity: 0.12,
                shadowRadius: 6,
                elevation: 4,
                borderWidth: 1,
                borderColor: '#e5e7eb',
                position: 'relative',
              }}
            >
              {/* Bouton + en haut à droite */}
              {item.statut !== 'Réceptionné' && (
                <TouchableOpacity
                  style={{
                    position: 'absolute',
                    top: 10,
                    right: 10,
                    backgroundColor: '#e6f4d7',
                    borderRadius: 19,
                    width: 40,
                    height: 40,
                    alignItems: 'center',
                    justifyContent: 'center',
                    borderWidth: 2,
                    borderColor: '#7e9a50',
                    shadowColor: '#ffd700',
                    shadowOffset: { width: 0, height: 2 },
                    shadowOpacity: 0.18,
                    shadowRadius: 6,
                    elevation: 6,
                    zIndex: 10,
                  }}
                  activeOpacity={0.85}
                  onPress={() => {
                    // Utilise la bonne clé 'lignes'
                    const produits = item.lignes || [];
                    navigation.navigate('AddReceptionScreen', { achat: item, produits });
                  }}
                >
                  <Text style={{
                    fontSize: 30,
                    color: '#7e9a50',
                    fontWeight: 'bold',
                    marginTop: -2,
                    textShadowColor: '#fffbe6',
                    textShadowOffset: { width: 0, height: 1 },
                    textShadowRadius: 2,
                  }}>+</Text>
                </TouchableOpacity>
              )}
              <Text style={{ fontSize: 20, fontWeight: 'bold', color: '#222', marginBottom: 8 }}>
                Achat #{item.idAchat}
              </Text>
              <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 4 }}>
                <Text style={{ fontWeight: 'bold', minWidth: 110, color: '#6b7280' }}>Date :</Text>
                <Text style={{ marginLeft: 8, color: '#374151' }}>{item.dateAchat}</Text>
              </View>
              <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 4 }}>
                <Text style={{ fontWeight: 'bold', minWidth: 110, color: '#6b7280' }}>Fournisseur :</Text>
                <Text style={{ marginLeft: 8, color: '#374151' }}>{item.nomFournisseur || '—'}</Text>
              </View>
              <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 4 }}>
                <Text style={{ fontWeight: 'bold', minWidth: 110, color: '#6b7280' }}>Statut :</Text>
                <View
                  style={{
                    marginLeft: 8,
                    borderWidth: 2,
                    borderColor: item.statut === 'Réceptionné' ? '#2563eb' : '#fde047',
                    backgroundColor: item.statut === 'Réceptionné' ? '#dbeafe' : '#fef9c3',
                    paddingHorizontal: 10, // smaller
                    paddingVertical: 3,    // smaller
                    borderRadius: 12,      // smaller
                    alignItems: 'center',
                    flexDirection: 'row',
                    minWidth: 80,          // smaller
                    justifyContent: 'center',
                  }}
                >
                  <Text
                    style={{
                      color: item.statut === 'Réceptionné' ? '#2563eb' : '#b45309',
                      fontWeight: 'bold',
                      fontSize: 13,        // smaller
                      letterSpacing: 0.5,
                      textAlign: 'center',
                      textTransform: 'uppercase',
                    }}
                  >
                    {item.statut === 'Réceptionné' ? 'Réceptionné' : 'En attente'}
                  </Text>
                </View>
              </View>
              <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 10 }}>
                <Text style={{ fontWeight: 'bold', minWidth: 110, color: '#6b7280' }}>Montant :</Text>
                <Text style={{ marginLeft: 8, color: '#374151' }}>{item.montantTotal} DH</Text>
              </View>
              <View style={{ flexDirection: 'row', justifyContent: 'flex-end', gap: 12 }}>
                {/* Edit Button */}
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
                  onPress={() => navigation.navigate('EditAchatScreen', { idAchat: item.idAchat })}
                >
                  <Text style={{ fontSize: 26, color: '#0ea5e9' }}>✏️</Text>
                </TouchableOpacity>
                {/* Delete Button */}
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
                    setAchatToDelete(item.idAchat);
                    setShowDeleteModal(true);
                  }}
                >
                  <Text style={{ fontSize: 26, color: '#dc2626' }}>🗑️</Text>
                </TouchableOpacity>
                {/* Print Button */}
                <TouchableOpacity
                  style={{
                    backgroundColor: '#fef9c3',
                    borderRadius: 22,
                    width: 44,
                    height: 44,
                    alignItems: 'center',
                    justifyContent: 'center',
                    borderWidth: 2,
                    borderColor: '#eab308',
                    shadowColor: '#eab308',
                    shadowOffset: { width: 0, height: 2 },
                    shadowOpacity: 0.25,
                    shadowRadius: 6,
                    elevation: 4,
                  }}
                  onPress={async () => {
                    const url = `${API_BASE_URL}/api/achats/${item.idAchat}/facture.pdf`;
                    console.log("Navigating to PDF viewer with URL:", url);
                    navigation.navigate('PdfViewerScreen', { pdfUrl: url });
                  }}
                >
                  <Text style={{ fontSize: 26, color: '#b45309' }}>🖨️</Text>
                </TouchableOpacity>
              </View>
            </View>
          </TouchableOpacity>
        )}
        contentContainerStyle={{ paddingBottom: 80, paddingTop: 10 }}
      />

      <TouchableOpacity
        style={{
          marginTop: 20,
          backgroundColor: '#ffd700',
          padding: 15,
          borderRadius: 10,
          alignItems: 'center',
          alignSelf: 'flex-end',
          marginHorizontal: 20,
          marginBottom: 10,
        }}
        onPress={() => navigation.navigate('AddOrderScreen')}
      >
        <Text style={{ fontSize: 16, fontWeight: 'bold' }}>+ Ajouter un achat</Text>
      </TouchableOpacity>

      <BottomNavBar navigation={navigation} currentRoute="BuysScreen" />

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
            <Text style={{ fontSize: 20, fontWeight: 'bold', marginBottom: 12 }}>Supprimer l'achat ?</Text>
            <Text style={{ fontSize: 16, marginBottom: 24, textAlign: 'center' }}>
              Êtes-vous sûr de vouloir supprimer cet achat ?
            </Text>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', width: '100%' }}>
              <TouchableOpacity
                style={{
                  flex: 1,
                  backgroundColor: '#ccc',
                  padding: 10,
                  borderRadius: 8,
                  marginRight: 8,
                  alignItems: 'center',
                }}
                onPress={() => setShowDeleteModal(false)}
              >
                <Text style={{ color: '#333', fontWeight: 'bold' }}>Annuler</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={{
                  flex: 1,
                  backgroundColor: '#f55',
                  padding: 10,
                  borderRadius: 8,
                  marginLeft: 8,
                  alignItems: 'center',
                }}
                onPress={async () => {
                  try {
                    const res = await fetch(`${API_BASE_URL}/api/achats/${achatToDelete}`, {
                      method: 'DELETE',
                    });
                    if (res.ok) {
                      setAchats(achats.filter(a => a.idAchat !== achatToDelete));
                      setShowDeleteModal(false);
                      Toast.show({
                        type: 'success',
                        text1: 'Succès',
                        text2: "L'achat a été supprimé avec succès 👋",
                      });
                    } else {
                      setShowDeleteModal(false);
                      Toast.show({
                        type: 'error',
                        text1: 'Erreur',
                        text2: "Erreur lors de la suppression ❌",
                      });
                    }
                  } catch (e) {
                    setShowDeleteModal(false);
                    Toast.show({
                      type: 'error',
                      text1: 'Erreur',
                      text2: "Erreur réseau ❌",
                    });
                  }
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
};

export default BuysScreen;
