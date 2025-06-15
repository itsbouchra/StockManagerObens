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
import Toast from 'react-native-toast-message';
import AsyncStorage from '@react-native-async-storage/async-storage';

const API_BASE_URL = 'http://10.0.2.2:8080/api';

const SupplierAccountInfoScreen = ({ navigation }) => {
  const { user, unreadNotificationsCount, fetchUnreadNotificationsCount, token, isLoading: authLoading } = useAuth();
  const [userData, setUserData] = useState({
    username: '',
    email: '',
    phone: '',
    role: 'fournisseur'
  });
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true); // Manage local loading state

  useEffect(() => {
    // Only proceed if AuthContext has finished loading and user is available
    if (!authLoading && user) {
      const loadUserData = async () => {
        try {
          setLoading(true);
          // Temporarily remove Authorization header for testing, as backend might not issue tokens.
          // A proper long-term solution requires backend token implementation.
          const response = await fetch(`${API_BASE_URL}/users/${user.id_user}`);
          
          if (!response.ok) {
            // Attempt to parse error as JSON, fallback to text
            const errorData = await response.json().catch(() => null);
            const errorMessage = errorData?.message || response.statusText || 'Failed to fetch user data';
            throw new Error(errorMessage);
          }

          const data = await response.json();
          
          setUserData({
            username: data.username || '',
            email: data.email || '',
            phone: data.telephone || '',
            role: data.role || 'fournisseur'
          });

          await fetchUnreadNotificationsCount(data.role, data.id_user);
        } catch (error) {
          console.error('Error fetching user data:', error);
          Toast.show({
            type: 'error',
            text1: 'Erreur',
            text2: `Échec du chargement: ${error.message}`,
          });
          // If there's an authentication error (e.g., 401 Unauthorized), navigate to Login
          if (error.message.includes('Unauthorized') || error.message.includes('Failed to fetch user data')) { // Adjust condition based on actual error messages if needed
            navigation.navigate('Login');
          }
        } finally {
          setLoading(false);
        }
      };

      loadUserData();
    } else if (!authLoading && !user) {
      // If authLoading is false but no user, navigate to login
      console.log('SupplierAccountInfoScreen: AuthContext finished loading, but no user. Navigating to Login.');
      navigation.navigate('Login');
    }
    // Initial screen loading state should reflect authLoading
    setLoading(authLoading);
  }, [user, navigation, authLoading]); // Removed 'token' from dependency array for this test

  const handleUpdate = async () => {
    setLoading(true);
    try {
      // Validate required fields
      if (!userData.username || !userData.email || !userData.phone) {
        Toast.show({
          type: 'error',
          text1: 'Erreur',
          text2: 'Veuillez remplir tous les champs obligatoires',
        });
        return;
      }

      // Validate email format
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(userData.email)) {
        Toast.show({
          type: 'error',
          text1: 'Erreur',
          text2: 'Format d\'email invalide',
        });
        return;
      }

      // Validate phone format (basic validation for French numbers)
      const phoneRegex = /^(?:(?:\+|00)33|0)\s*[1-9](?:[\s.-]*\d{2}){4}$/;
      if (!phoneRegex.test(userData.phone)) {
        Toast.show({
          type: 'error',
          text1: 'Erreur',
          text2: 'Format de numéro de téléphone invalide',
        });
        return;
      }

      // Temporarily remove Authorization header for testing update, as backend might not issue tokens.
      // A proper long-term solution requires backend token implementation.
      const response = await fetch(`${API_BASE_URL}/users/update`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...userData,
          id_user: user.id_user,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => null);
        throw new Error(errorData?.message || 'Échec de la mise à jour');
      }

      const updatedData = await response.json();
      
      // Update local state with new data
      setUserData(prevData => ({
        ...prevData,
        ...updatedData
      }));

      Toast.show({
        type: 'success',
        text1: 'Succès',
        text2: 'Informations mises à jour avec succès!',
      });
      setIsEditing(false);
    } catch (error) {
      console.error('Error updating user data:', error);
      Toast.show({
        type: 'error',
        text1: 'Erreur',
        text2: error.message || 'Échec de la mise à jour des informations',
      });
    } finally {
      setLoading(false);
    }
  };

  // Add a function to handle input changes
  const handleInputChange = (field, value) => {
    setUserData(prevData => ({
      ...prevData,
      [field]: value
    }));
  };

  // Add a function to handle edit mode
  const toggleEditMode = () => {
    if (isEditing) {
      // If canceling edit, reload original data
      loadUserData();
    }
    setIsEditing(!isEditing);
  };

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

  // Combine local loading state with authLoading for overall screen loading
  if (loading || authLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  // If authLoading is false and no user is found, navigate to login or show appropriate message
  if (!user && !authLoading) {
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
        title="Informations du Compte"
        onGoBack={() => navigation.goBack()}
        iconName="profile"
        active={true}
        notificationCount={unreadNotificationsCount}
      />

      <ScrollView contentContainerStyle={styles.scrollContent}>
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
  scrollContent: {
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
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f3f4f6',
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
  centeredContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f3f4f6',
  },
});

export default SupplierAccountInfoScreen; 