import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  StyleSheet,
} from 'react-native';
import Toast from 'react-native-toast-message';
import TopBar from '../components/TopBar';
import BottomNavBar from '../components/BottomNavBar';
import { Picker } from '@react-native-picker/picker';
import DateTimePicker from '@react-native-community/datetimepicker';

const API_BASE_URL = 'http://10.0.2.2:8080';

const EditAchatScreen = ({ route, navigation }) => {
  const { idAchat } = route.params;

  const [fournisseurs, setFournisseurs] = useState([]);
  const [categories, setCategories] = useState([]);
  const [produits, setProduits] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // Champs de l'achat
  const [fournisseurSelected, setFournisseurSelected] = useState(null);
  const [date, setDate] = useState('');
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [categorieSelected, setCategorieSelected] = useState(null);
  const [produitSelected, setProduitSelected] = useState('');
  const [lignes, setLignes] = useState([]);

  // Fetch initial data
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch fournisseurs
        const fournisseursRes = await fetch(`${API_BASE_URL}/api/users`);
        const fournisseursData = await fournisseursRes.json();
        setFournisseurs(fournisseursData.filter(u => u.role === 'fournisseur'));

        // Fetch catégories
        const categoriesRes = await fetch(`${API_BASE_URL}/categories/all`);
        setCategories(await categoriesRes.json());

        // Fetch achat à éditer
        const achatRes = await fetch(`${API_BASE_URL}/api/achats/${idAchat}`);
        const achatData = await achatRes.json();
        setFournisseurSelected(achatData.idFournisseur);
        setDate(achatData.dateAchat);
        setLignes(
          achatData.lignes?.map(l => ({
            ...l,
            quantite: l.quantite.toString(),
            prix: l.prix.toString(),
            total: l.total,
            produit: l.produit, // optionnel selon ton backend
            key: `${l.idProduit}_${Date.now()}_${Math.random()}`,
          })) || []
        );
        // Optionnel : setCategorieSelected selon ton modèle
      } catch (err) {
        Toast.show({
          type: 'error',
          text1: 'Erreur chargement',
          text2: err.message,
        });
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [idAchat]);

  // Fetch produits selon catégorie
  useEffect(() => {
    if (!categorieSelected) {
      setProduits([]);
      setProduitSelected('');
      return;
    }
    fetch(`${API_BASE_URL}/produits/byCategorie/${categorieSelected}`)
      .then(res => res.json())
      .then(data => setProduits(Array.isArray(data) ? data : []));
  }, [categorieSelected]);

  const totalGeneral = lignes.reduce((sum, l) => sum + (Number(l.total) || 0), 0);

  const handleUpdateAchat = async () => {
    if (!fournisseurSelected || !date || lignes.length === 0) {
      return Toast.show({
        type: 'error',
        text1: 'Tous les champs sont obligatoires',
        position: 'top',
      });
    }
    setSaving(true);
    try {
      const achat = {
        idAchat,
        dateAchat: date,
        idFournisseur: fournisseurSelected,
        montantTotal: totalGeneral,
        lignes: lignes.map(l => ({
          idProduit: l.produit?.id_produit || l.idProduit,
          quantite: Number(l.quantite),
          prix: Number(l.prix),
          total: Number(l.total),
        })),
      };
      const res = await fetch(`${API_BASE_URL}/api/achats/${idAchat}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(achat),
      });
      if (!res.ok) throw new Error('Erreur serveur');
      Toast.show({
        type: 'success',
        text1: 'Achat modifié avec succès',
        position: 'top',
      });
      setTimeout(() => navigation.navigate('BuysScreen', { refresh: Date.now() }), 1200);
    } catch (err) {
      Toast.show({
        type: 'error',
        text1: 'Erreur',
        text2: err.message,
        position: 'top',
      });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#00cc99" />
      </View>
    );
  }

  return (
    <View style={{ flex: 1, backgroundColor: '#f3f4f6' }}>
      <TopBar
        title="Modifier Achat"
        onGoBack={() => navigation.goBack()}
      />
      <ScrollView contentContainerStyle={{ padding: 16, paddingBottom: 80 }}>
        <Text style={styles.pageTitle}>Modifier Achat</Text>

        {/* Fournisseur */}
        <Text style={styles.label}>Fournisseur *</Text>
        <View style={styles.dropdown}>
          <Picker
            selectedValue={fournisseurSelected}
            onValueChange={setFournisseurSelected}
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
              selectedValue={produitSelected}
              onValueChange={setProduitSelected}
              enabled={produits.length > 0}
            >
              <Picker.Item label="Sélectionnez un produit" value="" />
              {produits.map(p => (
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
        <Text style={[styles.pageTitle, { marginTop: 24 }]}>
          Total Général: {totalGeneral.toFixed(2)} DH
        </Text>

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
            onPress={handleUpdateAchat}
            style={[styles.btn, { backgroundColor: '#16a34a' }]}
            disabled={saving}
          >
            {saving ? <ActivityIndicator color="#fff" /> : <Text style={styles.btnText}>Mettre à jour</Text>}
          </TouchableOpacity>
        </View>
      </ScrollView>
      <BottomNavBar navigation={navigation} currentRoute="BuysScreen" />
      <Toast />
    </View>
  );
};

const styles = StyleSheet.create({
  pageTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
    color: '#1f2937',
    textAlign: 'center',
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 6,
    marginTop: 12,
  },
  dropdown: {
    backgroundColor: '#fff',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#CAD7C5',
    marginBottom: 16,
    maxHeight: 150,
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
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f3f4f6',
  },
});

export default EditAchatScreen;