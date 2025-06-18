import React, { useState, useEffect } from 'react';
import {
  View, Dimensions, Text, ActivityIndicator, TouchableOpacity,
  Platform,
} from 'react-native';
import Pdf from 'react-native-pdf';
import TopBar from '../components/TopBar';
import Toast from 'react-native-toast-message';
import RNFetchBlob from 'react-native-blob-util';
import BottomNavBar from '../components/BottomNavBar';

const PdfViewerScreen = ({ navigation, route }) => {
  const { pdfUrl } = route.params;
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [pdfSource, setPdfSource] = useState(null);

  const fetchPdf = async () => {
    try {
      const response = await RNFetchBlob.config({ fileCache: true }).fetch('GET', pdfUrl);
      if (response.respInfo.status !== 200) {
        const errorText = await response.text();
        setError(`Erreur de chargement PDF: ${response.respInfo.status} - ${errorText}`);
      } else {
        setPdfSource({ uri: 'file://' + response.path() });
      }
    } catch (err) {
      setError(`Erreur de chargement PDF: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPdf();
  }, [pdfUrl]);

  const handleDownload = async () => {
    if (!pdfSource || !pdfSource.uri) {
      Toast.show({ type: 'error', text1: 'PDF non chargé', text2: 'Impossible de télécharger' });
      return;
    }

    const fileName = pdfUrl.split('/').pop() || 'facture.pdf';

    // ✅ Dossier public Téléchargements
    const destDir = RNFetchBlob.fs.dirs.DownloadDir;
    const destPath = `${destDir}/${fileName}`;

    try {
      await RNFetchBlob.fs.cp(pdfSource.uri.replace('file://', ''), destPath);

      Toast.show({
        type: 'success',
        text1: 'Téléchargement réussi',
        text2: `Enregistré dans : ${destPath}`,
      });

      console.log("PDF copié à :", destPath);
    } catch (e) {
      Toast.show({
        type: 'error',
        text1: 'Erreur de téléchargement',
        text2: e.message || 'Erreur inconnue',
      });
    }
  };

  return (
    <View style={{ flex: 1 }}>
      <TopBar title="Facture" active="BuysScreen" onGoBack={() => navigation.goBack()} />
      <View style={{ flex: 1, alignItems: 'center', marginTop: 20 }}>
        {loading && <ActivityIndicator size="large" color="#00cc99" />}
        {error && <Text style={{ color: 'red' }}>{error}</Text>}
        {!loading && pdfSource && (
          <Pdf
            source={pdfSource}
            trustAllCerts={false}
            style={{ flex: 1, width: Dimensions.get('window').width }}
            onError={(e) => {
              setError(`Erreur PDF: ${e.message}`);
              Toast.show({ type: 'error', text1: 'Erreur d\'affichage PDF' });
            }}
          />
        )}
      </View>

      <TouchableOpacity
        onPress={handleDownload}
        style={{
          backgroundColor: '#FFD700',
          padding: 15,
          borderRadius: 10,
          alignItems: 'center',
          margin: 20
        }}
      >
        <Text style={{ fontSize: 18, color: 'black', fontWeight: 'bold' }}>
          Télécharger la facture
        </Text>
      </TouchableOpacity>

      <Toast />
      <BottomNavBar navigation={navigation} currentRoute="BuysScreen" />
    </View>
  );
};

export default PdfViewerScreen;