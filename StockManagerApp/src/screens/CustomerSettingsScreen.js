import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert, ScrollView } from 'react-native';
import CustomerTopBar from '../components/CustomerTopBar';
import CustomerBottomNavBar from '../components/CustomerBottomNavBar';

const CustomerSettingsScreen = ({ navigation }) => {
  const handleLogout = () => {
    Alert.alert('Déconnexion', 'Voulez-vous vous déconnecter ?', [
      { text: 'Annuler', style: 'cancel' },
      {
        text: 'Se déconnecter',
        style: 'destructive',
        onPress: () => navigation.navigate('Login'),
      },
    ]);
  };

  return (
    <View style={styles.container}>
      {/* ✅ Barre du haut */}
      <CustomerTopBar
        title="Paramètres"
        active="settings"
        onGoBack={() => navigation.goBack()}
        onNotificationPress={() => navigation.navigate('CustomerNotificationsScreen')}
      />

      {/* ✅ Corps scrollable */}
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.title}>Paramètres du client</Text>

        <TouchableOpacity
          style={styles.option}
          onPress={() => navigation.navigate('CustomerInformationScreen')}
        >
          <Text style={styles.optionText}>Mes informations</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.option}
          onPress={() => navigation.navigate('CustomerNotificationsScreen')}
        >
          <Text style={styles.optionText}>Notifications</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <Text style={styles.logoutText}>Se déconnecter</Text>
        </TouchableOpacity>
      </ScrollView>

      {/* ✅ Barre du bas */}
      <CustomerBottomNavBar navigation={navigation} currentRoute="settings" />
    </View>
  );
};

export default CustomerSettingsScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9fafb',
  },
  content: {
    padding: 20,
    paddingBottom: 80, // pour ne pas masquer le contenu sous la barre
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 30,
    textAlign: 'center',
    color: '#1f2937',
  },
  option: {
    backgroundColor: '#e5e7eb',
    padding: 16,
    borderRadius: 10,
    marginBottom: 16,
  },
  optionText: {
    fontSize: 16,
    color: '#111827',
  },
  logoutButton: {
    marginTop: 40,
    padding: 16,
    backgroundColor: '#ef4444',
    borderRadius: 10,
    alignItems: 'center',
  },
  logoutText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});