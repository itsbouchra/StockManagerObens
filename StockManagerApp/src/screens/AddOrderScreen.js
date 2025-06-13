import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  FlatList,
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
  const [loading, setLoading] = useState(false);

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

  const renderHeader = () => (
    <View style={styles.headerContent}>
      <Text style={styles.pageTitle}>Ajouter Achat</Text>

      <Text style={styles.label}>Fournisseur *</Text>
      <View style={styles.dropdown}>
        <Picker
          selectedValue={fournisseurSelected}
          onValueChange={itemValue => setFournisseurSelected(itemValue)}
          enabled={!loadingFournisseurs && fournisseurs.length > 0}
        >
          <Picker.Item label="Sélectionnez un fournisseur" value="" />
          {fournisseurs.map(f => (
            <Picker.Item key={f.id_user} label={f.username} value={f.id_user} />
          ))}
        </Picker>
      </View>

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
              const y = selectedDate.getFullYear();
              const m = String(selectedDate.getMonth() + 1).padStart(2, '0');
              const d = String(selectedDate.getDate()).padStart(2, '0');
              setDate(`${y}-${m}-${d}`);
            }
          }}
        />
      )}

      <Text style={styles.label}>Catégorie *</Text>
      <View style={styles.dropdown}>
        <Picker
          selectedValue={categorieSelected}
          onValueChange={itemValue => {
            setCategorieSelected(itemValue);
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
              <Picker.Item key={p.id} label={p.nom} value={String(p.id)} />
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
              setProduitSelected("");
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
    </View>
  );

  const renderItem = ({ item: ligne, index: idx }) => (
    <View key={ligne.key} style={styles.ligneContainer}>
      <Text style={{ fontWeight: 'bold', fontSize: 16, color: '#166534', marginBottom: 8, marginLeft: 2 }}>
        {ligne.produit && typeof ligne.produit.nom === 'string' ? ligne.produit.nom : ''}
      </Text>
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
  );

  const renderFooter = () => (
    <View style={styles.footerContent}>
      <View style={styles.totalContainer}>
        <Text style={styles.totalText}>Total général:</Text>
        <Text style={styles.totalAmount}>{totalGeneral.toFixed(2)} DH</Text>
      </View>

      <TouchableOpacity
        onPress={() => {
          if (!fournisseurSelected || !date || lignes.length === 0) {
            Toast.show({
              type: 'error',
              text1: 'Tous les champs et au moins une ligne sont obligatoires',
            });
            return;
          }
          setLoading(true);
          const newAchat = {
            dateAchat: date,
            montantTotal: totalGeneral,
            fournisseurId: fournisseurSelected,
            statut: 'En attente',
            lignes: lignes.map(l => ({
              produitId: l.produit.id,
              quantite: Number(l.quantite),
              prixUnitaire: Number(l.prix),
              totalLigne: Number(l.total),
            })),
          };

          fetch(`${API_BASE_URL}/achats/add`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(newAchat),
          })
            .then(res => {
              if (!res.ok) throw new Error('Échec de l\'ajout de l\'achat');
              return res.json();
            })
            .then(() => {
              Toast.show({ type: 'success', text1: 'Achat ajouté avec succès' });
              navigation.goBack();
            })
            .catch(err => Toast.show({ type: 'error', text1: err.message }))
            .finally(() => setLoading(false));
        }}
        style={styles.submitButton}
        disabled={loading}
      >
        {loading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.submitButtonText}>Ajouter Achat</Text>
        )}
      </TouchableOpacity>
      <View style={{ height: 80 }} /> {/* Space for BottomNavBar */}
    </View>
  );

  return (
    <View style={styles.container}>
      <TopBar
        title="Ajouter une Vente"
        onGoBack={() => navigation.goBack()}
        activeLeftIcon="BuysScreen"
        onNotificationPress={() => navigation.navigate('AdminNotifications')}
        notificationCount={unreadNotificationsCount}
        onSettingsPress={() => navigation.navigate('Settings')}
      />
      <FlatList
        data={lignes}
        renderItem={renderItem}
        keyExtractor={item => item.key}
        ListHeaderComponent={renderHeader}
        ListFooterComponent={renderFooter}
        contentContainerStyle={styles.flatListContent}
      />
      <BottomNavBar navigation={navigation} currentRoute="BuysScreen" />
      <Toast />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f3f4f6',
  },
  flatListContent: {
    padding: 16,
    paddingBottom: 80, // Ensure space for BottomNavBar
  },
  headerContent: {
    marginBottom: 20,
  },
  pageTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
    color: '#111827',
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  dropdown: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    marginBottom: 16,
    backgroundColor: '#fff',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 10,
    backgroundColor: '#fff',
    color: '#333',
    marginBottom: 16,
  },
  addCircleButton: {
    backgroundColor: '#28a745',
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 10,
  },
  addCircleButtonText: {
    color: '#fff',
    fontSize: 24,
    fontWeight: 'bold',
  },
  ligneContainer: {
    backgroundColor: '#fff',
    padding: 12,
    borderRadius: 8,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,
    elevation: 2,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  inputSmall: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 8,
    backgroundColor: '#f9f9f9',
    color: '#333',
  },
  prix: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#166534',
  },
  addButtonYellow: {
    backgroundColor: '#ffc107',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
    alignSelf: 'flex-end',
    marginTop: 8,
  },
  addButtonYellowText: {
    color: '#333',
    fontWeight: 'bold',
  },
  footerContent: {
    marginTop: 20,
    paddingBottom: 80, // Space for BottomNavBar
  },
  totalContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#e9ecef',
    padding: 15,
    borderRadius: 10,
    marginBottom: 20,
  },
  totalText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  totalAmount: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#166534',
  },
  submitButton: {
    backgroundColor: '#28a745',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
  },
  submitButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default AddOrderScreen;
