import React, { useState, useEffect } from 'react';
import { View, Dimensions, Text, ActivityIndicator, TouchableOpacity, Platform, PermissionsAndroid } from 'react-native';
import Pdf from 'react-native-pdf';
import SupplierTopBar from '../components/SupplierTopBar';
import Toast from 'react-native-toast-message';
import RNFetchBlob from 'react-native-blob-util';
import SupplierBottomNavBar from '../components/SupplierBottomNavBar';
import { useAuth } from '../context/AuthContext';

const SupplierPdfViewerScreen = ({ navigation, route }) => {
  const { pdfUrl } = route.params;
  const { unreadNotificationsCount } = useAuth();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [pdfSource, setPdfSource] = useState(null);

  const fetchPdf = async () => {
    try {
      const response = await RNFetchBlob.config({ fileCache: true }).fetch('GET', pdfUrl);
      if (response.respInfo.status !== 200) {
        const errorText = await response.text();
        setError(`Failed to load PDF: ${response.respInfo.status} - ${errorText}`);
      } else {
        setPdfSource({ uri: 'file://' + response.path() });
      }
    } catch (err) {
      setError(`Error fetching PDF: ${err.message || 'Unknown error'}`);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPdf();
  }, [pdfUrl]);

  const handleDownload = async () => {
    if (!pdfSource || !pdfSource.uri) {
      Toast.show({ type: 'error', text1: 'Download Error', text2: 'PDF not loaded yet.' });
      return;
    }
    const filePath = pdfSource.uri.replace('file://', '');
    const fileName = pdfUrl.split('/').pop() || 'facture.pdf';
    const downloadDir = Platform.select({
      ios: RNFetchBlob.fs.dirs.DocumentDir,
      android: RNFetchBlob.fs.dirs.DownloadDir,
    });
    const destinationPath = `${downloadDir}/${fileName}`;
    try {
      if (Platform.OS === 'android') {
        RNFetchBlob.config({
          addAndroidDownloads: {
            useDownloadManager: true,
            notification: true,
            path: destinationPath,
            mime: 'application/pdf',
            description: 'Downloading invoice.',
          },
        })
        .fetch('GET', pdfUrl)
        .then((res) => {
          Toast.show({ type: 'success', text1: 'Download Complete', text2: `File saved to ${res.path()}` });
        })
        .catch((e) => {
          Toast.show({ type: 'error', text1: 'Download Failed', text2: `Error saving file: ${e.message || 'Unknown error'}` });
        });
      } else {
        await RNFetchBlob.fs.copyFile(filePath, destinationPath);
        Toast.show({ type: 'success', text1: 'Download Complete', text2: `File saved to ${destinationPath}` });
      }
    } catch (e) {
      Toast.show({ type: 'error', text1: 'Download Failed', text2: `An unexpected error occurred: ${e.message || 'Unknown error'}` });
    }
  };

  return (
    <View style={{ flex: 1 }}>
      <SupplierTopBar
        title="Facture"
        onGoBack={() => navigation.goBack()}
        iconName="sell"
        active={true}
        notificationCount={unreadNotificationsCount}
      />
      <View style={{ flex: 1, justifyContent: 'flex-start', alignItems: 'center', marginTop: 20 }}>
        {loading && (
          <View style={{ position: 'absolute', top: '50%', left: '50%', transform: [{ translateX: -20 }, { translateY: -20 }] }}>
            <ActivityIndicator size="large" color="#00cc99" />
          </View>
        )}
        {error && (
          <View style={{ padding: 20, alignItems: 'center' }}>
            <Text style={{ color: 'red', fontSize: 16, textAlign: 'center' }}>
              Erreur lors du chargement du PDF: {error}
            </Text>
          </View>
        )}
        {!loading && pdfSource && (
          <Pdf
            source={pdfSource}
            trustAllCerts={false}
            onLoadComplete={(numberOfPages, filePath) => setLoading(false)}
            onPageChanged={() => {}}
            onError={(error) => {
              setError(`Error rendering PDF: ${error.message || 'Unknown rendering error'}`);
              setLoading(false);
              Toast.show({ type: 'error', text1: 'Erreur', text2: "Impossible d'afficher le PDF ❌" });
            }}
            onPressLink={() => {}}
            style={{ flex: 1, width: Dimensions.get('window').width, height: Dimensions.get('window').height }}
          />
        )}
      </View>
      <TouchableOpacity
        onPress={handleDownload}
        style={{ backgroundColor: '#FFD700', padding: 15, borderRadius: 10, alignItems: 'center', margin: 20 }}
      >
        <Text style={{ fontSize: 18, color: 'black', fontWeight: 'bold' }}>
          Télécharger la facture
        </Text>
      </TouchableOpacity>
      <Toast />
      <SupplierBottomNavBar navigation={navigation} currentRoute="SupplierSell" />
    </View>
  );
};

export default SupplierPdfViewerScreen; 