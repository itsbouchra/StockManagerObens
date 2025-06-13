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
import TopBar from '../components/TopBar';
import BottomNavBar from '../components/BottomNavBar';
import Toast from 'react-native-toast-message';
import { useAuth } from '../context/AuthContext';

const API_BASE_URL = 'http://10.0.2.2:8080';

const ReceptionListScreen = ({ navigation, route }) => {
  const { unreadNotificationsCount } = useAuth();
  const [receptions, setReceptions] = useState([]);
  const [loading, setLoading] = useState(true);
  const { achat } = route.params;
  const [refreshing, setRefreshing] = useState(false);

  const fetchReceptions = async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/api/receptions/achat/${achat.idAchat}`);
      const data = await res.json();
      setReceptions(data);
    } catch (error) {
      console.error('Erreur lors de la récupération des réceptions:', error);
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
      <TopBar
        title="Réceptions"
        onGoBack={() => navigation.goBack()}
        activeLeftIcon="stock"
        onNotificationPress={() => navigation.navigate('AdminNotifications')}
        notificationCount={unreadNotificationsCount}
        onSettingsPress={() => navigation.navigate('Settings')}
      />
      <Text style={styles.screenTitle}>Réceptions pour Achat #{achat.idAchat}</Text>
      <FlatList
        data={receptions}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={{ paddingBottom: 80 }}
        ListEmptyComponent={
          <Text style={styles.empty}>Aucune réception trouvée pour cet achat.</Text>
        }
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Image
              source={{
                uri: `${API_BASE_URL}/images/${item.produit?.photo || 'placeholder.jpg'}`,
              }}
              style={styles.image}
            />
            <View style={styles.info}>
              <Text style={styles.title}>{item.produit?.nom}</Text>
              <Text style={styles.detail}>Date : {item.dateReception}</Text>
              <Text style={styles.detail}>
                Quantité : {item.quantite} {item.produit?.unit}
              </Text>
              <Text style={styles.detail}>
                Statut :{' '}
                <Text style={{ fontWeight: 'bold' }}>
                  {item.statut ?? 'Non défini'}
                </Text>
              </Text>
              <Text style={styles.detail}>
                Lot : {item.refLot ?? 'Aucun'}
              </Text>
            </View>
          </View>
        )}
      />
      <BottomNavBar navigation={navigation} currentRoute="BuysScreen"/>
    </View>
  );
};

export default ReceptionListScreen;

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
});
