// screens/CustomerInformationScreen.js

import React, { useEffect, useState } from 'react';
import {
  View, Text, StyleSheet, ScrollView, ActivityIndicator
} from 'react-native';
import { User, Mail, Phone, Lock } from 'lucide-react-native';
import CustomerTopBar from '../components/CustomerTopBar';
import CustomerBottomNavBar from '../components/CustomerBottomNavBar';
import AsyncStorage from '@react-native-async-storage/async-storage';

const CustomerInformationScreen = ({ navigation }) => {
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadUser = async () => {
      try {
        const stored = await AsyncStorage.getItem('userData');
        if (stored) {
          const parsed = JSON.parse(stored);
          setUserData(parsed);
        }
      } catch (err) {
        console.error('Erreur chargement données utilisateur:', err);
      } finally {
        setLoading(false);
      }
    };
    loadUser();
  }, []);

  const getInitial = (username) => {
    if (!username) return 'CL';
    return username.charAt(0).toUpperCase();
  };

  const infoItems = [
    { icon: <User size={24} color="#708238" />, label: "Nom d'utilisateur", value: userData?.username },
    { icon: <Mail size={24} color="#708238" />, label: 'Email', value: userData?.email },
    { icon: <Phone size={24} color="#708238" />, label: 'Téléphone', value: userData?.telephone },
    { icon: <Lock size={24} color="#708238" />, label: 'Rôle', value: userData?.role },
  ];

  if (loading) {
    return <View style={styles.center}><ActivityIndicator size="large" color="#708238" /></View>;
  }

  return (
    <View style={styles.container}>
     <CustomerTopBar
        title="Mes Informations"
        active="profile"
        onGoBack={() => navigation.goBack()}
        onNotificationPress={() => console.log('Notifications')}
        onSettingsPress={() => navigation.navigate('CustomerSettingsScreen')}
      />

      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.avatarContainer}>
          <View style={styles.avatarCircle}>
            <Text style={styles.avatarText}>{getInitial(userData?.username)}</Text>
          </View>
          <Text style={styles.name}>{userData?.username}</Text>
          <Text style={styles.role}>{userData?.role || 'client'}</Text>
        </View>

        <View style={styles.card}>
          {infoItems.map((item, index) => (
            <View key={index} style={styles.row}>
              <View style={styles.icon}>{item.icon}</View>
              <View style={styles.textBlock}>
                <Text style={styles.label}>{item.label}</Text>
                <Text style={styles.value}>{item.value || '-'}</Text>
              </View>
            </View>
          ))}
        </View>
      </ScrollView>

      <CustomerBottomNavBar navigation={navigation} currentRoute="CustomerProfileScreen" />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f3f4f6' },
  content: { paddingBottom: 80 },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  avatarContainer: {
    alignItems: 'center',
    padding: 24,
    backgroundColor: '#fff',
    marginBottom: 16,
  },
  avatarCircle: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#708238',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
  },
  avatarText: {
    color: 'white',
    fontSize: 34,
    fontWeight: 'bold',
  },
  name: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  role: {
    fontSize: 14,
    color: '#666',
  },
  card: {
    backgroundColor: '#fff',
    marginHorizontal: 16,
    borderRadius: 12,
    padding: 16,
    elevation: 2,
  },
  row: {
    flexDirection: 'row',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    alignItems: 'center',
  },
  icon: {
    marginRight: 12,
    backgroundColor: '#eef1d1',
    borderRadius: 20,
    padding: 6,
  },
  textBlock: {
    flex: 1,
  },
  label: {
    fontSize: 13,
    color: '#888',
  },
  value: {
    fontSize: 16,
    color: '#222',
    fontWeight: '600',
  },
});

export default CustomerInformationScreen;