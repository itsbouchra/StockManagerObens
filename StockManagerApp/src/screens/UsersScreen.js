import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  FlatList,
  TouchableOpacity,
  Image,
} from 'react-native';
import {
  Search,
  Plus,
  ArrowLeft,
  Settings,
  Bell,
} from 'lucide-react-native';
import { useFocusEffect } from '@react-navigation/native';
import BottomNavBar from '../components/BottomNavBar';

export default function UsersScreen({ navigation }) {
  const [users, setUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRole, setSelectedRole] = useState('all');
  const API_BASE = 'http://10.0.2.2:8080/api/users';

  const fetchUsers = async () => {
    try {
      const res = await fetch(API_BASE);
      const data = await res.json();
      setUsers(data);
    } catch (err) {
      console.error('Erreur de chargement des utilisateurs', err);
    }
  };

  useFocusEffect(
    useCallback(() => {
      fetchUsers();
    }, [])
  );

  const filteredUsers = users.filter(user => {
    const matchRole = selectedRole === 'all' || user.role === selectedRole;
    const matchSearch = user.username.toLowerCase().includes(searchTerm.toLowerCase());
    return matchRole && matchSearch;
  });

  const renderUser = ({ item }) => (
    <TouchableOpacity
      style={styles.userItem}
      onPress={() => navigation.navigate('UserInfo', { user: item })}
    >
      <Image source={require('../assets/sophie.jpg')} style={styles.avatar} />
      <View style={styles.info}>
        <Text style={styles.name}>{item.username}</Text>
        <Text style={styles.phone}>{item.telephone}</Text>
      </View>
      
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      {/* En-tête */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.iconButton}>
            <ArrowLeft size={22} color="#fff" />
          </TouchableOpacity>
          <Settings size={25} color="#f5c518" />
          <Text style={styles.headerTitle}>Paramètres</Text>
        </View>
        <TouchableOpacity>
          <Bell size={20} color="#fff" />
        </TouchableOpacity>
      </View>

      <Text style={styles.title}>Utilisateurs</Text>

      {/* Recherche */}
      <View style={styles.searchBox}>
        <Search size={18} color="#888" />
        <TextInput
          style={styles.searchInput}
          placeholder="Rechercher"
          placeholderTextColor="#999"
          value={searchTerm}
          onChangeText={setSearchTerm}
        />
      </View>

      {/* Boutons de filtre par rôle */}
      <View style={styles.filterButtons}>
        {['all', 'admin', 'fournisseur', 'client'].map(role => (
          <TouchableOpacity
            key={role}
            style={[
              styles.filterBtn,
              selectedRole === role && styles.filterBtnActive,
            ]}
            onPress={() => setSelectedRole(role)}
          >
            <Text style={styles.filterBtnText}>
              {role === 'all'
                ? 'Tous'
                : role === 'fournisseur'
                ? 'Fournisseur'
                : role.charAt(0).toUpperCase() + role.slice(1)}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Liste des utilisateurs */}
      <FlatList
        data={filteredUsers}
        keyExtractor={(item) => item.id_user.toString()}
        renderItem={renderUser}
        contentContainerStyle={{ paddingBottom: 120 }}
      />

      {/* Bouton Ajouter */}
      <View style={styles.bottomSection}>
        <View style={styles.actionButtonsContainer}>
          <TouchableOpacity
            style={styles.actionButton}
            onPress={() => navigation.navigate('AddUserScreen')}
          >
            <Plus size={16} color="#333" />
            <Text style={styles.btnText}>Ajouter</Text>
          </TouchableOpacity>
        </View>
        <BottomNavBar navigation={navigation} currentRoute="Users" />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  header: {
    flexDirection: 'row',
    backgroundColor: '#7a8b2d',
    paddingVertical: 14,
    paddingHorizontal: 20,
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  headerLeft: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  headerTitle: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 20,
    fontFamily: 'serif',
  },
  iconButton: { marginRight: 8 },
  title: {
    textAlign: 'center',
    fontSize: 22,
    fontWeight: 'bold',
    marginTop: 20,
    fontFamily: 'serif',
    color: '#000',
  },
  searchBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f1f1f1',
    borderRadius: 10,
    paddingHorizontal: 10,
    marginHorizontal: 16,
    marginVertical: 10,
    height: 40,
  },
  searchInput: { flex: 1, padding: 8, marginLeft: 8, fontSize: 14 },
  filterButtons: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 12,
  },
  filterBtn: {
    backgroundColor: '#e1eed0',
    paddingVertical: 6,
    paddingHorizontal: 20,
    borderRadius: 20,
  },
  filterBtnActive: {
    backgroundColor: '#a0c27a',
  },
  filterBtnText: {
    color: '#333',
    fontWeight: 'bold',
  },
  userItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f9f9f9',
    marginHorizontal: 16,
    marginBottom: 8,
    borderRadius: 10,
    padding: 10,
    elevation: 1,
  },
  avatar: { width: 46, height: 46, borderRadius: 23, marginRight: 12 },
  info: { flex: 1 },
  name: { fontWeight: 'bold', fontSize: 14, color: '#111' },
  phone: { color: '#666', fontSize: 13 },
  options: { fontSize: 20, color: '#444' },
  actionButtonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingHorizontal: 16,
    paddingVertical: 10,
    backgroundColor: '#fff',
  },
  actionButton: {
    flexDirection: 'row',
    backgroundColor: '#fff59d',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: 90,
  },
  btnText: { marginLeft: 6, fontWeight: 'bold', color: '#333' },
  bottomSection: {
    position: 'absolute',
    bottom: 0,
    width: '100%',
    backgroundColor: '#fff',
  },
});
