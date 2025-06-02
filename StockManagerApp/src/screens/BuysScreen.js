import React, { useEffect, useState } from 'react';
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

const API_BASE_URL = 'http://10.0.2.2:8080';

const BuysScreen = ({ navigation, route }) => {
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
        active="BuysScreen"
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
        Listes des Achats
      </Text>

      <FlatList
        data={achats}
        keyExtractor={(item) => item.idAchat.toString()}
        renderItem={({ item }) => (
          <View
            style={{
              padding: 15,
              backgroundColor: '#def1dd',
              marginBottom: 15,
              borderRadius: 10,
              marginHorizontal: 16,
            }}
          >
            <Text style={{ fontSize: 18, fontWeight: 'bold' }}>Achat #{item.idAchat}</Text>
            <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 2, marginBottom: 2 }}>
              <Text style={{ fontWeight: 'bold', minWidth: 110, color: '#333' }}>Date :</Text>
              <Text style={{ marginLeft: 8, color: '#222' }}>{item.dateAchat}</Text>
            </View>
            <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 2, marginBottom: 2 }}>
              <Text style={{ fontWeight: 'bold', minWidth: 110, color: '#333' }}>Fournisseur :</Text>
              <Text style={{ marginLeft: 8, color: '#222' }}>{item.nomFournisseur || '—'}</Text>
            </View>
            <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 2, marginBottom: 2 }}>
              <Text style={{ fontWeight: 'bold', minWidth: 110, color: '#333' }}>Statut :</Text>
              <Text style={{ marginLeft: 8, color: '#222' }}>{item.statut}</Text>
            </View>
            <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 2, marginBottom: 2 }}>
              <Text style={{ fontWeight: 'bold', minWidth: 110, color: '#333' }}>Montant :</Text>
              <Text style={{ marginLeft: 8, color: '#222' }}>{item.montantTotal} DH</Text>
            </View>
            <View style={{ flexDirection: 'row', justifyContent: 'flex-end', marginTop: 10 }}>
              <TouchableOpacity
                style={{ marginRight: 10, backgroundColor: '#ccc', padding: 5, borderRadius: 5 }}
                onPress={() => navigation.navigate('EditAchatScreen', { idAchat: item.idAchat })}
              >
                <Text>✏️</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={{ marginRight: 10, backgroundColor: '#f55', padding: 5, borderRadius: 5 }}
                onPress={() => {
                  setAchatToDelete(item.idAchat);
                  setShowDeleteModal(true);
                }}
              >
                <Text>🗑️</Text>
              </TouchableOpacity>
              <TouchableOpacity style={{ backgroundColor: '#ffd700', padding: 5, borderRadius: 5 }}>
                <Text>🖨️</Text>
              </TouchableOpacity>
            </View>
          </View>
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
