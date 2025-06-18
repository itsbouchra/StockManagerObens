// EditVenteScreen.js

import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  StyleSheet,
  Alert,
} from 'react-native';
import Toast from 'react-native-toast-message';
import { useNavigation, useRoute } from '@react-navigation/native';
import { API_ENDPOINTS, handleApiError } from '../config/api';
import TopBar from '../components/TopBar';
import BottomNavBar from '../components/BottomNavBar';
import { Picker } from '@react-native-picker/picker';
import DateTimePicker from '@react-native-community/datetimepicker';

const EditVenteScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { id, venteDetails } = route.params || {};

  const [clients, setClients] = useState([]);
  const [categories, setCategories] = useState([]);
  const [produits, setProduits] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [clientSelected, setClientSelected] = useState(null);
  const [date, setDate] = useState('');
  const [statut, setStatut] = useState('en attente');
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [categorieSelected, setCategorieSelected] = useState(null);
  const [produitSelected, setProduitSelected] = useState('');
  const [lignes, setLignes] = useState([]);

  useEffect(() => {
    if (venteDetails) {
      // Use the passed venteDetails directly
      setClientSelected(Number(venteDetails.idClient));
      setDate(venteDetails.dateVente.split('T')[0]);
      setStatut(venteDetails.statut || 'en attente');
      const formattedLignes = (venteDetails.lignes || []).map((l, i) => ({
        idProduit: l.idProduit,
        nomProduit: l.nomProduit,
        quantite: l.quantite.toString(),
        prix: l.prix.toString(),
        total: l.total,
        key: `${l.idProduit}_${l.prix}_${l.quantite}_${i}`,
      }));
      setLignes(formattedLignes);
      setLoading(false);
      fetchClientsAndCategories();
    } else {
      fetchData();
    }
  }, []);

  const fetchClientsAndCategories = async () => {
    try {
      const [clientsRes, categoriesRes] = await Promise.all([
        fetch(API_ENDPOINTS.USERS),
        fetch(API_ENDPOINTS.CATEGORIES),
      ]);
      setClients(await clientsRes.json());
      setCategories(await categoriesRes.json());
    } catch (e) {
      // handle error
    }
  };

  const fetchData = async () => {
    setLoading(true);
    try {
      const [clientsRes, categoriesRes, venteRes] = await Promise.all([
        fetch(API_ENDPOINTS.USERS),
        fetch(API_ENDPOINTS.CATEGORIES),
        fetch(`${API_ENDPOINTS.SALES}/${id}`),
      ]);

      if (!clientsRes.ok || !categoriesRes.ok || !venteRes.ok) {
        throw new Error('Erreur lors de la récupération des données');
      }

      const [clientsData, categoriesData, venteData] = await Promise.all([
        clientsRes.json(),
        categoriesRes.json(),
        venteRes.json(),
      ]);

      setClients(clientsData);
      setCategories(categoriesData);
      setClientSelected(Number(venteData.idClient));
      setDate(venteData.dateVente.split('T')[0]);
      setStatut(venteData.statut || 'en attente');

      const formattedLignes = (venteData.lignes || []).map((l, i) => ({
        idProduit: l.idProduit,
        nomProduit: l.nomProduit,
        quantite: l.quantite.toString(),
        prix: l.prix.toString(),
        total: l.total,
        key: `${l.idProduit}_${l.prix}_${l.quantite}_${i}`,
      }));
      setLignes(formattedLignes);

      if (formattedLignes.length > 0) {
        const prodRes = await fetch(`${API_ENDPOINTS.PRODUCTS}/${formattedLignes[0].idProduit}`);
        const prod = await prodRes.json();
        if (prod?.categorieId) setCategorieSelected(prod.categorieId);
      }
    } catch (error) {
      const errorInfo = handleApiError(error);
      Toast.show({
        type: 'error',
        text1: 'Erreur',
        text2: errorInfo.message,
        position: 'top',
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!categorieSelected) return setProduits([]);
    fetch(`${API_ENDPOINTS.PRODUCTS}/byCategorie/${categorieSelected}`)
      .then(res => res.json())
      .then(data => setProduits(Array.isArray(data) ? data : []));
  }, [categorieSelected]);

  const totalGeneral = lignes.reduce((sum, l) => sum + (Number(l.total) || 0), 0);

  const handleSubmit = async () => {
    if (!clientSelected || !date || lignes.length === 0) {
      return Toast.show({ type: 'error', text1: 'Tous les champs sont obligatoires' });
    }
    setSaving(true);
    try {
      const ventePayload = {
        id,
        dateVente: date,
        idClient: clientSelected,
        montantTotal: totalGeneral,
        statut,
        lignes: lignes.map(l => ({
          idProduit: l.idProduit,
          quantite: Number(l.quantite),
          prix: Number(l.prix),
          total: Number(l.total),
        })),
      };
      const res = await fetch(`${API_ENDPOINTS.SALES}/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(ventePayload),
      });
      if (!res.ok) throw new Error('Erreur serveur');
      Toast.show({ type: 'success', text1: 'Vente modifiée avec succès' });
      setTimeout(() => navigation.navigate('SalesListScreen', { refresh: Date.now() }), 1200);
    } catch (error) {
      const errorInfo = handleApiError(error);
      Toast.show({
        type: 'error',
        text1: 'Erreur',
        text2: errorInfo.message,
        position: 'top',
      });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <TopBar
          title="Modifier la vente"
          onGoBack={() => navigation.goBack()}
          onNotificationPress={() => navigation.navigate('Notifications')}
          onSettingsPress={() => navigation.navigate('Settings')}
        />
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#6b8e23" />
        </View>
      </View>
    );
  }

  return (
    <View style={{ flex: 1, backgroundColor: '#f3f4f6' }}>
      <TopBar
        title="Modifier Vente"
        onGoBack={() => navigation.goBack()}
        activeLeftIcon="SalesListScreen"
        onNotificationPress={() => navigation.navigate('AdminNotifications')}
        onSettingsPress={() => navigation.navigate('Settings')}
      />
      <ScrollView contentContainerStyle={{ padding: 16, paddingBottom: 80 }}>
        <Text style={styles.pageTitle}>Modifier Vente</Text>

        {/* Client */}
        <Text style={styles.label}>Client *</Text>
        <View style={styles.dropdown}>
          <Picker
            selectedValue={clientSelected}
            onValueChange={setClientSelected}
          >
            <Picker.Item label="Sélectionnez un client" value="" />
            {Array.isArray(clients) && clients.filter(client => client.role === 'client').map(client => (
              <Picker.Item key={client.id_user} label={client.username} value={client.id_user} />
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
              setProduitSelected('');
            }}
          >
            <Picker.Item label="Sélectionnez une catégorie" value={null} />
            {Array.isArray(categories) && categories.map(c => (
              <Picker.Item key={c.id_categorie} label={c.nom} value={c.id_categorie} />
            ))}
          </Picker>
        </View>

        {/* Produit + bouton + */}
        <Text style={styles.label}>Produit *</Text>
        <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 16 }}>
          <View style={[styles.dropdown, { flex: 1, marginBottom: 0 }]}> 
            <Picker
              selectedValue={produitSelected}
              onValueChange={setProduitSelected}
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
                    key: `${produit.id}_${Date.now()}_${Math.random()}`,
                    idProduit: produit.id,
                    quantite: '',
                    prix: produit.prix?.toString() || '',
                    total: 0,
                    nomProduit: produit.nom // pour affichage
                  },
                ]);
                setProduitSelected('');
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
            <Text style={{ fontWeight: 'bold', fontSize: 16, color: '#166534', marginBottom: 8 }}>
              {ligne.nomProduit}
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
        ))}

        {/* Total général */}
        <Text style={[styles.pageTitle, { marginTop: 24 }]}>Total Général: {totalGeneral.toFixed(2)} DH</Text>

        {/* Boutons */}
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 24 }}>
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            style={[styles.btn, { backgroundColor: '#9ca3af' }]}
            disabled={saving}
          >
            <Text style={styles.btnText}>Annuler</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={handleSubmit}
            style={[styles.btn, { backgroundColor: '#16a34a' }]}
            disabled={saving}
          >
            {saving ? <ActivityIndicator color="#fff" /> : <Text style={styles.btnText}>Mettre à jour</Text>}
          </TouchableOpacity>
        </View>
      </ScrollView>
      <BottomNavBar navigation={navigation} currentRoute="SalesListScreen" />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f3f4f6',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    flex: 1,
    padding: 20,
  },
  formGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 8,
  },
  selectContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  selectOption: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#d1d5db',
  },
  selectedOption: {
    backgroundColor: '#6b8e23',
    borderColor: '#6b8e23',
  },
  selectOptionText: {
    color: '#374151',
    fontSize: 14,
  },
  selectedOptionText: {
    color: '#fff',
  },
  input: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
  },
  inputSmall: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 8,
    padding: 8,
    fontSize: 14,
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
  addButtonYellow: {
    backgroundColor: '#FFE066',
    paddingVertical: 9,
    paddingHorizontal: 12,
    borderRadius: 16,
    alignItems: 'center',
    marginBottom: 8,
    flexDirection: 'row',
    justifyContent: 'center',
    alignSelf: 'flex-end',
  },
  addButtonYellowText: {
    color: '#4A444A',
    fontWeight: '700',
    fontSize: 13,
  },
  pageTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 16,
    color: '#222',
    textAlign: 'center',
  },
  submitButtonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 24,
  },
  btn: {
    flex: 1,
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginHorizontal: 6,
  },
  btnText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  dropdown: {
    backgroundColor: '#fff',
    borderRadius: 8,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    overflow: 'hidden',
  },
  dropdownSmall: {
    flex: 1,
    backgroundColor: '#fff',
    borderRadius: 8,
    marginRight: 6,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    overflow: 'hidden',
  },
  totalSmall: {
    width: 70,
    textAlign: 'center',
    color: '#111',
    fontWeight: 'bold',
    fontSize: 15,
    marginRight: 6,
  },
  saveButton: {
    backgroundColor: '#00cc99',
    borderRadius: 8,
    padding: 16,
    alignItems: 'center',
    marginTop: 24,
  },
  saveButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 17,
  },
  addCircleButton: {
    backgroundColor: '#FFE066',
    padding: 12,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  addCircleButtonText: {
    color: '#4A444A',
    fontWeight: '700',
    fontSize: 13,
  },
});

export default EditVenteScreen;