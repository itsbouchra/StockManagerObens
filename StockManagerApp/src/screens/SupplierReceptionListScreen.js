import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  ActivityIndicator,
  FlatList,
  StyleSheet,
  Image,
} from 'react-native';
import SupplierTopBar from '../components/SupplierTopBar';
import SupplierBottomNavBar from '../components/SupplierBottomNavBar';
import Toast from 'react-native-toast-message';

const API_BASE_URL = 'http://10.0.2.2:8080';

const SupplierReceptionListScreen = ({ route, navigation }) => {
  const { achat } = route.params;
  const [receptions, setReceptions] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchReceptions = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE_URL}/api/receptions/achat/${achat.idAchat}`);
      const data = await res.json();
      setReceptions(data);
    } catch (error) {
      console.error('Erreur lors de la récupération des livraisons:', error);
      Toast.show({
        type: 'error',
        text1: 'Erreur',
        text2: 'Impossible de charger les livraisons',
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReceptions();
  }, []);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#00cc99" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <SupplierTopBar
        title="Ventes"
        onSettingsPress={() => navigation.goBack()}
        onGoBack={() => navigation.goBack()}
        iconName="sell"
        active={true}
      />

      <Text style={styles.title}>
        Livraisons pour Vente #{achat.idAchat}
      </Text>

      <FlatList
        data={receptions}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={styles.listContainer}
        ListEmptyComponent={
          <Text style={styles.empty}>Aucune livraison trouvée pour cette vente.</Text>
        }
        renderItem={({ item }) => (
          <View style={styles.receptionCard}>
            <Image
              source={{ uri: `${API_BASE_URL}/images/${item.produit?.photo || 'placeholder.jpg'}` }}
              style={styles.image}
            />
            <View style={styles.info}>
              <Text style={styles.receptionId}>{item.produit?.nom}</Text>
              <Text style={styles.detail}>Date : {item.dateReception}</Text>
              {item.statut === 'Semi conforme' ? (
                <Text style={styles.detail}>
                  Quantité en stock : {item.quantiteConforme ?? 0} {item.produit?.unit}
                </Text>
              ) : (
                <Text style={styles.detail}>
                  Quantité : {item.quantite} {item.produit?.unit}
                </Text>
              )}
              <Text style={styles.detail}>
                Statut : <Text style={{ fontWeight: 'bold' }}>{item.statut ?? 'Non défini'}</Text>
              </Text>
              <Text style={styles.detail}>
                Lot : {item.refLot ?? 'Aucun'}
              </Text>
            </View>
          </View>
        )}
      />

      <SupplierBottomNavBar
        navigation={navigation}
        currentRoute="SupplierSell"
      />

      <Toast />
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
    backgroundColor: '#f3f4f6',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginVertical: 20,
    color: '#111827',
  },
  listContainer: {
    padding: 16,
    paddingBottom: 80,
  },
  receptionCard: {
    backgroundColor: '#f0f0f0',
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 1, height: 2 },
    shadowOpacity: 0.12,
    shadowRadius: 6,
    elevation: 4,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    flexDirection: 'row',
  },
  image: {
    width: 100,
    height: 100,
    borderRadius: 8,
    marginRight: 16,
  },
  info: {
    flex: 1,
  },
  receptionId: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#111827',
  },
  detail: {
    color: '#6b7280',
  },
  empty: {
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
    marginVertical: 20,
    color: '#6b7280',
  },
});

export default SupplierReceptionListScreen; 