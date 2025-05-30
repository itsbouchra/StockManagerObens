import React, { useEffect, useState } from 'react';
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

const API_BASE_URL = 'http://10.0.2.2:8080';

const EditProductScreen = ({ route, navigation }) => {
  const { id_produit } = route.params;

  const [nom, setNom] = useState('');
  const [description, setDescription] = useState('');
  const [photo, setPhoto] = useState(''); // For preview, use URI or server URL
  const [photoData, setPhotoData] = useState(null); // For uploading image file
  const [prix, setPrix] = useState('');
  const [unit, setUnit] = useState('');
  const [stockMin, setStockMin] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [photoFilename, setPhotoFilename] = useState('');


  const [focus, setFocus] = useState({
    nom: false,
    description: false,
    prix: false,
    unit: false,
    stockMin: false,
  });

  const onFocus = (field) => setFocus((prev) => ({ ...prev, [field]: true }));
  const onBlur = (field) => setFocus((prev) => ({ ...prev, [field]: false }));

  useEffect(() => {
    const fetchProduit = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/produits/${id_produit}`);
        if (!res.ok) throw new Error('Erreur lors du chargement');
        const data = await res.json();

        setNom(data.nom || '');
        setDescription(data.description || '');
        // Show photo URL from server
        setPhoto(data.photo ? `${API_BASE_URL}/images/${data.photo.trim()}` : '');
        setPrix(data.prix != null ? data.prix.toString() : '');
        setUnit(data.unit || '');
        setStockMin(data.stockMin != null ? data.stockMin.toString() : '');
        setPhotoData(null); // Clear local photo data on fetch
        setPhoto(data.photo ? `${API_BASE_URL}/images/${data.photo.trim()}` : '');
setPhotoFilename(data.photo || '');

      } catch (err) {
        Toast.show({
          type: 'error',
          text1: 'Erreur de chargement',
          text2: err.message,
          position: 'top',
        });
      } finally {
        setLoading(false);
      }
    };
    fetchProduit();
  }, [id_produit]);

  const handleSelectImage = () => {
    launchImageLibrary({ mediaType: 'photo' }, (res) => {
      if (res.assets?.length) {
        const asset = res.assets[0];
        setPhoto(asset.uri);
        setPhotoData({
          name: asset.fileName || 'photo.jpg',
          type: asset.type,
          uri: asset.uri,
        });
      }
    });
  };

  const handleUpdateProduct = async () => {
    if (!nom || !prix) {
      return Toast.show({
        type: 'error',
        text1: 'Nom et prix obligatoires',
        position: 'top',
        visibilityTime: 2000,
      });
    }

    setSaving(true);

    try {
      let res;

      // If photoData exists, upload with multipart/form-data
      if (photoData) {
        const formData = new FormData();
        formData.append('nom', nom);
        formData.append('description', description);
        formData.append('prix', parseFloat(prix));
        formData.append('unit', unit);
        formData.append('stockMin', stockMin ? parseInt(stockMin, 10) : 0);
        formData.append('photo', {
          uri: photoData.uri,
          name: photoData.name,
          type: photoData.type,
        });

        res = await fetch(`${API_BASE_URL}/produits/${id_produit}`, {
          method: 'PUT',
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'multipart/form-data',
          },
          body: formData,
        });
      } else {
        // If no new photo selected, send JSON without photo
       const payload = {
          nom,
          description,
          prix: parseFloat(prix),
          unit,
          stockMin: stockMin ? parseInt(stockMin, 10) : 0,
          photo: photoFilename, // Send existing photo name if not changed
};


        res = await fetch(`${API_BASE_URL}/produits/${id_produit}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });
      }

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || 'Erreur serveur');
      }

     Toast.show({
  type: 'success',
  text1: '✅ Produit modifié avec succès',
  text2: 'Votre produit a été mis à jour.',
  position: 'top',
});

      // Delay navigation to allow toast to show
      setTimeout(() => {
        navigation.goBack();
      }, 1400); // 1.4 seconds, same as add
    } catch (err) {
      Toast.show({
        type: 'error',
        text1: 'Échec de la mise à jour',
        text2: err.message || 'Réessayez.',
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
        title="Produits"
        active="ProductAD"
        onGoBack={() => navigation.goBack()}
      />
      <ScrollView contentContainerStyle={{ padding: 16 }}>
        <Text style={styles.pageTitle}>Modifier produit</Text>

        <View style={styles.form}>
          <Text style={styles.label}>Nom du produit *</Text>
          <TextInput
            value={nom}
            onChangeText={setNom}
            onFocus={() => onFocus('nom')}
            onBlur={() => onBlur('nom')}
            placeholder="Nom du produit *"
            style={[styles.input, focus.nom && styles.inputFocused]}
          />

          <Text style={styles.label}>Description</Text>
          <TextInput
            value={description}
            onChangeText={setDescription}
            onFocus={() => onFocus('description')}
            onBlur={() => onBlur('description')}
            placeholder="Description"
            multiline
            numberOfLines={3}
            style={[styles.input, styles.textarea, focus.description && styles.inputFocused]}
          />

          <TouchableOpacity onPress={handleSelectImage} style={styles.uploadBtn}>
            <Upload size={20} color="#3F6F38" />
            <Text style={styles.uploadText}>{photo ? 'Changer image' : 'Ajouter image'}</Text>
          </TouchableOpacity>

          {photo ? (
            <Image source={{ uri: photo }} style={styles.preview} />
          ) : null}

          <Text style={styles.label}>Prix *</Text>
          <TextInput
            value={prix}
            onChangeText={setPrix}
            onFocus={() => onFocus('prix')}
            onBlur={() => onBlur('prix')}
            placeholder="Prix *"
            keyboardType="numeric"
            style={[styles.input, focus.prix && styles.inputFocused]}
          />

          <Text style={styles.label}>Unité</Text>
          <TextInput
            value={unit}
            onChangeText={setUnit}
            onFocus={() => onFocus('unit')}
            onBlur={() => onBlur('unit')}
            placeholder="Unité (ex: Kg)"
            style={[styles.input, focus.unit && styles.inputFocused]}
          />

          <Text style={styles.label}>Stock Min.</Text>
          <TextInput
            value={stockMin}
            onChangeText={setStockMin}
            onFocus={() => onFocus('stockMin')}
            onBlur={() => onBlur('stockMin')}
            placeholder="Stock minimum"
            keyboardType="numeric"
            style={[styles.input, focus.stockMin && styles.inputFocused]}
          />

          <View style={styles.btnRow}>
            <TouchableOpacity
              onPress={() => navigation.goBack()}
              style={[styles.btn, { backgroundColor: '#9ca3af' }]}
              disabled={saving}
            >
              <Text style={styles.btnText}>Annuler</Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={handleUpdateProduct}
              style={[styles.btn, { backgroundColor: '#16a34a' }]}
              disabled={saving}
            >
              {saving ? <ActivityIndicator color="#fff" /> : <Text style={styles.btnText}>Mettre à jour</Text>}
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
  pageTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
    color: '#1f2937',
    textAlign: 'center',
  },
  form: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 8,
    elevation: 4,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 6,
    marginTop: 12,
  },
  input: {
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 8,
    padding: 10,
    fontSize: 16,
    backgroundColor: '#f9fafb',
    color: '#111827',
  },
  inputFocused: {
    borderColor: '#2563eb',
    backgroundColor: '#fff',
  },
  textarea: {
    textAlignVertical: 'top',
    minHeight: 80,
  },
  uploadBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#d1fae5',
    padding: 10,
    borderRadius: 8,
    marginTop: 10,
  },
  uploadText: {
    marginLeft: 8,
    color: '#065f46',
    fontSize: 16,
    fontWeight: '500',
  },
  preview: {
    width: '100%',
    height: 180,
    borderRadius: 8,
    marginTop: 12,
    resizeMode: 'cover',
  },
  btnRow: {
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
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f3f4f6',
  },
});

export default EditProductScreen;
