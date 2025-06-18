import React, { useState } from 'react';
import { View, Text, TouchableOpacity, TextInput, ScrollView, ActivityIndicator } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import DateTimePicker from '@react-native-community/datetimepicker';
import Toast from 'react-native-toast-message';
import { API_ENDPOINTS, handleApiError } from '../config/api';
import TopBar from '../components/TopBar';
import BottomNavBar from '../components/BottomNavBar';

const API_BASE_URL = 'http://10.0.2.2:8080';

const AddLivraisonScreen = ({ navigation, route }) => {
  const { vente } = route.params;
  const [produits, setProduits] = useState(
    route.params.produits.map(prod => ({
      ...prod,
      quantite: '',
      date: '',
      refLot: '',
    }))
  );
  const [openIndex, setOpenIndex] = useState(null);
  const [datePickerIdx, setDatePickerIdx] = useState(null);
  const [loading, setLoading] = useState(false);

  const showDatePicker = idx => setDatePickerIdx(idx);
  const hideDatePicker = () => setDatePickerIdx(null);

  // Fetch stock for a product
  const fetchStock = async (idProduit) => {
    try {
      const res = await fetch(`${API_BASE_URL}/receptions/byProduct/${idProduit}`);
      if (!res.ok) throw new Error('Erreur lors de la récupération du stock');
      const receptions = await res.json();
      // Sum all quantite fields
      return receptions.reduce((sum, item) => sum + (item.quantite || 0), 0);
    } catch (e) {
      return 0;
    }
  };

  // Validate and submit livraison
  const handleValider = async () => {
    // Validate required fields
    const produitIncomplet = produits.find(prod => {
      if (!prod.date) return true;
      if (!prod.quantite) return true;
      return false;
    });
    if (produitIncomplet) {
      Toast.show({
        type: 'error',
        text1: 'Champs manquants',
        text2: `Veuillez remplir tous les champs obligatoires pour le produit "${String(produitIncomplet.nomProduit)}".`,
      });
      return;
    }
    setLoading(true);
    try {
      // Check stock for each product
      for (let prod of produits) {
        const stock = await fetchStock(prod.idProduit);
        if (stock === 0) {
          Toast.show({ type: 'error', text1: 'Erreur réseau', text2: 'Impossible de récupérer le stock.' });
          setLoading(false);
          return;
        }
        if (Number(prod.quantite) > stock) {
          setLoading(false);
          Toast.show({
            type: 'error',
            text1: 'Stock insuffisant',
            text2: `Stock insuffisant pour "${prod.nomProduit}". Stock disponible: ${stock}`,
          });
          return;
        }
      }
      // All stocks are sufficient, proceed
      const response = await fetch(API_ENDPOINTS.DELIVERIES, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          venteId: vente.idVente || vente.id,
          venteStatut: 'Livré',
          livraisons: produits.map(prod => ({
            idProduit: prod.idProduit,
            dateLivraison: prod.date,
            quantite: Number(prod.quantite),
            statut: 'FIFO',
            refLot: 'FIFO',
          }))
        })
      });
      if (response.ok) {
        Toast.show({
          type: 'success',
          text1: 'Succès',
          text2: 'Livraison enregistrée avec succès',
        });
        navigation.navigate('SalesListScreen', { refresh: true });
      } else {
        const err = await response.json();
        Toast.show({ type: 'error', text1: 'Erreur', text2: err.message || 'Erreur lors de la validation' });
      }
    } catch (error) {
      Toast.show({ type: 'error', text1: 'Erreur', text2: error.message || 'Erreur inattendue' });
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#f8fafc' }}>
        <View style={{ backgroundColor: '#fff', padding: 24, borderRadius: 16, alignItems: 'center', shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 8, elevation: 4, width: '80%', maxWidth: 300 }}>
          <ActivityIndicator size="large" color="#4c6c43" />
          <Text style={{ marginTop: 16, fontSize: 18, fontWeight: '600', color: '#1e293b', textAlign: 'center' }}>Enregistrement en cours...</Text>
          <Text style={{ marginTop: 8, fontSize: 14, color: '#64748b', textAlign: 'center' }}>Veuillez patienter pendant que nous traitons votre demande</Text>
        </View>
      </View>
    );
  }

  return (
    <View style={{ flex: 1, backgroundColor: '#f3f4f6' }}>
      <TopBar
        title="Ajouter Livraison"
        onGoBack={() => navigation.goBack()}
        activeLeftIcon="SalesListScreen"
        onNotificationPress={() => navigation.navigate('AdminNotifications')}
        onSettingsPress={() => navigation.navigate('Settings')}
      />
      <ScrollView contentContainerStyle={{ paddingBottom: 120 }}>
        <Text style={{ fontSize: 24, fontWeight: 'bold', textAlign: 'center', marginVertical: 20, color: '#111827' }}>Ajouter Livraison</Text>
        <Text style={{ alignSelf: 'center', backgroundColor: '#e6f4d7', borderRadius: 8, paddingHorizontal: 16, paddingVertical: 4, color: '#222', fontWeight: 'bold', marginBottom: 10 }}>Vente #{String(vente.idVente || vente.id)}</Text>
        <View style={{ alignItems: 'center', marginBottom: 20 }}>
          <Text style={{ backgroundColor: vente.statut === "Livré" ? '#22c55e' : '#facc15', color: vente.statut === "Livré" ? '#fff' : '#92400e', fontWeight: 'bold', borderRadius: 16, paddingHorizontal: 18, paddingVertical: 6, fontSize: 16, shadowColor: '#000', shadowOpacity: 0.08, shadowRadius: 4, elevation: 2, letterSpacing: 1, textTransform: 'uppercase' }}>{vente.statut === "Livré" ? "Livré" : "En attente"}</Text>
        </View>
        {produits && produits.length > 0 ? (
          produits.map((prod, idx) => (
            <View key={prod.idProduit || idx} style={{ marginBottom: 12 }}>
              <TouchableOpacity
                style={{ flexDirection: 'row', alignItems: 'center', backgroundColor: '#7e9a50', borderRadius: 8, marginHorizontal: 24, marginBottom: 2, paddingVertical: 10, paddingHorizontal: 16, elevation: 2 }}
                onPress={() => setOpenIndex(openIndex === idx ? null : idx)}
                activeOpacity={0.8}
              >
                <Text style={{ color: '#fff', fontWeight: 'bold', fontSize: 16, flex: 1 }}>{String(prod.nomProduit)}</Text>
                <Text style={{ fontSize: 22, color: '#fff' }}>{openIndex === idx ? '▲' : '▼'}</Text>
              </TouchableOpacity>
              {openIndex === idx && (
                <View style={{ backgroundColor: '#fff', marginHorizontal: 32, marginTop: 2, borderRadius: 12, padding: 16, borderWidth: 1, borderColor: '#d1d5db', shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 4, elevation: 2 }}>
                  <Text style={{ fontWeight: 'bold', marginBottom: 6 }}>Quantité :</Text>
                  <TextInput
                    style={{ backgroundColor: '#f9fafb', borderWidth: 1, borderColor: '#d1d5db', borderRadius: 8, padding: 10, marginBottom: 12 }}
                    keyboardType="numeric"
                    value={String(prod.quantite)}
                    onChangeText={text => {
                      const newProduits = [...produits];
                      newProduits[idx].quantite = text;
                      setProduits(newProduits);
                    }}
                    placeholder="Quantité"
                  />
                  <Text style={{ fontWeight: 'bold', marginBottom: 6 }}>Date :</Text>
                  <TouchableOpacity
                    onPress={() => showDatePicker(idx)}
                    style={{ backgroundColor: '#f9fafb', borderWidth: 1, borderColor: '#d1d5db', borderRadius: 8, padding: 10, marginBottom: 12 }}
                  >
                    <Text style={{ color: prod.date ? '#111827' : '#6b7280' }}>{prod.date ? new Date(prod.date).toLocaleDateString() : 'Sélectionner une date'}</Text>
                  </TouchableOpacity>
                  {datePickerIdx === idx && (
                    <DateTimePicker
                      value={prod.date ? new Date(prod.date) : new Date()}
                      mode="date"
                      display="default"
                      onChange={(event, selectedDate) => {
                        hideDatePicker();
                        if (selectedDate) {
                          const newProduits = [...produits];
                          newProduits[idx].date = selectedDate.toISOString();
                          setProduits(newProduits);
                        }
                      }}
                    />
                  )}
                  <Text style={{ fontWeight: 'bold', marginBottom: 6 }}>Référence de Lot :</Text>
                  <TextInput
                    style={{ backgroundColor: '#f9fafb', borderWidth: 1, borderColor: '#d1d5db', borderRadius: 8, padding: 10, marginBottom: 12 }}
                    value={prod.refLot}
                    onChangeText={text => {
                      const newProduits = [...produits];
                      newProduits[idx].refLot = text;
                      setProduits(newProduits);
                    }}
                    placeholder="Référence de Lot"
                  />
                  <Text style={{ fontWeight: 'bold', marginBottom: 6 }}>Statut : <Text style={{ color: '#7e9a50' }}>FIFO</Text></Text>
                </View>
              )}
            </View>
          ))
        ) : (
          <Text style={{ textAlign: 'center', marginVertical: 20, color: '#666' }}>Aucun produit à livrer pour cette vente.</Text>
        )}
      </ScrollView>
      <View style={{ position: 'absolute', left: 0, right: 0, bottom: 64, flexDirection: 'row', justifyContent: 'center', gap: 30, paddingHorizontal: 24, paddingBottom: 35 }}>
        <TouchableOpacity
          style={{ backgroundColor: '#4338ca', paddingVertical: 10, paddingHorizontal: 32, borderRadius: 8, minWidth: 100, alignItems: 'center', opacity: loading ? 0.5 : 1 }}
          onPress={handleValider}
          disabled={loading}
        >
          <Text style={{ color: '#fff', fontWeight: 'bold', fontSize: 16 }}>Valider</Text>
        </TouchableOpacity>
      </View>
      <View style={{ position: 'absolute', left: 0, right: 0, bottom: 0 }}>
        <BottomNavBar navigation={navigation} currentRoute="SalesListScreen" />
      </View>
      <Toast />
    </View>
  );
};

export default AddLivraisonScreen;