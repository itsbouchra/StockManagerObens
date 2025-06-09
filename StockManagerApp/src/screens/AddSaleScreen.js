import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Alert,
} from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { ArrowLeft, DollarSign, Bell, Settings } from 'lucide-react-native';
import BottomNavBar from '../components/BottomNavBar';
import DateTimePicker from '@react-native-community/datetimepicker';
import Toast from 'react-native-toast-message';

const API_BASE_URL = 'http://10.0.2.2:8080';

export default function AddSaleScreen({ navigation }) {
  const [clients, setClients] = useState([]);
  const [client, setClient] = useState('');
  const [date, setDate] = useState('');
  const [statut, setStatut] = useState('en attente');
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [categorieSelected, setCategorieSelected] = useState('');
  const [produitSelected, setProduitSelected] = useState(null);
  const [categories, setCategories] = useState([]);
  const [loadingCategories, setLoadingCategories] = useState(true);
  const [produits, setProduits] = useState([]);
  const [pickerKey, setPickerKey] = useState(0);
  const [quantity1, setQuantity1] = useState('');
  const [price1, setPrice1] = useState('');
  const [lignes, setLignes] = useState([]);

  useEffect(() => {
    fetch(`${API_BASE_URL}/api/users`)
      .then(res => res.json())
      .then(data => setClients(data.filter(u => u.role === 'client')))
      .catch(() => Alert.alert('Erreur', 'Chargement clients impossible'));
  }, []);

  useEffect(() => {
    fetch(`${API_BASE_URL}/categories/all`)
      .then(res => res.json())
      .then(data => setCategories(Array.isArray(data) ? data : []))
      .catch(() => Alert.alert('Erreur', 'Erreur lors du chargement des catégories'))
      .finally(() => setLoadingCategories(false));
  }, []);

  useEffect(() => {
    if (categorieSelected) {
      fetch(`${API_BASE_URL}/produits/byCategorie/${categorieSelected}`)
        .then(res => res.json())
        .then(data => {
          if (Array.isArray(data)) {
            const produitsFormates = data.map(p => ({
              id: p.id,
              label: p.nom,
              value: p.id,
              prix: p.prix,
            }));
            setProduits(produitsFormates);
          } else {
            setProduits([]);
          }
        })
        .catch(err => {
          console.error(err);
          Toast.show({ type: 'error', text1: 'Erreur chargement produits' });
          setProduits([]);
        });
    } else {
      setProduits([]);
    }
    setProduitSelected(null);
  }, [categorieSelected]);

  const calcTotal = (q, p) => {
    const qt = parseFloat(q || '0');
    const pr = parseFloat(p || '0');
    return (qt * pr).toFixed(2);
  };

  const handleAddSale = async () => {
    const lignesToSend = [];
    if (produitSelected && quantity1 && price1) {
      lignesToSend.push({
        idProduit: produitSelected,
        quantite: Number(quantity1),
        prix: Number(price1),
        total: Number(quantity1) * Number(price1),
      });
    }

    if (lignesToSend.length === 0) {
      Alert.alert('Erreur', 'Veuillez remplir au moins une ligne produit.');
      return;
    }

    const montantTotal = lignesToSend.reduce((sum, l) => sum + l.total, 0);

    const vente = {
      dateVente: new Date(date).toISOString().split('T')[0],
      idClient: client,
      statut, // ✅ Valeur sélectionnée dans le Picker
      montantTotal,
      lignes: lignesToSend,
    };

    try {
      const response = await fetch(`${API_BASE_URL}/api/ventes`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(vente),
      });

      if (response.ok) {
        navigation.navigate('SalesListScreen', { refresh: true });
      } else {
        const errText = await response.text();
        Alert.alert('Erreur', 'Impossible d’ajouter la vente.\n' + errText);
      }
    } catch (err) {
      Alert.alert('Erreur réseau', 'Vérifie ta connexion ou ton backend.');
    }
  };

  return (
    <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={styles.container}>
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <ArrowLeft size={22} color="#fff" />
          </TouchableOpacity>
          <DollarSign size={22} color="#f5c518" />
          <Text style={styles.headerTitle}>Ventes</Text>
        </View>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
          <TouchableOpacity>
            <Bell size={20} color="#fff" />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => navigation.navigate('Settings')}>
            <Settings size={24} color="#fff" />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.scroll} keyboardShouldPersistTaps="handled">
        <Text style={styles.title}>Ajouter une vente</Text>

        <Text style={styles.label}>Client</Text>
        <View style={styles.dropdown}>
          <Picker selectedValue={client} onValueChange={setClient}>
            <Picker.Item label="Sélectionnez un client" value="" />
            {clients.map(c => (
              <Picker.Item key={c.id_user} label={c.username} value={c.id_user} />
            ))}
          </Picker>
        </View>

        <Text style={styles.label}>Date</Text>
        <TouchableOpacity onPress={() => setShowDatePicker(true)}>
          <TextInput
            placeholder="YYYY-MM-DD"
            style={styles.input}
            value={date}
            editable={false}
            pointerEvents="none"
          />
        </TouchableOpacity>
        {showDatePicker && (
          <DateTimePicker
            value={date ? new Date(date) : new Date()}
            mode="date"
            display="default"
            onChange={(event, selectedDate) => {
              setShowDatePicker(false);
              if (selectedDate) {
                const y = selectedDate.getFullYear();
                const m = String(selectedDate.getMonth() + 1).padStart(2, '0');
                const d = String(selectedDate.getDate()).padStart(2, '0');
                setDate(`${y}-${m}-${d}`);
              }
            }}
          />
        )}

        <Text style={styles.label}>Statut</Text>
        <View style={styles.dropdown}>
          <Picker selectedValue={statut} onValueChange={setStatut}>
            <Picker.Item label="en attente" value="en attente" />
            <Picker.Item label="confirmée" value="confirmée" />
            <Picker.Item label="annulée" value="annulée" />
          </Picker>
        </View>

        <Text style={styles.label}>Catégorie</Text>
        <View style={styles.dropdown}>
          <Picker
            selectedValue={categorieSelected}
            onValueChange={itemValue => {
              setCategorieSelected(Number(itemValue));
              setProduitSelected(null);
            }}
            enabled={!loadingCategories && categories.length > 0}
          >
            <Picker.Item label="Sélectionnez une catégorie" value="" />
            {categories.map(c => (
              <Picker.Item key={c.id_categorie} label={c.nom} value={c.id_categorie} />
            ))}
          </Picker>
        </View>

        <Text style={styles.label}>Produit</Text>
        <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 16 }}>
          <View style={[styles.dropdown, { flex: 1, marginBottom: 0 }]}>
            <Picker
              key={pickerKey}
              selectedValue={produitSelected}
              onValueChange={itemValue => {
                const selectedId = Number(itemValue);
                setProduitSelected(selectedId);
                const produitChoisi = produits.find(p => p.id === selectedId);
                if (produitChoisi) {
                  setPrice1(String(produitChoisi.prix));
                }
              }}
            >
              <Picker.Item label="Sélectionnez un produit" value="" />
              {produits.map(p => (
                <Picker.Item key={p.value} label={p.label} value={p.value} />
              ))}
            </Picker>
          </View>

          <TouchableOpacity
            onPress={() => {
              if (produitSelected !== null && produits.some(p => p.id === produitSelected)) {
                const produit = produits.find(p => p.id === produitSelected);
                setLignes([
                  ...lignes,
                  {
                    produit,
                    quantite: '',
                    prix: produit?.prix?.toString() || '',
                    total: 0,
                    key: `${produit.id}_${Date.now()}_${Math.random()}`,
                  },
                ]);
                setProduitSelected(null);
                setPickerKey(prev => prev + 1);
              } else {
                Toast.show({ type: 'error', text1: 'Sélectionnez un produit' });
              }
            }}
            style={styles.addCircleButton}
          >
            <Text style={styles.addCircleButtonText}>+</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.lineRow}>
          <Text style={styles.label}>P1</Text>
          <TextInput
            placeholder="Quantité"
            keyboardType="numeric"
            value={quantity1}
            onChangeText={setQuantity1}
            style={styles.smallInput}
          />
          <TextInput
            placeholder="Prix"
            keyboardType="numeric"
            value={price1}
            onChangeText={setPrice1}
            style={styles.smallInput}
          />
          <Text style={styles.totalBox}>{calcTotal(quantity1, price1)}</Text>
        </View>

        <TouchableOpacity style={styles.addButton} onPress={handleAddSale}>
          <Text style={styles.addButtonText}>+ Ajouter</Text>
        </TouchableOpacity>
      </ScrollView>

      <BottomNavBar navigation={navigation} currentRoute="SalesListScreen" />
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  scroll: { padding: 20, paddingBottom: 150 },
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
  headerTitle: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 20,
    fontFamily: 'serif',
    marginLeft: 6,
  },
  title: {
    textAlign: 'center',
    fontSize: 24,
    fontWeight: 'bold',
    marginVertical: 16,
    fontFamily: 'serif',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    backgroundColor: '#e5edd6',
    borderRadius: 10,
    paddingHorizontal: 10,
    paddingVertical: 8,
    marginBottom: 10,
  },
  dropdown: {
    borderColor: '#ccc',
    backgroundColor: '#e5edd6',
    borderRadius: 10,
    marginBottom: 12,
  },
  addCircleButton: {
    backgroundColor: '#f7f0a2',
    padding: 12,
    borderRadius: 10,
    marginLeft: 10,
  },
  addCircleButtonText: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  lineRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginTop: 10,
  },
  label: {
    fontWeight: 'bold',
    marginBottom: 4,
    color: '#444',
    flexShrink: 1,
    flexWrap: 'nowrap',
  },
  smallInput: {
    flex: 1,
    backgroundColor: '#f0f0f0',
    padding: 8,
    borderRadius: 8,
    textAlign: 'center',
  },
  totalBox: {
    flex: 1,
    backgroundColor: '#f0f0f0',
    padding: 8,
    borderRadius: 8,
    textAlign: 'center',
  },
  addButton: {
    marginTop: 20,
    backgroundColor: '#f9e18b',
    padding: 14,
    borderRadius: 12,
    alignItems: 'center',
  },
  addButtonText: {
    fontWeight: 'bold',
    fontSize: 16,
  },
});
