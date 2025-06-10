import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  ScrollView,
  Platform,
  Alert,
} from 'react-native';
import { Picker } from '@react-native-picker/picker';
import DateTimePicker from '@react-native-community/datetimepicker';
import { ArrowLeft, DollarSign, Bell, Settings } from 'lucide-react-native';
import BottomNavBar from '../components/BottomNavBar';

const AddLivraisonScreen = ({ navigation, route }) => {
  const { vente, produits: produitsInitiaux } = route.params || {};

  const [produits, setProduits] = useState([]);
  const [openIndex, setOpenIndex] = useState(null);
  const [datePickerIdx, setDatePickerIdx] = useState(null);

  useEffect(() => {
    if (!Array.isArray(produitsInitiaux)) {
      Alert.alert('Erreur', 'Liste des produits introuvable ou mal formatée.');
      navigation.goBack();
    } else {
      const formatted = produitsInitiaux.map(prod => ({
        ...prod,
        quantite: '',
      }));
      setProduits(formatted);
    }
  }, []);

  const showDatePicker = idx => setDatePickerIdx(idx);
  const hideDatePicker = () => setDatePickerIdx(null);

  const handleLivraison = (venteStatut) => {
    const depassement = produits.find(prod => {
      const quantiteSaisie = prod.statut === 'Partielle'
        ? Number(prod.qteLivree) || 0
        : Number(prod.quantite) || 0;
      return quantiteSaisie > prod.quantiteVente;
    });

    if (depassement) {
      Alert.alert(
        'Quantité dépassée',
        `La quantité saisie (${depassement.statut === 'Partielle' ? depassement.qteLivree : depassement.quantite}) pour le produit "${depassement.nom}" dépasse la quantité de la vente (${depassement.quantiteVente}) !`
      );
      return;
    }

    fetch('http://10.0.2.2:8080/livraisons', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        venteId: vente.idVente,
        venteStatut,
        livraisons: produits.map(prod => {
          let quantiteLivree = 0;
          if (prod.statut === 'Complète') {
            quantiteLivree = Number(prod.quantite);
          } else if (prod.statut === 'Partielle') {
            quantiteLivree = Number(prod.qteLivree) || 0;
          }
          return {
            idProduit: prod.idProduit,
            dateLivraison: prod.date,
            quantite: quantiteLivree,
            statut: prod.statut,
            refColis: prod.refColis,
          };
        })
      })
    })
      .then(res => {
        if (res.ok) {
          navigation.navigate('SalesListScreen', { refresh: true });
        } else {
          Alert.alert('Erreur', 'Erreur lors de la validation');
        }
      })
      .catch(() => Alert.alert('Erreur', 'Erreur de connexion au serveur'));
  };

  // 🟡 Rendu principal
  return (
    <View style={{ flex: 1, backgroundColor: '#f3f4f6' }}>
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

      <ScrollView contentContainerStyle={{ paddingBottom: 120 }}>
        <Text style={{ fontSize: 24, fontWeight: 'bold', textAlign: 'center', marginVertical: 20, color: '#111827' }}>
          Ajouter Livraison
        </Text>
      <Text style={{
          alignSelf: 'center',
          backgroundColor: '#e6f4d7',
          borderRadius: 8,
          paddingHorizontal: 16,
          paddingVertical: 4,
          color: '#222',
          fontWeight: 'bold',
          marginBottom: 10,
        }}>
          Vente #{vente.idVente}
        </Text>
        <View style={{ alignItems: 'center', marginBottom: 20 }}>
                  <Text
                    style={{
                      backgroundColor: vente.statut === "Receptionné" ? '#22c55e' : '#facc15',
                      color: vente.statut === "Receptionné" ? '#fff' : '#92400e',
                      fontWeight: 'bold',
                      borderRadius: 16,
                      paddingHorizontal: 18,
                      paddingVertical: 6,
                      fontSize: 16,
                      shadowColor: '#000',
                      shadowOpacity: 0.08,
                      shadowRadius: 4,
                      elevation: 2,
                      letterSpacing: 1,
                      textTransform: 'uppercase',
                    }}
                  >
                    {vente.statut === "Receptionné" ? "Réceptionné" : "En attente"}
                  </Text>
                </View>

        {produits.length > 0 ? produits.map((prod, idx) => (
          <View key={prod.idProduit || idx} style={{ marginBottom: 12 }}>
            <TouchableOpacity
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                backgroundColor: '#2563eb',
                borderRadius: 8,
                marginHorizontal: 24,
                marginBottom: 2,
                paddingVertical: 10,
                paddingHorizontal: 16,
                elevation: 2
              }}
              onPress={() => setOpenIndex(openIndex === idx ? null : idx)}
            >
              <Text style={{ color: '#fff', fontWeight: 'bold', fontSize: 16, flex: 1 }}>{prod.nomProduit}</Text>
              <Text style={{ fontSize: 22, color: '#fff' }}>{openIndex === idx ? '▲' : '▼'}</Text>
            </TouchableOpacity>

            {openIndex === idx && (
              <View style={{
                backgroundColor: '#fff',
                marginHorizontal: 32,
                marginTop: 2,
                borderRadius: 12,
                padding: 16,
                borderWidth: 1,
                borderColor: '#d1d5db',
                elevation: 2
              }}>
                {/* Champ Quantité */}
                <Text style={{ fontWeight: 'bold', marginBottom: 6 }}>Quantité :</Text>
                <TextInput
                  style={{
                    backgroundColor: '#f9fafb',
                    borderWidth: 1,
                    borderColor: '#d1d5db',
                    borderRadius: 8,
                    padding: 10,
                    marginBottom: 12
                  }}
                  keyboardType="numeric"
                  value={prod.quantite}
                  onChangeText={text => {
                    const newProduits = [...produits];
                    newProduits[idx].quantite = text;
                    setProduits(newProduits);
                  }}
                  placeholder="Quantité"
                />

                {/* Date */}
                <Text style={{ fontWeight: 'bold', marginBottom: 6 }}>Date :</Text>
                <TouchableOpacity
                  style={{
                    backgroundColor: '#e0f2fe',
                    borderRadius: 8,
                    borderWidth: 1,
                    borderColor: '#7dd3fc',
                    padding: 10,
                    marginBottom: 12
                  }}
                  onPress={() => showDatePicker(idx)}
                >
                  <Text style={{ color: '#222' }}>{prod.date || 'Choisir une date'}</Text>
                </TouchableOpacity>

                {datePickerIdx === idx && (
                  <DateTimePicker
                    value={prod.date ? new Date(prod.date) : new Date()}
                    mode="date"
                    display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                    onChange={(event, selectedDate) => {
                      hideDatePicker();
                      if (selectedDate) {
                        const d = selectedDate;
                        const formatted = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
                        const newProduits = [...produits];
                        newProduits[idx].date = formatted;
                        setProduits(newProduits);
                      }
                    }}
                  />
                )}

                {/* Statut */}
                <Text style={{ fontWeight: 'bold', marginBottom: 6 }}>Statut :</Text>
                <View style={{
                  backgroundColor: '#e0f2fe',
                  borderRadius: 8,
                  borderWidth: 1,
                  borderColor: '#7dd3fc',
                  marginBottom: 12
                }}>
                  <Picker
                    selectedValue={prod.statut || ''}
                    onValueChange={v => {
                      const newProduits = [...produits];
                      newProduits[idx].statut = v;
                      setProduits(newProduits);
                    }}
                    style={{ height: 40, width: '100%' }}
                  >
                    <Picker.Item label="Sélectionner un statut" value="" />
                    <Picker.Item label="Complète" value="Complète" />
                    <Picker.Item label="Partielle" value="Partielle" />
                    <Picker.Item label="Non livrée" value="Non livrée" />
                  </Picker>
                </View>

                {prod.statut === 'Partielle' && (
                  <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 10 }}>
                    <Text style={{
                      backgroundColor: '#d1d5db',
                      borderRadius: 6,
                      padding: 8,
                      marginRight: 8,
                      minWidth: 90,
                      textAlign: 'center',
                      fontWeight: 'bold'
                    }}>Qte Livree :</Text>
                    <TextInput
                      style={{
                        backgroundColor: '#f3f4f6',
                        borderWidth: 1,
                        borderColor: '#d1d5db',
                        borderRadius: 6,
                        padding: 8,
                        minWidth: 60
                      }}
                      keyboardType="numeric"
                      value={prod.qteLivree ? String(prod.qteLivree) : ''}
                      onChangeText={v => {
                        const newProduits = [...produits];
                        newProduits[idx].qteLivree = v;
                        setProduits(newProduits);
                      }}
                      placeholder="0"
                    />
                  </View>
                )}

                {/* Ref colis */}
                <Text style={{ fontWeight: 'bold', marginBottom: 6 }}>Réf colis :</Text>
                <TextInput
                  style={{
                    backgroundColor: '#f9fafb',
                    borderWidth: 1,
                    borderColor: '#d1d5db',
                    borderRadius: 8,
                    padding: 10,
                    marginBottom: 8
                  }}
                  value={prod.refColis || ''}
                  onChangeText={v => {
                    const newProduits = [...produits];
                    newProduits[idx].refColis = v;
                    setProduits(newProduits);
                  }}
                  placeholder="Réf colis"
                />
              </View>
            )}
          </View>
        )) : (
          <Text style={{ textAlign: 'center', color: '#888' }}>Aucun produit</Text>
        )}
      </ScrollView>

      {/* Boutons d'action */}
      <View style={{
        position: 'absolute',
        left: 0,
        right: 0,
        bottom: 64,
        flexDirection: 'row',
        justifyContent: 'center',
        gap: 30,
        paddingHorizontal: 24,
        paddingBottom: 35
      }}>
        {vente?.statut !== 'Livree' && (
          <TouchableOpacity
            style={{
              backgroundColor: '#4338ca',
              paddingVertical: 10,
              paddingHorizontal: 32,
              borderRadius: 8,
              minWidth: 100,
              alignItems: 'center'
            }}
            onPress={() => handleLivraison('En cours')}
          >
            <Text style={{ color: '#fff', fontWeight: 'bold', fontSize: 16 }}>Valider</Text>
          </TouchableOpacity>
        )}
        <TouchableOpacity
          style={{
            backgroundColor: '#22c55e',
            paddingVertical: 10,
            paddingHorizontal: 32,
            borderRadius: 8,
            minWidth: 100,
            alignItems: 'center'
          }}
          onPress={() => handleLivraison('Livree')}
        >
          <Text style={{ color: '#fff', fontWeight: 'bold', fontSize: 16 }}>Clôturer</Text>
        </TouchableOpacity>
      </View>

      <View style={{ position: 'absolute', left: 0, right: 0, bottom: 0 }}>
        <BottomNavBar navigation={navigation} currentRoute="SalesListScreen" />
      </View>
    </View>
  );
};
const styles = {
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
};

export default AddLivraisonScreen;
