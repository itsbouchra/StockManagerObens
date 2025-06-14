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
import { useAuth } from '../context/AuthContext';
// import { Ionicons } from '@expo/vector-icons'; // ou 'react-native-vector-icons/Ionicons'

const API_BASE_URL = 'http://10.0.2.2:8080';

const AddOrderScreen = ({ navigation }) => {
  const { unreadNotificationsCount } = useAuth();
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
  const [loading, setLoading] = useState(false); // Re-added loading state

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
        Toast.show({ type: 'error', text1: 'Erreur chargement fournisseurs', text2: String(err.message || 'Erreur lors du chargement des fournisseurs') });
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
      .catch(() => Toast.show({ type: 'error', text1: 'Erreur chargement catégories', text2: 'Une erreur est survenue lors du chargement des catégories' }))
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
      .catch(() => Toast.show({ type: 'error', text1: 'Erreur chargement produits', text2: 'Une erreur est survenue lors du chargement des produits' }));
  }, [categorieSelected]);

  // Total général
  const totalGeneral = lignes.reduce((sum, l) => sum + (Number(l.total) || 0), 0);

  const handleSettingsPress = () => {
    navigation.navigate('Settings'); // Navigate to settings screen
  };

  const handleNotificationPress = () => {
    navigation.navigate('AdminNotifications'); // Navigate to admin notifications page
  };

  return (
    <View style={{ flex: 1, backgroundColor: '#f3f4f6' }}>
      <TopBar
        title="Achats"
        activeLeftIcon="BuysScreen"
        onGoBack={() => navigation.goBack()}
        notificationCount={String(unreadNotificationsCount || '')}
        onNotificationPress={handleNotificationPress}
        onSettingsPress={handleSettingsPress}
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
            <Picker.Item label="Sélectionnez un fournisseur" value="" />
            {fournisseurs.map(f => (
              f.id_user ? (
                <Picker.Item key={String(f.id_user)} label={String(f.username || '')} value={String(f.id_user)} />
              ) : null
            ))}
          </Picker>
        </View>

        {/* Date */}
        <Text style={styles.label}>Date *</Text>
        <TouchableOpacity onPress={() => setShowDatePicker(true)}>
          <TextInput
            placeholder="YYYY-MM-DD"
            style={styles.input}
            value={String(date || '')} // Explicitly convert to string with fallback
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
            <Picker.Item label="Sélectionnez une catégorie" value="" />
            {categories.map(c => (
              c.id_categorie ? (
                <Picker.Item key={String(c.id_categorie)} label={String(c.nom || '')} value={String(c.id_categorie)} />
              ) : null
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
                p.id ? (
                  <Picker.Item key={String(p.id)} label={String(p.nom || '')} value={String(p.id)} />
                ) : null
              ))}
            </Picker>
          </View>
          <TouchableOpacity
            onPress={() => {
              if (
                produitSelected !== "" &&
                produits.some(p => String(p.id) === produitSelected)
              ) {
                const produit = produits.find(p => String(p.id) === produitSelected);
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
                setProduitSelected(""); // Reset selection
                setPickerKey(prev => prev + 1); // Force Picker to reset
              } else {
                Toast.show({ type: 'error', text1: 'Sélectionnez un produit', text2: 'Veuillez sélectionner un produit valide à ajouter.' });
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
            {/* Affiche le nom du produit sélectionné */}
            <Text style={{ fontWeight: 'bold', fontSize: 16, color: '#166534', marginBottom: 8, marginLeft: 2 }}>
              {String((ligne.produit && typeof ligne.produit.nom === 'string' ? ligne.produit.nom : '') || '')}
            </Text>
            <View style={styles.row}>
              <TextInput
                placeholder="Quantité"
                keyboardType="numeric"
                style={[styles.inputSmall, { marginRight: 8 }]}
                value={String(ligne.quantite || '')}
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
                value={String(ligne.prix || '')}
                onChangeText={v => {
                  const newLignes = [...lignes];
                  newLignes[idx].prix = v;
                  newLignes[idx].total = (Number(newLignes[idx].quantite) || 0) * (Number(v) || 0);
                  setLignes(newLignes);
                }}
              />
              <Text style={styles.prix}>
                Total: {String(ligne.total ? ligne.total.toFixed(2) : '0.00')} DH
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
          Total Général: {String(totalGeneral.toFixed(2))} DH
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
              opacity: (lignes.length === 0 || !fournisseurSelected || !date) ? 0.6 : 1,
            }}
            onPress={async () => {
              // Vérification des champs obligatoires
              if (!fournisseurSelected) {
                Toast.show({
                  type: 'error',
                  text1: 'Fournisseur obligatoire',
                  text2: 'Veuillez sélectionner un fournisseur.',
                  position: 'top',
                  visibilityTime: 2000,
                });
                return;
              }
              if (!date) {
                Toast.show({
                  type: 'error',
                  text1: 'Date obligatoire',
                  text2: 'Veuillez sélectionner une date.',
                  position: 'top',
                  visibilityTime: 2000,
                });
                return;
              }
              if (lignes.length === 0) {
                Toast.show({
                  type: 'error',
                  text1: 'Produit obligatoire',
                  text2: 'Ajoutez au moins un produit.',
                  position: 'top',
                  visibilityTime: 2000,
                });
                return;
              }
              // Vérifie chaque ligne produit
              for (let i = 0; i < lignes.length; i++) {
                const l = lignes[i];
                if (!l.quantite || Number(l.quantite) <= 0) {
                  Toast.show({
                    type: 'error',
                    text1: 'Quantité invalide',
                    text2: `Quantité manquante ou invalide pour le produit "${l.produit?.nom || ''}".`,
                    position: 'top',
                    visibilityTime: 2000,
                  });
                  return;
                }
                if (!l.prix || Number(l.prix) <= 0) {
                  Toast.show({
                    type: 'error',
                    text1: 'Prix invalide',
                    text2: `Prix manquant ou invalide pour le produit "${l.produit?.nom || ''}".`,
                    position: 'top',
                    visibilityTime: 2000,
                  });
                  return;
                }
              }

              try {
                const achat = {
                  dateAchat: date,
                  idFournisseur: fournisseurSelected,
                  statut: "",
                  montantTotal: totalGeneral,
                  lignes: lignes.map(l => ({
                    idProduit: l.produit.id,
                    quantite: Number(l.quantite),
                    prix: Number(l.prix),
                    total: Number(l.total),
                  })),
                };

                const res = await fetch(`${API_BASE_URL}/api/achats`, {
                  method: 'POST',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify(achat),
                });

                if (res.ok) {
                  Toast.show({
                    type: 'success',
                    text1: '✅ Achat ajouté avec succès',
                    text2: 'Votre commande a été enregistrée.',
                    position: 'top',
                  });
                  setTimeout(() => navigation.navigate('BuysScreen'), 1400);
                } else {
                  Toast.show({
                    type: 'error',
                    text1: 'Erreur',
                    text2: 'Erreur lors de l\'ajout',
                    position: 'top',
                    visibilityTime: 2000,
                  });
                }
              } catch (e) {
                Toast.show({
                  type: 'error',
                  text1: 'Erreur réseau',
                  text2: String(e.message || 'Une erreur est survenue'),
                  position: 'top',
                  visibilityTime: 2000,
                });
              }
            }}
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