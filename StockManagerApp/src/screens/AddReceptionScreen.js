import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, TextInput, ScrollView, Platform, ActivityIndicator } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import DateTimePicker from '@react-native-community/datetimepicker';
import TopBar from '../components/TopBar';
import BottomNavBar from '../components/BottomNavBar';
import { useAuth } from '../context/AuthContext';
import Toast from 'react-native-toast-message';

const API_BASE_URL = 'http://10.0.2.2:8080';

const AddReceptionScreen = ({ navigation, route }) => {
  const { unreadNotificationsCount } = useAuth();
  const { achat } = route.params;
  const [produits, setProduits] = useState(
    route.params.produits.map(prod => ({
      ...prod,
      nomProduit: String(prod.nomProduit || ''),
      quantite: '', // Champ vide au départ
      qteConf: '', // Quantité conforme pour semi-conforme
      refLot: '', // Référence de lot
      date: '', // Date de réception
      statut: '', // Statut de réception
    }))
  );
  const [openIndex, setOpenIndex] = useState(null);
  const [datePickerIdx, setDatePickerIdx] = useState(null);
  const [loading, setLoading] = useState(false);

  const showDatePicker = idx => setDatePickerIdx(idx);
  const hideDatePicker = () => setDatePickerIdx(null);

  const handleReception = (achatStatut) => {
    // Validate required fields
    const produitIncomplet = produits.find(prod => {
      if (!prod.date) return true;
      if (!prod.statut) return true;
      if (!prod.quantite && prod.statut !== 'Non-Conforme') return true;
      if (prod.statut === 'Semi-Conforme' && !prod.qteConf) return true;
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

    // Validate quantities
    const produitQuantiteInvalide = produits.find(prod => {
      if (prod.statut === 'Semi-Conforme') {
        return Number(prod.qteConf) > Number(prod.quantite);
      }
      return false;
    });

    if (produitQuantiteInvalide) {
      Toast.show({
        type: 'error',
        text1: 'Quantité invalide',
        text2: `La quantité conforme ne peut pas être supérieure à la quantité totale pour "${String(produitQuantiteInvalide.nomProduit)}".`,
      });
      return;
    }

    setLoading(true);
    fetch(`${API_BASE_URL}/receptions`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        achatId: achat.idAchat,
        achatStatut: achatStatut,
        receptions: produits.map(prod => {
          let quantiteStockee = 0;
          if (prod.statut === 'Conforme') {
            quantiteStockee = Number(prod.quantite);
          } else if (prod.statut === 'Semi-Conforme') {
            quantiteStockee = Number(prod.qteConf) || 0;
          } // Non-Conforme => 0

          // Ensure date is in YYYY-MM-DD format
          const date = prod.date ? new Date(prod.date).toISOString().split('T')[0] : null;

          return {
            idProduit: prod.idProduit,
            dateReception: date,
            quantite: quantiteStockee,
            statut: prod.statut,
            refLot: prod.refLot,
          };
        })
      })
    })
    .then(res => {
      if (res.ok) {
        Toast.show({
          type: 'success',
          text1: 'Succès',
          text2: 'Réception enregistrée avec succès',
        });
        navigation.navigate('BuysScreen', { refresh: true });
      } else {
        return res.json().then(err => { throw new Error(err.message || 'Erreur lors de la validation'); });
      }
    })
    .catch(error => {
      Toast.show({
        type: 'error',
        text1: 'Erreur',
        text2: String(error.message || 'Erreur de connexion au serveur'),
      });
    })
    .finally(() => {
      setLoading(false);
    });
  };

  if (loading) {
    return (
      <View style={{
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#f8fafc',
      }}>
        <View style={{
          backgroundColor: '#fff',
          padding: 24,
          borderRadius: 16,
          alignItems: 'center',
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.1,
          shadowRadius: 8,
          elevation: 4,
          width: '80%',
          maxWidth: 300,
        }}>
          <ActivityIndicator size="large" color="#4c6c43" />
          <Text style={{
            marginTop: 16,
            fontSize: 18,
            fontWeight: '600',
            color: '#1e293b',
            textAlign: 'center',
          }}>
            Enregistrement en cours...
          </Text>
          <Text style={{
            marginTop: 8,
            fontSize: 14,
            color: '#64748b',
            textAlign: 'center',
          }}>
            Veuillez patienter pendant que nous traitons votre demande
          </Text>
        </View>
      </View>
    );
  }

  return (
    <View style={{ flex: 1, backgroundColor: '#f3f4f6' }}>
      <TopBar
        title="Ajouter Réception"
        onGoBack={() => navigation.goBack()}
        activeLeftIcon="stock"
        onNotificationPress={() => navigation.navigate('AdminNotifications')}
        notificationCount={unreadNotificationsCount}
        onSettingsPress={() => navigation.navigate('Settings')}
      />
      <ScrollView contentContainerStyle={{ paddingBottom: 120 }}>
        <Text style={{
          fontSize: 24,
          fontWeight: 'bold',
          textAlign: 'center',
          marginVertical: 20,
          color: '#111827',
        }}>
          Ajouter Reception
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
          Achat #{String(achat.idAchat)}
        </Text>
        <View style={{ alignItems: 'center', marginBottom: 20 }}>
          <Text
            style={{
              backgroundColor: achat.statut === "Receptionné" ? '#22c55e' : '#facc15',
              color: achat.statut === "Receptionné" ? '#fff' : '#92400e',
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
            {achat.statut === "Receptionné" ? "Réceptionné" : "En attente"}
          </Text>
        </View>

        {/* Affichage dynamique des produits */}
        {produits && produits.length > 0 ? (
          produits.map((prod, idx) => (
            <View key={prod.idProduit || idx} style={{ marginBottom: 12 }}>
              <TouchableOpacity
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  backgroundColor: '#7e9a50',
                  borderRadius: 8,
                  marginHorizontal: 24,
                  marginBottom: 2,
                  paddingVertical: 10,
                  paddingHorizontal: 16,
                  elevation: 2,
                }}
                onPress={() => setOpenIndex(openIndex === idx ? null : idx)}
                activeOpacity={0.8}
              >
                <Text style={{
                  color: '#fff',
                  fontWeight: 'bold',
                  fontSize: 16,
                  flex: 1,
                }}>
                  {String(prod.nomProduit)}
                </Text>
                <Text style={{ fontSize: 22, color: '#fff' }}>
                  {openIndex === idx ? '▲' : '▼'}
                </Text>
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
                  shadowColor: '#000',
                  shadowOpacity: 0.05,
                  shadowRadius: 4,
                  elevation: 2,
                }}>
                  <Text style={{ fontWeight: 'bold', marginBottom: 6 }}>Quantité :</Text>
                  <TextInput
                    style={{
                      backgroundColor: '#f9fafb',
                      borderWidth: 1,
                      borderColor: '#d1d5db',
                      borderRadius: 8,
                      padding: 10,
                      marginBottom: 12,
                    }}
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
                    style={{
                      backgroundColor: '#f9fafb',
                      borderWidth: 1,
                      borderColor: '#d1d5db',
                      borderRadius: 8,
                      padding: 10,
                      marginBottom: 12,
                    }}
                  >
                    <Text style={{ color: prod.date ? '#111827' : '#6b7280' }}>
                      {prod.date ? new Date(prod.date).toLocaleDateString() : 'Sélectionner une date'}
                    </Text>
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
                  <Text style={{ fontWeight: 'bold', marginBottom: 6 }}>Statut :</Text>
                  <View style={{
                   borderWidth: 1,
                    borderColor: '#d1d5db',
                    borderRadius: 8,
                    marginBottom: 12,
                    overflow: 'hidden',
                  }}>
                    <Picker
                      selectedValue={prod.statut}
                      onValueChange={itemValue => {
                        const newProduits = [...produits];
                        newProduits[idx].statut = itemValue;
                        setProduits(newProduits);
                      }}
                      style={{ height: 50, width: '100%' }}
                    >
                      <Picker.Item label="Sélectionner un statut" value="" />
                      <Picker.Item label="Conforme" value="Conforme" />
                      <Picker.Item label="Semi-Conforme" value="Semi-Conforme" />
                      <Picker.Item label="Non-Conforme" value="Non-Conforme" />
                    </Picker>
                  </View>

                  <Text style={{ fontWeight: 'bold', marginBottom: 6 }}>Référence de Lot :</Text>
                  <TextInput
                    style={{
                      backgroundColor: '#f9fafb',
                      borderWidth: 1,
                      borderColor: '#d1d5db',
                      borderRadius: 8,
                      padding: 10,
                      marginBottom: 12,
                    }}
                    value={prod.refLot}
                    onChangeText={text => {
                      const newProduits = [...produits];
                      newProduits[idx].refLot = text;
                      setProduits(newProduits);
                    }}
                    placeholder="Référence de Lot"
                  />

                  {prod.statut === 'Semi-Conforme' && (
                    <View>
                      <Text style={{ fontWeight: 'bold', marginBottom: 6 }}>Quantité Conforme :</Text>
                      <TextInput
                        style={{
                          backgroundColor: '#f9fafb',
                          borderWidth: 1,
                          borderColor: '#d1d5db',
                          borderRadius: 8,
                          padding: 10,
                          marginBottom: 12,
                        }}
                        keyboardType="numeric"
                        value={String(prod.qteConf)}
                        onChangeText={text => {
                          const newProduits = [...produits];
                          newProduits[idx].qteConf = text;
                          setProduits(newProduits);
                        }}
                        placeholder="Quantité Conforme"
                      />
                    </View>
                  )}
                </View>
              )}
            </View>
          ))
        ) : (
          <Text style={{ textAlign: 'center', marginVertical: 20, color: '#666' }}>
            Aucun produit à réceptionner pour cet achat.
          </Text>
        )}
      </ScrollView>

      <View style={{
        position: 'absolute',
        left: 0,
        right: 0,
        bottom: 64, // hauteur de la BottomNavBar + petit espace
        flexDirection: 'row',
        justifyContent: 'center',
        gap: 30,
        paddingHorizontal: 24,
        paddingBottom: 35, // petit espace visuel
      }}>
        {/* Affiche "Valider" seulement si l'achat n'est pas déjà réceptionné */}
        {achat.statut !== "Receptionné" && (
          <TouchableOpacity
            style={{
              backgroundColor: '#4338ca',
              paddingVertical: 10,
              paddingHorizontal: 32,
              borderRadius: 8,
              marginRight: 8,
              minWidth: 100,
              alignItems: 'center',
              opacity: loading ? 0.5 : 1, // Désactiver visuellement si loading
            }}
            onPress={() => handleReception("En attente")}
            disabled={loading} // Désactiver le bouton pendant le chargement
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
            alignItems: 'center',
            opacity: loading ? 0.5 : 1, // Désactiver visuellement si loading
          }}
          onPress={() => handleReception("Receptionné")}
          disabled={loading} // Désactiver le bouton pendant le chargement
        >
          <Text style={{ color: '#fff', fontWeight: 'bold', fontSize: 16 }}>Clôturer</Text>
        </TouchableOpacity>
      </View>
      <View style={{ position: 'absolute', left: 0, right: 0, bottom: 0 }}>
        <BottomNavBar navigation={navigation} currentRoute="BuysScreen" />
      </View>
      <Toast />
    </View>
  );
};

export default AddReceptionScreen;