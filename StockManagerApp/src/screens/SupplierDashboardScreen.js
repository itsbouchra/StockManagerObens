import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, ActivityIndicator } from 'react-native';
import SupplierTopBar from '../components/SupplierTopBar';
import SupplierBottomNavBar from '../components/SupplierBottomNavBar';
import StatCard from '../components/StatCard';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  DollarSign,
  CheckCircle,
  XCircle,
  AlertCircle,
  Home
} from 'lucide-react-native';

const API_BASE_URL = 'http://10.0.2.2:8080';
const PRIMARY_COLOR = '#708238';
const ACCENT_COLOR = '#E1B12C';
const LIGHT_GRAY = '#E0E0E0';
const DARK_GRAY = '#4A444A';
const LIGHT_GREEN = '#A8BDA0';
const LIGHT_YELLOW = '#FFF4B1';

const SupplierDashboardScreen = ({ navigation }) => {
  const [userName, setUserName] = useState('Utilisateur');
  const [stats, setStats] = useState({
    totalSells: 0,
    conformeDeliveries: 0,
    nonConformeDeliveries: 0,
    semiConformeDeliveries: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserDataAndStats = async () => {
      try {
        // Fetch user data
        const userData = await AsyncStorage.getItem('userData');
        if (userData) {
          const user = JSON.parse(userData);
          setUserName(user.username || 'Utilisateur');
        }

        // Fetch statistics
        // NOTE: These API endpoints are assumptions. You might need to adjust them
        // to your actual backend endpoints for fetching supplier-specific statistics.
        console.log('Fetching total sells from:', `${API_BASE_URL}/api/achats/count`);
        console.log('Fetching conforme deliveries from:', `${API_BASE_URL}/api/receptions/count?statut=Conforme`);
        console.log('Fetching non-conforme deliveries from:', `${API_BASE_URL}/api/receptions/count?statut=Non-Conforme`);
        console.log('Fetching semi-conforme deliveries from:', `${API_BASE_URL}/api/receptions/count?statut=Semi-Conforme`);

        const [sellsRes, conformeRes, nonConformeRes, semiConformeRes] = await Promise.all([
          fetch(`${API_BASE_URL}/api/achats/count`), // Assuming 'achats' are now 'ventes'
          fetch(`${API_BASE_URL}/api/receptions/count?statut=Conforme`),
          fetch(`${API_BASE_URL}/api/receptions/count?statut=Non-Conforme`),
          fetch(`${API_BASE_URL}/api/receptions/count?statut=Semi-Conforme`),
        ]);

        const sellsCount = await sellsRes.json();
        const conformeCount = await conformeRes.json();
        const nonConformeCount = await nonConformeRes.json();
        const semiConformeCount = await semiConformeRes.json();

        console.log('Total sells count:', sellsCount);
        console.log('Conforme deliveries count:', conformeCount);
        console.log('Non-conforme deliveries count:', nonConformeCount);
        console.log('Semi-conforme deliveries count:', semiConformeCount);

        setStats({
          totalSells: sellsCount || 0,
          conformeDeliveries: conformeCount || 0,
          nonConformeDeliveries: nonConformeCount || 0,
          semiConformeDeliveries: semiConformeCount || 0,
        });

      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserDataAndStats();
  }, []);

  const handleSettingsPress = () => {
    navigation.navigate('SupplierSettings');
  };

  return (
    <View style={styles.container}>
      <SupplierTopBar
        title="Tableau de bord"
        onSettingsPress={handleSettingsPress}
        iconName="home"
        active={true}
      />

      <ScrollView style={styles.content}>
        <View style={styles.welcomeContainer}>
          <Text style={styles.welcomeText}>Bonjour {userName},</Text>
          <Text style={styles.welcomeSubtitle}>Bienvenue chez <Text style={styles.stoxityText}>STOXIFY</Text></Text>
        </View>

        {loading ? (
          <ActivityIndicator size="large" color={PRIMARY_COLOR} style={styles.loadingIndicator} />
        ) : (
          <View style={styles.statsContainer}>
            <StatCard
              label="Ventes totales"
              value={stats.totalSells.toString()}
              bgColor={PRIMARY_COLOR}
              iconName="dollar-sign"
              style={styles.statCard}
            />
            <StatCard
              label="Livraisons conformes"
              value={stats.conformeDeliveries.toString()}
              bgColor={LIGHT_GREEN}
              iconName="check-circle"
              style={styles.statCard}
            />
            <StatCard
              label="Livraisons non conformes"
              value={stats.nonConformeDeliveries.toString()}
              bgColor={DARK_GRAY}
              iconName="x-circle"
              style={styles.statCard}
            />
            <StatCard
              label="Livraisons semi-conformes"
              value={stats.semiConformeDeliveries.toString()}
              bgColor={ACCENT_COLOR}
              iconName="alert-circle"
              style={styles.statCard}
            />
          </View>
        )}

        {/* <View style={styles.section}>
          <Text style={styles.sectionTitle}>Activités récentes</Text>
          
        </View> */}
      </ScrollView>

      <SupplierBottomNavBar
        navigation={navigation}
        currentRoute="SupplierDashboard"
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: LIGHT_GRAY,
  },
  content: {
    flex: 1,
    padding: 16,
  },
  loadingIndicator: {
    marginTop: 50,
  },
  welcomeContainer: {
    marginBottom: 40,
    alignItems: 'center',
  },
  welcomeText: {
    fontSize: 30,
    fontWeight: 'bold',
    color: DARK_GRAY,
    marginBottom: 8,
  },
  welcomeSubtitle: {
    fontSize: 20,
    color: PRIMARY_COLOR,
    fontWeight: '600',
  },
  stoxityText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: ACCENT_COLOR,
    textTransform: 'uppercase',
    fontStyle: 'italic',
  },
  statsContainer: {
    flexDirection: 'column',
    justifyContent: 'flex-start',
    marginBottom: 20,
  },
  statCard: {
    width: '100%',
    marginBottom: 24,
    paddingVertical: 20,
    paddingHorizontal: 16,
  },
  section: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 12,
    color: DARK_GRAY,
  },
});

export default SupplierDashboardScreen; 