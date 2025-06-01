import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
} from 'react-native';
import TopBar from '../components/TopBar';
import BottomNavBar from '../components/BottomNavBar';

const API_BASE_URL = 'http://10.0.2.2:8080';

const BuysScreen = ({ navigation }) => {
  const [achats, setAchats] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAchats = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/api/achats`);
        const data = await res.json();
        setAchats(data);
      } catch (error) {
        console.error('Error fetching achats:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchAchats();
  }, []);

  const renderItem = ({ item }) => (
    <View style={styles.card}>
      <Text style={styles.title}>Achat #{item.idAchat}</Text>
      <View style={styles.row}>
        <Text style={styles.label}>Date :</Text>
        <Text style={styles.value}>{item.dateAchat}</Text>
      </View>
      <View style={styles.row}>
        <Text style={styles.label}>Fournisseur :</Text>
        <Text style={styles.value}>{item.username}</Text>
      </View>
      <View style={styles.row}>
        <Text style={styles.label}>Statut :</Text>
        <Text style={styles.value}>{item.statut}</Text>
      </View>
      <View style={styles.row}>
        <Text style={styles.label}>Montant :</Text>
        <Text style={styles.value}>{item.montantTotal} DH</Text>
      </View>
      <View style={styles.actions}>
        <TouchableOpacity style={styles.edit}>
          <Text>✏️</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.delete}>
          <Text>🗑️</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.print}>
          <Text>🖨️</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <View style={{ flex: 1, backgroundColor: '#f3f4f6' }}>
      <TopBar
        title="Achats"
        active="BuysScreen"
        onGoBack={() => navigation.goBack()}
      />

      <Text style={styles.header}>Listes des Achats</Text>

      {loading ? (
        <ActivityIndicator size="large" color="#00cc99" style={{ marginTop: 40 }} />
      ) : (
        <FlatList
          data={achats}
          keyExtractor={(item) => item.idAchat.toString()}
          renderItem={renderItem}
          contentContainerStyle={{ paddingBottom: 80, paddingTop: 10, paddingHorizontal: 20 }}
        />
      )}

      <TouchableOpacity
        style={styles.addButton}
        onPress={() => navigation.navigate('AddOrderScreen')}
      >
        <Text style={styles.addText}>+ Ajouter un achat</Text>
      </TouchableOpacity>

      <BottomNavBar navigation={navigation} currentRoute="BuysScreen" />
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    fontSize: 28,
    fontWeight: 'bold',
    textAlign: 'center',
    marginVertical: 20,
    color: '#111827',
  },
  card: {
    padding: 15,
    backgroundColor: '#def1dd',
    marginBottom: 15,
    borderRadius: 10,
  },
  title: { fontSize: 18, fontWeight: 'bold' },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 2,
    marginBottom: 2,
  },
  label: {
    fontWeight: 'bold',
    minWidth: 110, // adjust as needed for alignment
    color: '#333',
  },
  value: {
    marginLeft: 8,
    color: '#222',
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: 10,
  },
  edit: {
    marginRight: 10,
    backgroundColor: '#ccc',
    padding: 5,
    borderRadius: 5,
  },
  delete: {
    marginRight: 10,
    backgroundColor: '#f55',
    padding: 5,
    borderRadius: 5,
  },
  print: {
    backgroundColor: '#ffd700',
    padding: 5,
    borderRadius: 5,
  },
  addButton: {
    marginTop: 20,
    backgroundColor: '#ffd700',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    alignSelf: 'flex-end', // Ajouté pour aligner à droite
    marginHorizontal: 20,
    marginBottom: 10, // Ajouté pour l'éloigner du BottomNavBar
  },
  addText: { fontSize: 16, fontWeight: 'bold' },
});

export default BuysScreen;
