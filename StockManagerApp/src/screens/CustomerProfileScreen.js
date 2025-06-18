import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { User, Bell, LogOut, ChevronRight } from 'lucide-react-native';
import CustomerTopBar from '../components/CustomerTopBar';
import CustomerBottomNavBar from '../components/CustomerBottomNavBar';
import { useAuth } from '../context/AuthContext';
import AsyncStorage from '@react-native-async-storage/async-storage';

const CustomerProfileScreen = ({ navigation }) => {
  const { logout } = useAuth();
  const [unreadNotifications, setUnreadNotifications] = useState(0);
  const [userData, setUserData] = useState({
    username: '',
    email: '',
    telephone: '',
    role: 'client'
  });

  useEffect(() => {
    const loadUserData = async () => {
      try {
        const storedUser = await AsyncStorage.getItem('userData');
        if (storedUser) {
          const parsed = JSON.parse(storedUser);
          setUserData({
            username: parsed.username || '',
            email: parsed.email || '',
            telephone: parsed.telephone || '',
            role: parsed.role || 'client'
          });
        }
      } catch (error) {
        console.error('Erreur chargement userData:', error);
      }
    };

    loadUserData();
  }, []);

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const stored = await AsyncStorage.getItem('notifications');
        if (stored) {
          const list = JSON.parse(stored);
          setUnreadNotifications(list.filter(n => !n.read).length);
        }
      } catch (err) {
        console.error('Erreur notifications:', err);
      }
    };

    const unsubscribe = navigation.addListener('focus', fetchNotifications);
    fetchNotifications();

    return unsubscribe;
  }, [navigation]);

  const handleLogout = async () => {
    try {
      await logout();
      navigation.navigate('Login');
    } catch (err) {
      console.error('Erreur logout:', err);
    }
  };

  const getInitials = (username) => {
    if (!username) return 'CL';
    return username
      .split(' ')
      .map(word => word[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <View style={styles.container}>
     <CustomerTopBar
  title="Mon Profil"
  active="profile"
  onGoBack={() => navigation.goBack()}
  onNotificationPress={() => navigation.navigate('CustomerNotificationsScreen')}
  onSettingsPress={() => navigation.navigate('CustomerSettingsScreen')}
/>


      <ScrollView style={styles.content}>
        <View style={styles.profileHeader}>
          <View style={styles.avatarPlaceholder}>
            <Text style={styles.avatarText}>{getInitials(userData.username)}</Text>
          </View>
          <Text style={styles.name}>{userData.username || 'Chargement...'}</Text>
          <Text style={styles.role}>{userData.role || 'Client'}</Text>
        </View>

        <View style={styles.section}>
          <TouchableOpacity
            style={styles.menuItem}
            onPress={() => navigation.navigate('CustomerInformationScreen')}

          >
            <View style={styles.menuItemContent}>
              <User size={24} color="#2e86de" />
              <Text style={styles.menuItemText}>Mes Informations</Text>
            </View>
            <ChevronRight size={24} color="#666" />
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.menuItem}
            onPress={() => navigation.navigate('CustomerNotificationsScreen')}

          >
            <View style={styles.menuItemContent}>
              <Bell size={24} color="#2e86de" />
              <Text style={styles.menuItemText}>Notifications</Text>
            </View>
            <Text style={styles.menuItemValue}>{unreadNotifications}</Text>
            <ChevronRight size={24} color="#666" />
          </TouchableOpacity>
        </View>

        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <LogOut size={24} color="#e74c3c" style={styles.logoutIcon} />
          <Text style={styles.logoutText}>Se déconnecter</Text>
        </TouchableOpacity>
      </ScrollView>

      <CustomerBottomNavBar navigation={navigation} currentRoute="CustomerProfileScreen" />

    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f3f4f6' },
  content: { flex: 1 },
  profileHeader: {
    alignItems: 'center',
    padding: 24,
    backgroundColor: 'white',
    marginBottom: 16,
    elevation: 3,
    shadowColor: '#000',
    shadowOpacity: 0.1,
  },
  avatarPlaceholder: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#2e86de',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
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
    marginBottom: 8,
  },
  section: {
    backgroundColor: 'white',
    marginBottom: 16,
    borderRadius: 12,
    marginHorizontal: 16,
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
    gap: 12,
  },
  menuItemText: {
    fontSize: 16,
    color: '#333',
  },
  menuItemValue: {
    fontSize: 14,
    color: '#666',
    fontWeight: 'bold',
    marginRight: 6,
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'white',
    borderRadius: 12,
    marginHorizontal: 16,
    padding: 16,
    marginTop: 24,
    elevation: 2,
  },
  logoutIcon: {
    marginRight: 12,
  },
  logoutText: {
    fontSize: 16,
    color: '#e74c3c',
    fontWeight: 'bold',
  },
});

export default CustomerProfileScreen;