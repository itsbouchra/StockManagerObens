import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  ActivityIndicator,
} from 'react-native';
import Toast from 'react-native-toast-message';
import TopBar from '../components/TopBar';
import BottomNavBar from '../components/BottomNavBar';
import { Picker } from '@react-native-picker/picker';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Ionicons } from '@expo/vector-icons'; // ou 'react-native-vector-icons/Ionicons'

const API_BASE_URL = 'http://10.0.2.2:8080';

const AddOrderScreen = ({ navigation }) => {
  // Données fournisseurs, catégories, produits
  const [fournisseurs, setFournisseurs] = useState([]);
  const [loadingFournisseurs, setLoadingFournisseurs] = useState(true);
  const [categories, setCategories] = useState([]);
  const [loadingCategories, setLoadingCategories] = useState(true);
  const [produits, setProduits] = useState([]);

  // Sélections
  const [fournisseurSelected, setFournisseurSelected] = useState(null);
  const [categorieSelected, setCategorieSelected] = useState(null);
  const [produitSelected, setProduitSelected] = useState("");
  const [date, setDate] = useState('');
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [pickerKey, setPickerKey] = useState(0);

  // Liste des lignes produits ajoutées
  const [lignes, setLignes] = useState([]);

  // Fetch fournisseurs
  useEffect(() => {
    let isMounted = true;
    setLoadingFournisseurs(true);
    fetch(`${API_BASE_URL}/api/users`)
      .then(res => res.json())
      .then(data => {
        if (!isMounted) return;
        const fournisseurs = Array.isArray(data)
          ? data.filter(u => u.role === 'fournisseur')
          : [];
        setFournisseurs(fournisseurs);
      })
      .catch((err) => {
        Toast.show({ type: 'error', text1: 'Erreur chargement fournisseurs', text2: err.message });
      })
      .finally(() => {
        if (isMounted) setLoadingFournisseurs(false);
      });
    return () => { isMounted = false; };
  }, []);

  // Fetch catégories
  useEffect(() => {
    setLoadingCategories(true);
    fetch(`${API_BASE_URL}/categories/all`)
      .then(res => res.json())
      .then(data => setCategories(Array.isArray(data) ? data : []))
      .catch(() => Toast.show({ type: 'error', text1: 'Erreur chargement catégories' }))
      .finally(() => setLoadingCategories(false));
  }, []);

  // Quand catégorie change, fetch produits associés
  useEffect(() => {
    if (!categorieSelected) {
      setProduits([]);
      setProduitSelected(null);
      return;
    }
    fetch(`${API_BASE_URL}/produits/byCategorie/${categorieSelected}`)
      .then(res => res.json())
      .then(data => setProduits(Array.isArray(data) ? data : []))
      .catch(() => Toast.show({ type: 'error', text1: 'Erreur chargement produits' }));
  }, [categorieSelected]);

  // Total général
  const totalGeneral = lignes.reduce((sum, l) => sum + (Number(l.total) || 0), 0);

  return (
    <View style={{ flex: 1, backgroundColor: '#f3f4f6' }}>
      <TopBar
        title="Achats"
        onGoBack={() => navigation.goBack()}
      />
      <ScrollView contentContainerStyle={{ padding: 16, paddingBottom: 80 }}>
        <Text style={styles.pageTitle}>Ajouter Achat</Text>

        {/* Fournisseur */}
        <Text style={styles.label}>Fournisseur *</Text>
        <View style={styles.dropdown}>
          <Picker
            selectedValue={fournisseurSelected}
            onValueChange={itemValue => setFournisseurSelected(itemValue)}
            enabled={!loadingFournisseurs && fournisseurs.length > 0}
          >
            <Picker.Item label="Sélectionnez un fournisseur" value={undefined} />
            {fournisseurs.map(f => (
              <Picker.Item key={f.id_user} label={f.username} value={f.id_user} />
            ))}
          </Picker>
        </View>

        {/* Date */}
        <Text style={styles.label}>Date *</Text>
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
                // Format YYYY-MM-DD
                const y = selectedDate.getFullYear();
                const m = String(selectedDate.getMonth() + 1).padStart(2, '0');
                const d = String(selectedDate.getDate()).padStart(2, '0');
                setDate(`${y}-${m}-${d}`);
              }
            }}
          />
        )}

        {/* Catégorie */}
        <Text style={styles.label}>Catégorie *</Text>
        <View style={styles.dropdown}>
          <Picker
            selectedValue={categorieSelected}
            onValueChange={itemValue => {
              setCategorieSelected(itemValue);
              setProduitSelected(null);
              // Do NOT clear lignes here!
            }}
            enabled={!loadingCategories && categories.length > 0}
          >
            <Picker.Item label="Sélectionnez une catégorie" value={null} />
            {categories.map(c => (
              <Picker.Item key={c.id_categorie} label={c.nom} value={c.id_categorie} />
            ))}
          </Picker>
        </View>

        {/* Produit + bouton + */}
        <Text style={styles.label}>Produit *</Text>
        <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 16 }}>
          <View style={[styles.dropdown, { flex: 1, marginBottom: 0 }]}>
            <Picker
              key={pickerKey}
              selectedValue={produitSelected}
              onValueChange={itemValue => setProduitSelected(itemValue)}
              enabled={produits.length > 0}
            >
              <Picker.Item label="Sélectionnez un produit" value="" />
              {Array.isArray(produits) && produits.map(p => (
                <Picker.Item key={p.id_produit} label={p.nom} value={String(p.id_produit)} />
              ))}
            </Picker>
          </View>
          <TouchableOpacity
            onPress={() => {
              if (
                produitSelected !== "" &&
                produits.some(p => String(p.id_produit) === produitSelected)
              ) {
                const produit = produits.find(p => String(p.id_produit) === produitSelected);
                setLignes([
                  ...lignes,
                  {
                    produit,
                    quantite: '',
                    prix: produit?.prix?.toString() || '',
                    total: 0,
                    key: `${produit.id_produit}_${Date.now()}_${Math.random()}`,
                  },
                ]);
                setProduitSelected(""); // Reset selection
                setPickerKey(prev => prev + 1); // Force Picker to reset
              } else {
                Toast.show({ type: 'error', text1: 'Sélectionnez un produit' });
              }
            }}
            style={styles.addCircleButton}
          >
            <Text style={styles.addCircleButtonText}>+</Text>
          </TouchableOpacity>
        </View>

        {/* Liste des lignes produits */}
        {lignes.map((ligne, idx) => (
          <View key={ligne.key} style={styles.ligneContainer}>
            <Text style={{ fontWeight: 'bold' }}>{ligne.produit.nom}</Text>
            <View style={styles.row}>
              <TextInput
                placeholder="Quantité"
                keyboardType="numeric"
                style={[styles.inputSmall, { marginRight: 8 }]}
                value={ligne.quantite}
                onChangeText={v => {
                  const newLignes = [...lignes];
                  newLignes[idx].quantite = v;
                  newLignes[idx].total = (Number(v) || 0) * (Number(newLignes[idx].prix) || 0);
                  setLignes(newLignes);
                }}
              />
              <TextInput
                placeholder="Prix"
                keyboardType="numeric"
                style={[styles.inputSmall, { marginRight: 8 }]}
                value={ligne.prix}
                onChangeText={v => {
                  const newLignes = [...lignes];
                  newLignes[idx].prix = v;
                  newLignes[idx].total = (Number(newLignes[idx].quantite) || 0) * (Number(v) || 0);
                  setLignes(newLignes);
                }}
              />
              <Text style={styles.prix}>
                Total: {ligne.total ? ligne.total.toFixed(2) : '0.00'} DH
              </Text>
            </View>
            <TouchableOpacity
              onPress={() => {
                setLignes(lignes.filter((_, i) => i !== idx));
              }}
              style={styles.addButtonYellow}
            >
              <Text style={styles.addButtonYellowText}>Supprimer</Text>
            </TouchableOpacity>
          </View>
        ))}

        {/* Total général */}
        <Text style={[styles.pageTitle, { marginTop: 24 }]}>
          Total Général: {totalGeneral.toFixed(2)} DH
        </Text>

        {/* Ajouter button at bottom right */}
        <View style={{ position: 'absolute', bottom: 24, right: 24, zIndex: 10 }}>
          <TouchableOpacity
            style={{
              backgroundColor: '#166534',
              paddingVertical: 16,
              paddingHorizontal: 32,
              borderRadius: 32,
              elevation: 4,
            }}
            onPress={() => {
              // TODO: handle order submission here
              Toast.show({ type: 'success', text1: 'Commande ajoutée !' });
              // Optionally reset form here
            }}
            disabled={lignes.length === 0 || !fournisseurSelected || !date}
          >
            <Text style={{ color: '#fff', fontWeight: 'bold', fontSize: 18 }}>Ajouter</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
      <BottomNavBar navigation={navigation} currentRoute="BuysScreen"  />
      <Toast />
    </View>
  );
};

