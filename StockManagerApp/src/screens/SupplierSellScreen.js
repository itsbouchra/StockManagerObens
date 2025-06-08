import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  ActivityIndicator,
  FlatList,
  TouchableOpacity,
} from 'react-native';
import SupplierTopBar from '../components/SupplierTopBar';
import SupplierBottomNavBar from '../components/SupplierBottomNavBar';
import Toast from 'react-native-toast-message';

const API_BASE_URL = 'http://10.0.2.2:8080';

const SupplierSellScreen = ({ navigation, route }) => {
  const [achats, setAchats] = useState([]);
  const [loading, setLoading] = useState(true);

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

  const onReceptionPress = (achat) => {
    navigation.navigate('SupplierReceptionList', { achat });
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
      <SupplierTopBar
        title="Ventes"
        onSettingsPress={() => navigation.navigate('SupplierSettings')}
        iconName="sell"
        active={true}
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
        Liste des Ventes
      </Text>

      <FlatList
        data={achats}
        keyExtractor={(item) => item.idAchat.toString()}
        renderItem={({ item }) => (
          <TouchableOpacity
            onPress={() => onReceptionPress(item)}
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
              {/* {item.statut !== 'Réceptionné' && (
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
              )} */}
              <Text style={{ fontSize: 20, fontWeight: 'bold', color: '#222', marginBottom: 8 }}>
                Vente #{item.idAchat}
              </Text>
              <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 4 }}>
                <Text style={{ fontWeight: 'bold', minWidth: 110, color: '#6b7280' }}>Date :</Text>
                <Text style={{ marginLeft: 8, color: '#374151' }}>{item.dateAchat}</Text>
              </View>
              <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 4 }}>
                <Text style={{ fontWeight: 'bold', minWidth: 110, color: '#6b7280' }}>Statut :</Text>
                <View
                  style={{
                    marginLeft: 8,
                    borderWidth: 2,
                    borderColor: item.statut === 'Réceptionné' ? '#2563eb' : '#fde047',
                    backgroundColor: item.statut === 'Réceptionné' ? '#dbeafe' : '#fef9c3',
                    paddingHorizontal: 10,
                    paddingVertical: 3,
                    borderRadius: 12,
                    alignItems: 'center',
                    flexDirection: 'row',
                    minWidth: 80,
                    justifyContent: 'center',
                  }}
                >
                  <Text
                    style={{
                      color: item.statut === 'Réceptionné' ? '#2563eb' : '#b45309',
                      fontWeight: 'bold',
                      fontSize: 13,
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
              <View style={{ flexDirection: 'row', justifyContent: 'flex-end' }}>
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
                    navigation.navigate('SupplierPdfViewerScreen', { pdfUrl: url });
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

      <SupplierBottomNavBar 
        navigation={navigation} 
        currentRoute="SupplierSell"
      />
      <Toast />
    </View>
  );
};

export default SupplierSellScreen; 