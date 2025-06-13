import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, TextInput, ScrollView, Platform } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import DateTimePicker from '@react-native-community/datetimepicker';
import TopBar from '../components/TopBar';
import BottomNavBar from '../components/BottomNavBar';
import { useAuth } from '../context/AuthContext';

const AddReceptionScreen = ({ navigation, route }) => {
  const { unreadNotificationsCount } = useAuth();
  const { achat } = route.params;
  const [produits, setProduits] = useState(
    route.params.produits.map(prod => ({
      ...prod,
      quantite: '', // Champ vide au départ
    }))
  );
  const [openIndex, setOpenIndex] = useState(null);
  const [datePickerIdx, setDatePickerIdx] = useState(null);
  const [loading, setLoading] = useState(false);

  const showDatePicker = idx => setDatePickerIdx(idx);
  const hideDatePicker = () => setDatePickerIdx(null);

  const handleReception = (achatStatut) => {
    const depassement = produits.find(prod => {
      const quantiteSaisie = prod.statut === 'Semi-Conforme'
        ? Number(prod.qteConf) || 0
        : Number(prod.quantite) || 0;
      return quantiteSaisie > prod.quantiteAchat;
    });

    if (depassement) {
      alert(
        `La quantité saisie (${depassement.statut === 'Semi-Conforme' ? depassement.qteConf : depassement.quantite}) pour le produit "${depassement.nom}" dépasse la quantité de l'achat (${depassement.quantiteAchat}) !`
      );
      return; // On bloque l'envoi
    }

    fetch('http://10.0.2.2:8080/receptions', { // ← adapte ici selon ton environnement
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

          return {
            idProduit: prod.idProduit,
            dateReception: prod.date,
            quantite: quantiteStockee,
            statut: prod.statut,
            refLot: prod.refLot,
          };
        })
      })
    })
    .then(res => {
      if (res.ok) {
        navigation.navigate('BuysScreen', { refresh: true });
      } else {
        alert('Erreur lors de la validation');
      }
    })
    .catch(() => alert('Erreur de connexion au serveur'));
  };

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
          Achat #{achat.idAchat}
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
                  {prod.nomProduit}
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
                    value={prod.quantite}
                    onChangeText={text => {
                      const newProduits = [...produits];
                      newProduits[idx].quantite = text;
                      setProduits(newProduits);
                    }}
                    placeholder="Quantité"
                  />

                  <Text style={{ fontWeight: 'bold', marginBottom: 6 }}>Date :</Text>
                  <TouchableOpacity
                    style={{
                      backgroundColor: '#e6f4d7',
                      borderRadius: 8,
                      borderWidth: 1,
                      borderColor: '#b5c9a3',
                      padding: 10,
                      marginBottom: 12,
                    }}
                    onPress={() => showDatePicker(idx)}
                  >
                    <Text style={{ color: '#222' }}>
                      {prod.date ? prod.date : 'Choisir une date'}
                    </Text>
                  </TouchableOpacity>
                  {datePickerIdx === idx && (
                    <DateTimePicker
                      value={prod.date ? new Date(prod.date) : new Date()}
                      mode="date"
                      display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                      onChange={(event, selectedDate) => {
                        hideDatePicker();
                        if (selectedDate) {
                          const newProduits = [...produits];
                          // Format YYYY-MM-DD
                          const d = selectedDate;
                          const formatted = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
                          newProduits[idx].date = formatted;
                          setProduits(newProduits);
                        }
                      }}
                    />
                  )}

                  <Text style={{ fontWeight: 'bold', marginBottom: 6 }}>Statut :</Text>
                  <View style={{
                    backgroundColor: '#e6f4d7',
                    borderRadius: 8,
                    borderWidth: 1,
                    borderColor: '#b5c9a3',
                    marginBottom: 12,
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
                      <Picker.Item label="Conforme" value="Conforme" />
                      <Picker.Item label="Semi-Conforme" value="Semi-Conforme" />
                      <Picker.Item label="Non-Conforme" value="Non-Conforme" />
                    </Picker>
                  </View>

                  {/* Champs supplémentaires si Semi-Conforme */}
                  {prod.statut === 'Semi-Conforme' && (
                    <View>
                      <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 10 }}>
                        <Text style={{
                          backgroundColor: '#d1d5db',
                          borderRadius: 6,
                          padding: 8,
                          marginRight: 8,
                          minWidth: 90,
                          textAlign: 'center',
                          fontWeight: 'bold'
                        }}>Qte Conf :</Text>
                        <TextInput
                          style={{
                            backgroundColor: '#f3f4f6',
                            borderWidth: 1,
                            borderColor: '#d1d5db',
                            borderRadius: 6,
                            padding: 8,
                            minWidth: 60,
                          }}
                          keyboardType="numeric"
                          value={prod.qteConf ? String(prod.qteConf) : ''}
                          onChangeText={v => {
                            const newProduits = [...produits];
                            newProduits[idx].qteConf = v;
                            setProduits(newProduits);
                          }}
                          placeholder="0"
                        />
                      </View>
                      <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 10 }}>
                        <Text style={{
                          backgroundColor: '#d1d5db',
                          borderRadius: 6,
                          padding: 8,
                          marginRight: 8,
                          minWidth: 90,
                          textAlign: 'center',
                          fontWeight: 'bold'
                        }}>Qte NonConf :</Text>
                        <TextInput
                          style={{
                            backgroundColor: '#f3f4f6',
                            borderWidth: 1,
                            borderColor: '#d1d5db',
                            borderRadius: 6,
                            padding: 8,
                            minWidth: 60,
                          }}
                          keyboardType="numeric"
                          value={prod.qteNonConf ? String(prod.qteNonConf) : ''}
                          onChangeText={v => {
                            const newProduits = [...produits];
                            newProduits[idx].qteNonConf = v;
                            setProduits(newProduits);
                          }}
                          placeholder="0"
                        />
                      </View>
                    </View>
                  )}

                  <Text style={{ fontWeight: 'bold', marginBottom: 6 }}>Réf du lot :</Text>
                  <TextInput
                    style={{
                      backgroundColor: '#f9fafb',
                      borderWidth: 1,
                      borderColor: '#d1d5db',
                      borderRadius: 8,
                      padding: 10,
                      marginBottom: 8,
                    }}
                    value={prod.refLot || ''}
                    onChangeText={v => {
                      const newProduits = [...produits];
                      newProduits[idx].refLot = v;
                      setProduits(newProduits);
                    }}
                    placeholder="Entrer la référence du lot"
                  />
                </View>
              )}
            </View>
          ))
        ) : (
          <Text style={{ textAlign: 'center', color: '#888' }}>Aucun produit</Text>
        )}
      </ScrollView>
      {/* Boutons en bas, juste au-dessus de la BottomNavBar */}
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
            }}
            onPress={() => handleReception("En attente")}
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
          }}
          onPress={() => handleReception("Receptionné")}
        >
          <Text style={{ color: '#fff', fontWeight: 'bold', fontSize: 16 }}>Clôturer</Text>
        </TouchableOpacity>
      </View>
      <View style={{ position: 'absolute', left: 0, right: 0, bottom: 0 }}>
        <BottomNavBar navigation={navigation} currentRoute="BuysScreen" />
      </View>
    </View>
  );
};

export default AddReceptionScreen;