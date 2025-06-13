import React, { useEffect, useState, useRef } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  Image,
  StyleSheet,
} from 'react-native';
import Toast from 'react-native-toast-message';
import { launchImageLibrary } from 'react-native-image-picker';
import TopBar from '../components/TopBar';
import BottomNavBar from '../components/BottomNavBar';
import { Upload } from 'lucide-react-native';
import { useAuth } from '../context/AuthContext';
const defaultImage = require('../assets/default.png'); // chemin relatif vers ton image


const API_BASE_URL = 'http://10.0.2.2:8080';

const AddProductScreen = ({ route, navigation }) => {
  const { id_categorie } = route.params || {};
  console.log('id_categorie:', id_categorie); // <-- Add this line
  const [nom, setNom] = useState('');
  const [description, setDescription] = useState('');
  const [photo, setPhoto] = useState('');
  const [prix, setPrix] = useState('');
  const [unit, setUnit] = useState('');
  const [stockMin, setStockMin] = useState('');
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [items, setItems] = useState([]);
  const [error, setError] = useState('');

  const auth = useAuth();
  console.log("Value returned by useAuth() in AddProductScreen:", auth);
  const { unreadNotificationsCount } = auth;

  // focus states
  const [focus, setFocus] = useState({
    nom: false, description: false, prix: false, unit: false, stockMin: false
  });

  const onFocus = (f) => setFocus((p) => ({ ...p, [f]: true }));
  const onBlur  = (f) => setFocus((p) => ({ ...p, [f]: false }));

  const handleSelectImage = () => {
    launchImageLibrary({ mediaType: 'photo' }, (res) => {
      if (res.assets?.length) setPhoto(res.assets[0].uri);
    });
  };

  const handleAddProduct = async () => {
    if (!nom || !prix || !stockMin) {
      return Toast.show({
        type: 'error',
        text1: 'Nom, prix et stock min. obligatoires',
        position: 'top',
        visibilityTime: 2000,
      });
    }
    setLoading(true);

    // Set default image path as string if none selected
    const defaultImagePath = 'default.png'; // or 'default.png' if that's the file

    const payload = {
      nom,
      description,
      photo: photo || defaultImagePath, // Use string path for default
      prix: parseFloat(prix),
      unit,
      stockMin: parseInt(stockMin, 10),
      categorieId: id_categorie,
    };

    try {
      const res = await fetch(`${API_BASE_URL}/produits/add`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw await res.json();

      // Show success toast BEFORE navigating back
      Toast.show({
        type: 'success',
        text1: '✅ Produit ajouté avec succès',
        text2: 'Votre produit a été enregistré.',
        position: 'top',
      });

      // Delay navigation to allow toast to show
      setTimeout(() => {
        navigation.goBack();
      }, 1400); // 1.2 seconds is enough for the toast to appear
    } catch (err) {
      console.error(err);
      Toast.show({
        type: 'error',
        text1: '❌ Échec de l\'ajout',
        text2: err.message || 'Vérifiez les champs ou réessayez.',
        position: 'top',
      });

    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={{ flex: 1, backgroundColor: '#f3f4f6' }}>
      <TopBar
        title="Ajouter un Produit"
        onGoBack={() => navigation.goBack()}
        activeLeftIcon="ProductAD"
        onNotificationPress={() => navigation.navigate('AdminNotifications')}
        notificationCount={unreadNotificationsCount}
        onSettingsPress={() => navigation.navigate('Settings')}
      />
      <ScrollView contentContainerStyle={{ padding: 16 }}>
        <Text style={styles.pageTitle}>Ajouter produit</Text>
 
        <View style={styles.form}>
          {/** Nom */}
          <Text style={styles.label}>Nom du produit *</Text>
          <TextInput
            value={nom}
            onChangeText={setNom}
            onFocus={() => onFocus('nom')} onBlur={() => onBlur('nom')}
            placeholder="Nom du produit *"
            style={[styles.input, focus.nom && styles.inputFocused]}
          />

          {/** Description */}
          <Text style={styles.label}>Description</Text>
          <TextInput
            value={description}
            onChangeText={setDescription}
            onFocus={() => onFocus('description')} onBlur={() => onBlur('description')}
            placeholder="Description"
            multiline numberOfLines={3}
            style={[styles.input, styles.textarea, focus.description && styles.inputFocused]}
          />

          {/** Image */}
          <TouchableOpacity onPress={handleSelectImage} style={styles.uploadBtn}>
            <Upload size={20} color="#3F6F38" />
            <Text style={styles.uploadText}>
              {photo ? 'Changer image' : 'Ajouter image'}
            </Text>
          </TouchableOpacity>
          <Image
  source={photo ? { uri: photo } : defaultImage}
  style={styles.preview}
/>

          {/** Prix, unité, stock */}
          <Text style={styles.label}>Prix *</Text>
          <TextInput
            value={prix}
            onChangeText={setPrix}
            onFocus={() => onFocus('prix')} onBlur={() => onBlur('prix')}
            placeholder="Prix *"
            keyboardType="numeric"
            style={[styles.input, focus.prix && styles.inputFocused]}
          />

          <Text style={styles.label}>Unité</Text>
          <TextInput
            value={unit}
            onChangeText={setUnit}
            onFocus={() => onFocus('unit')} onBlur={() => onBlur('unit')}
            placeholder="Unité (ex: Kg)"
            style={[styles.input, focus.unit && styles.inputFocused]}
          />

          <Text style={styles.label}>Stock Min.</Text>
          <TextInput
            value={stockMin}
            onChangeText={setStockMin}
            onFocus={() => onFocus('stockMin')} onBlur={() => onBlur('stockMin')}
            placeholder="Stock minimum"
            keyboardType="numeric"
            style={[styles.input, focus.stockMin && styles.inputFocused]}
          />

          {/** Boutons */}
          <View style={styles.btnRow}>
            <TouchableOpacity
              onPress={() => navigation.goBack()}
              style={[styles.btn, { backgroundColor: '#9ca3af' }]}
              disabled={loading}
            >
              <Text style={styles.btnText}>Annuler</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={handleAddProduct}
              style={[styles.btn, { backgroundColor: '#16a34a' }]}
              disabled={loading}
            >
              {loading
                ? <ActivityIndicator color="#fff"/>
                : <Text style={styles.btnText}>Ajouter</Text>
              }
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
      <BottomNavBar navigation={navigation} currentRoute="ProductAD" />
      <Toast />
    </View>
  );
};

const styles = StyleSheet.create({
  form: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 10,
    elevation: 2,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#166534',
    marginBottom: 6,
  },
  pageTitle: {
   fontSize: 30,
        fontWeight: 'bold',
        marginTop: 19,
        color: '#4A444A',
        marginBottom: 16,
        alignSelf: 'center',
        marginTop: 14,   // Ajouté
},

  input: {
    backgroundColor: '#CAD7C5',
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#CAD7C5',
    marginBottom: 16,
  },
  textarea: {
    textAlignVertical: 'top',
    height: 100,
  },
  inputFocused: {
    borderColor: '#166534',
    borderWidth: 2,
    backgroundColor: '#f0f0f0',
  },
  uploadBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#98BB89',
    backgroundColor: '#FFF4B1',
    padding: 12,
    borderRadius: 8,
    marginBottom: 14,
  },
  uploadText: {
    marginLeft: 8,
    color: '#3F6F38',
    fontWeight: '600',
  },
  preview: {
    width: '100%',
    height: 180,
    borderRadius: 8,
    marginBottom: 16,
  },
  btnRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  btn: {
    flex: 1,
    marginHorizontal: 6,
    padding: 14,
    borderRadius: 8,
    alignItems: 'center',
    elevation: 2,
  },
  btnText: {
    color: '#fff',
    fontWeight: '700',
  },
});

export default AddProductScreen;




