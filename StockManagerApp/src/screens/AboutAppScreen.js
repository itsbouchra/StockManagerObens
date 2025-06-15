import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import SupplierTopBar from '../components/SupplierTopBar';
import { useAuth } from '../context/AuthContext';
import { LogOut } from 'lucide-react-native';
import SupplierBottomNavBar from '../components/SupplierBottomNavBar';

const AboutAppScreen = ({ navigation }) => {
  const { logout, unreadNotificationsCount } = useAuth();

  const handleLogout = async () => {
    try {
      await logout();
      navigation.navigate('Login');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  return (
    <View style={styles.container}>
      <SupplierTopBar 
        title="À propos de Stoxify" 
        onGoBack={() => navigation.goBack()} 
        iconName="settings"
        active={true}
        notificationCount={unreadNotificationsCount}
      />
      <View style={styles.content}>
        <Text style={styles.title}>Bienvenue sur Stoxify !</Text>
        <Text style={styles.description}>
          Stoxify est votre solution ultime pour une gestion efficace des stocks.
          Simplifiez le suivi de vos stocks, gérez les achats et les ventes, et obtenez des informations
          précieuses sur la distribution de vos produits. Notre objectif est de simplifier
          vos opérations commerciales et d'accroître votre productivité.
        </Text>
        
        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <LogOut size={24} color="#FF3B30" style={styles.logoutIcon} />
          <Text style={styles.logoutText}>Déconnexion</Text>
        </TouchableOpacity>
      </View>
      <SupplierBottomNavBar
        navigation={navigation}
        currentRoute="AboutApp"
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f3f4f6',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 20,
    textAlign: 'center',
  },
  description: {
    fontSize: 16,
    color: '#555',
    textAlign: 'center',
    marginBottom: 40,
    lineHeight: 24,
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  logoutIcon: {
    marginRight: 10,
  },
  logoutText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FF3B30',
  },
});

export default AboutAppScreen; 