const styles = StyleSheet.create({
  pageTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#4A444A',
    marginBottom: 16,
    alignSelf: 'center',
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#166534',
    marginBottom: 6,
  },
  dropdown: {
    backgroundColor: '#fff',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#CAD7C5',
    marginBottom: 16,
    maxHeight: 150,
  },
  dropdownItem: {
    padding: 12,
    borderBottomWidth: 1,
    borderColor: '#CAD7C5',
  },
  dropdownItemSelected: {
    backgroundColor: '#98BB89',
  },
  input: {
    backgroundColor: '#CAD7C5',
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#CAD7C5',
    marginBottom: 16,
  },
  inputSmall: {
    backgroundColor: '#CAD7C5',
    padding: 8,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#CAD7C5',
    width: 80,
  },
  addButtonYellow: {
    backgroundColor: '#FFE066',
    paddingVertical: 9, // plus petit
    paddingHorizontal: 12, // plus petit
    borderRadius: 16, // plus petit
    alignItems: 'center',
    marginBottom: 8, // plus petit
    flexDirection: 'row',
    justifyContent: 'center',
    alignSelf: 'flex-end', // bouton à droite
  },
  addButtonYellowText: {
    color: '#4A444A',
    fontWeight: '700',
    fontSize: 13, // plus petit
  },
  ligneContainer: {
    backgroundColor: '#fff',
    padding: 12,
    borderRadius: 8,
    marginBottom: 12,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
  },
  prix: {
    fontWeight: '600',
    color: '#166534',
  },
  addCircleButton: {
    backgroundColor: '#FFE066',
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 8,
    borderWidth: 1,
    borderColor: '#CAD7C5',
  },
  addCircleButtonText: {
    color: '#4A444A',
    fontWeight: 'bold',
    fontSize: 22,
    marginTop: -2,
  },
  topBar: {
    height: 56,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    backgroundColor: '#fff',
    elevation: 4,
  },
  topBarTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#4A444A',
  },
});

export default AddOrderScreen;
