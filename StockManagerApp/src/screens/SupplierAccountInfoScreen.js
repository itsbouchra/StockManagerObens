import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import { User, Phone, Mail, Lock } from 'lucide-react-native';
import SupplierTopBar from '../components/SupplierTopBar';
import SupplierBottomNavBar from '../components/SupplierBottomNavBar';
import { useAuth } from '../context/AuthContext';

const SupplierAccountInfoScreen = ({ navigation }) => {
  const { user, isLoading } = useAuth();
  const [userData, setUserData] = useState({
    username: '',
    email: '',
    phone: '',
    role: 'fournisseur'
  });

  useEffect(() => {
    if (user) {
      console.log('SupplierAccountInfoScreen: user object from AuthContext:', user);
      setUserData({
        username: user.username || '',
        email: user.email || '',
        phone: user.telephone || '',
        role: user.role || 'fournisseur'
      });
    } else if (!isLoading && !user) {
      console.log('SupplierAccountInfoScreen: User not logged in, isLoading is false.');
    }
  }, [user, isLoading]);

  const infoItems = [
    {
      icon: <User size={24} color="#708238" />,
      label: "Nom d'utilisateur",
      value: userData.username || 'Chargement...'
    },
    {
      icon: <Mail size={24} color="#708238" />,
      label: 'Email',
      value: userData.email || 'Chargement...'
    },
    {
      icon: <Phone size={24} color="#708238" />,
      label: 'Téléphone',
      value: userData.phone || 'Chargement...'
    },
    {
      icon: <Lock size={24} color="#708238" />,
      label: 'Rôle',
      value: userData.role || 'Chargement...'
    }
  ];

  if (isLoading) {
    return (
      <View style={styles.centeredContainer}>
        <ActivityIndicator size="large" color="#708238" />
        <Text style={styles.loadingText}>Chargement des informations du compte...</Text>
      </View>
    );
  }

  if (!user && !isLoading) {
    return (
      <View style={styles.centeredContainer}>
        <Text style={styles.errorText}>Impossible de charger les informations de l'utilisateur. Veuillez vous connecter.</Text>
        <TouchableOpacity style={styles.loginButton} onPress={() => navigation.navigate('Login')}>
          <Text style={styles.loginButtonText}>Se connecter</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <SupplierTopBar 
        title="Informations du compte" 
        onSettingsPress={() => navigation.goBack()}
        onGoBack={() => navigation.goBack()}
        iconName="profile"
        active={true}
      />
      
      <ScrollView style={styles.content}>
        <View style={styles.profileHeader}>
          <View style={styles.avatarPlaceholder}>
            <Text style={styles.avatarText}>
              {userData.username ? userData.username.charAt(0).toUpperCase() : 'F'}
            </Text>
          </View>
          <Text style={styles.name}>{userData.username || 'Chargement...'}</Text>
          <Text style={styles.role}>{(userData.role === 'fournisseur' ? 'Fournisseur' : userData.role) || 'N/A'}</Text>
        </View>

        <View style={styles.infoSection}>
          {infoItems.map((item, index) => (
            <View key={index} style={styles.infoItem}>
              <View style={styles.infoIconContainer}>
                {item.icon}
              </View>
              <View style={styles.infoContent}>
                <Text style={styles.infoLabel}>{item.label}</Text>
                <Text style={styles.infoValue}>{item.value}</Text>
              </View>
            </View>
          ))}
        </View>
      </ScrollView>

      <SupplierBottomNavBar 
        navigation={navigation} 
        currentRoute="SupplierProfile"
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
  },
  profileHeader: {
    alignItems: 'center',
    padding: 24,
    backgroundColor: 'white',
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  avatarPlaceholder: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#708238',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
  avatarText: {
    color: 'white',
    fontSize: 36,
    fontWeight: 'bold',
  },
  name: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  role: {
    fontSize: 16,
    color: '#666',
  },
  infoSection: {
    backgroundColor: 'white',
    marginHorizontal: 16,
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  infoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  infoIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#f5f5f5',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  infoContent: {
    flex: 1,
  },
  infoLabel: {
    fontSize: 14,
    color: '#666',
    marginBottom: 2,
  },
  infoValue: {
    fontSize: 16,
    color: '#333',
    fontWeight: '500',
  },
  centeredContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f3f4f6',
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: '#666',
  },
  errorText: {
    fontSize: 18,
    color: 'red',
    marginBottom: 20,
  },
  loginButton: {
    backgroundColor: '#708238',
    paddingVertical: 12,
    paddingHorizontal: 25,
    borderRadius: 10,
  },
  loginButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default SupplierAccountInfoScreen; 