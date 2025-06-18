import React, { useState, useEffect } from 'react';
import {
  View,
  Dimensions,
  Text,
  ActivityIndicator,
  TouchableOpacity,
  Platform,
  StyleSheet,
  Alert,
} from 'react-native';
import Pdf from 'react-native-pdf';
import Toast from 'react-native-toast-message';
import RNFetchBlob from 'react-native-blob-util';
import CustomerBottomNavBar from '../components/CustomerBottomNavBar';
import { useNavigation, useRoute } from '@react-navigation/native';
import { ArrowLeft, Bell, Settings, ClipboardList } from 'lucide-react-native'; // Utilise ClipboardList comme remplacement de ClipboardListSign
import { API_ENDPOINTS, handleApiError } from '../config/api';
import TopBar from '../components/TopBar';

const CustomerPdfViewerScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { pdfUrl, type } = route.params;
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [pdfSource, setPdfSource] = useState(null);

  useEffect(() => {
    loadPdf();
  }, []);

  const loadPdf = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await RNFetchBlob.config({
        fileCache: true,
        appendExt: 'pdf',
      }).fetch('GET', pdfUrl);

      if (response.respInfo.status !== 200) {
        const errorText = await response.text();
        setError(`Erreur de chargement PDF: ${response.respInfo.status} - ${errorText}`);
      } else {
        setPdfSource({ uri: 'file://' + response.path() });
      }
    } catch (err) {
      const errorInfo = handleApiError(err);
      setError(`Erreur de chargement PDF: ${errorInfo.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = async () => {
    try {
      const { config, fs } = RNFetchBlob;
      const destDir = fs.dirs.DownloadDir;
      const fileName = `${type}_${Date.now()}.pdf`;
      const destPath = `${destDir}/${fileName}`;

      await config({
        fileCache: true,
        appendExt: 'pdf',
        path: destPath,
      }).fetch('GET', pdfUrl);

      Toast.show({
        type: 'success',
        text1: 'Téléchargement réussi',
        text2: `Enregistré dans : ${destPath}`,
        position: 'top',
      });
    } catch (err) {
      const errorInfo = handleApiError(err);
      Toast.show({
        type: 'error',
        text1: 'Erreur de téléchargement',
        text2: errorInfo.message,
        position: 'top',
      });
    }
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <TopBar
          title="PDF Viewer"
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

  if (error) {
    return (
      <View style={styles.container}>
        <TopBar
          title="PDF Viewer"
          onGoBack={() => navigation.goBack()}
          onNotificationPress={() => navigation.navigate('Notifications')}
          onSettingsPress={() => navigation.navigate('Settings')}
        />
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>{error}</Text>
          <TouchableOpacity style={styles.retryButton} onPress={loadPdf}>
            <Text style={styles.retryButtonText}>Réessayer</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <TopBar
        title="PDF Viewer"
        onGoBack={() => navigation.goBack()}
        onNotificationPress={() => navigation.navigate('Notifications')}
        onSettingsPress={() => navigation.navigate('Settings')}
      />
      <View style={styles.pdfContainer}>
        <Pdf
          source={pdfSource}
          style={styles.pdf}
          onLoadComplete={(numberOfPages, filePath) => {
            console.log(`Number of pages: ${numberOfPages}`);
          }}
          onPageChanged={(page, numberOfPages) => {
            console.log(`Current page: ${page}`);
          }}
          onError={(error) => {
            console.log(error);
            setError(`Erreur PDF: ${error.message}`);
          }}
        />
      </View>
      <TouchableOpacity style={styles.downloadButton} onPress={handleDownload}>
        <Text style={styles.downloadButtonText}>Télécharger</Text>
      </TouchableOpacity>
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
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  errorText: {
    fontSize: 16,
    color: '#dc2626',
    textAlign: 'center',
    marginBottom: 20,
  },
  retryButton: {
    backgroundColor: '#6b8e23',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
  },
  retryButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  pdfContainer: {
    flex: 1,
    backgroundColor: '#fff',
  },
  pdf: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  downloadButton: {
    position: 'absolute',
    right: 20,
    bottom: 20,
    backgroundColor: '#6b8e23',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 8,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
  },
  downloadButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default CustomerPdfViewerScreen;