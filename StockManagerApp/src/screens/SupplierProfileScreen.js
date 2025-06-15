import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, ActivityIndicator } from 'react-native';
import { User, Bell, LogOut, ChevronRight, Phone } from 'lucide-react-native';
import SupplierTopBar from '../components/SupplierTopBar';
import SupplierBottomNavBar from '../components/SupplierBottomNavBar';
import { useAuth } from '../context/AuthContext';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Toast from 'react-native-toast-message';

const SupplierProfileScreen = ({ navigation }) => {
  const { user, logout, isLoading, unreadNotificationsCount } = useAuth();
  const [unreadNotifications, setUnreadNotifications] = useState(0);
  const [userData, setUserData] = useState({
    username: '',
    email: '',
    telephone: '',
    role: 'fournisseur' // Default role
  });
  const [loading, setLoading] = useState(true);
  const API_BASE_URL = 'http://10.0.2.2:8080';

  useEffect(() => {
    const loadUserData = async () => {
      try {
        const storedUser = await AsyncStorage.getItem('userData');
        if (storedUser) {
          const parsedData = JSON.parse(storedUser);
          setUserData({
            username: parsedData.username || '',
            email: parsedData.email || '',
            telephone: parsedData.telephone || '',
            role: parsedData.role || 'fournisseur'
          });
        }
      } catch (error) {
        console.error('Error loading user data:', error);
      }
    };

    loadUserData();
  }, []); // Run once on mount

  useEffect(() => {
    const loadUnreadNotifications = async () => {
      try {
        const storedNotifications = await AsyncStorage.getItem('notifications');
        if (storedNotifications) {
          const notifications = JSON.parse(storedNotifications);
          const unreadCount = notifications.filter(n => !n.read).length;
          setUnreadNotifications(unreadCount);
        }
      } catch (error) {
        console.error('Error loading unread notifications:', error);
      }
    };

    const unsubscribe = navigation.addListener('focus', () => {
      loadUnreadNotifications();
    });

    loadUnreadNotifications(); 

    return unsubscribe;
  }, [navigation]);

  const handleSettingsPress = () => {
    navigation.navigate('SupplierSettings');
  };

  const handleLogout = async () => {
    try {
      await logout();
      navigation.navigate('Login');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  // Function to get initials from username
  const getInitials = (username) => {
    if (!username) return 'SP';
    return username
      .split(' ')
      .map(word => word[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <View style={styles.container}>
      <SupplierTopBar 
        title="Profil" 
        onSettingsPress={handleSettingsPress}
        onGoBack={() => navigation.goBack()}
        iconName="profile"
        active={true}
        notificationCount={unreadNotificationsCount}
      />
      
      <ScrollView style={styles.content}>
        <View style={styles.profileHeader}>
          <View style={styles.avatarPlaceholder}>
            <Text style={styles.avatarText}>{getInitials(userData.username)}</Text>
          </View>
          <Text style={styles.name}>{userData.username || 'Chargement...'}</Text>
          <Text style={styles.role}>{userData.role || 'Fournisseur'}</Text>
        </View>

        <View style={styles.section}>
          <TouchableOpacity 
            style={styles.menuItem}
            onPress={() => navigation.navigate('SupplierAccountInfo')}
          >
            <View style={styles.menuItemContent}>
              <User size={24} color="#708238" style={styles.menuIcon} />
              <Text style={styles.menuItemText}>Informations du Compte</Text>
            </View>
            <ChevronRight size={24} color="#666" />
          </TouchableOpacity>
          
          <TouchableOpacity
            style={styles.menuItem}
            onPress={() => navigation.navigate('SupplierNotifications')}
          >
            <View style={styles.menuItemContent}>
              <View style={styles.menuItemLeft}>
                <Bell size={24} color="#708238" />
                <Text style={styles.menuItemText}>
                  Notifications{unreadNotifications > 0 ? ` ${unreadNotifications}` : ''}
                </Text>
              </View>
            </View>
            
            <ChevronRight size={24} color="#666" />
          </TouchableOpacity>
        </View>

        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <LogOut size={24} color="#FF3B30" style={styles.logoutIcon} />
          <Text style={styles.logoutText}>Déconnexion</Text>
        </TouchableOpacity>
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
  email: {
    fontSize: 16,
    color: '#666',
    marginBottom: 8,
  },
  phoneContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
  },
  phoneIcon: {
    marginRight: 6,
  },
  phoneText: {
    fontSize: 16,
    color: '#666',
  },
  role: {
    fontSize: 16,
    color: '#666',
    marginBottom: 8,
  },
  section: {
    backgroundColor: 'white',
    marginBottom: 16,
    borderRadius: 12,
    marginHorizontal: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  menuItem: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  menuItemContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  menuIcon: {
    marginRight: 12,
  },
  menuItemText: {
    fontSize: 16,
    color: '#333',
  },
  menuItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  menuItemValue: {
    fontSize: 16,
    color: '#666',
    fontWeight: 'bold',
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
    justifyContent: 'center',
    alignSelf: 'center',
    width: '90%',
    marginVertical: 20,
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

export default SupplierProfileScreen; 