import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { ArrowLeft, Bell, Settings, Home, User, ClipboardList } from 'lucide-react-native';
import CustomerBottomNavBar from '../components/CustomerBottomNavBar';
import CustomerTopBar from '../components/CustomerTopBar';


const CustomerDashboard = () => {
  const navigation = useNavigation();

  return (
    <View style={{ flex: 1, backgroundColor: '#f3f4f6' }}>
      
      {/* Header personnalisé */}
    <CustomerTopBar
        title="Tableau de bord"
        active="home"
        onGoBack={() => navigation.goBack()}
        onNotificationPress={() => console.log('Notifications')}
        onSettingsPress={() => navigation.navigate('CustomerSettingsScreen')}
      />

      {/* Content */}
      <View style={styles.content}>
        <TouchableOpacity
          style={[styles.button, styles.profilButton]}
          onPress={() => navigation.navigate('CustomerProfileScreen')}
        >
          <Text style={styles.buttonText}>Profil</Text>
          <User size={24} color="#fff" />
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.button, styles.ordersButton]}
          onPress={() => navigation.navigate('CustomerOrderScreen')
}
        >
          <Text style={styles.buttonText}>Orders</Text>
          <ClipboardList size={24} color="#fff" />
        </TouchableOpacity>
      </View>

      {/* Bottom Nav */}
      <CustomerBottomNavBar navigation={navigation} currentRoute="CustomerDashboard" />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#708238',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomLeftRadius: 14,
    borderBottomRightRadius: 14,
  },
  title: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
    fontFamily: 'serif',
  },
  rightIcons: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  content: {
    flex: 1,
    padding: 24,
    justifyContent: 'center',
    gap: 24,
  },
  button: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderRadius: 16,
    paddingVertical: 18,
    paddingHorizontal: 24,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 4,
  },
  profilButton: {
    backgroundColor: '#E1B12C',
  },
  ordersButton: {
    backgroundColor: '#A5CBA5',
  },
  buttonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
  },
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
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  headerTitle: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 20,
    fontFamily: 'serif',
    marginLeft: 6,
  },
});

export default CustomerDashboard;