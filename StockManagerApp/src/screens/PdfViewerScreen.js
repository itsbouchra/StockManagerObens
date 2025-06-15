import React, { useState, useEffect } from 'react';
import { View, Dimensions, Text, ActivityIndicator, TouchableOpacity, Platform, PermissionsAndroid } from 'react-native';
import Pdf from 'react-native-pdf';
import TopBar from '../components/TopBar';
import Toast from 'react-native-toast-message';
import RNFetchBlob from 'react-native-blob-util';
import BottomNavBar from '../components/BottomNavBar';
import { useAuth } from '../context/AuthContext';

const PdfViewerScreen = ({ navigation, route }) => {
  const { pdfUrl } = route.params;
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [pdfSource, setPdfSource] = useState(null);
  const { unreadNotificationsCount } = useAuth();

  console.log('Loading PDF from URL:', pdfUrl);

  const fetchPdf = async () => {
    try {
      const response = await RNFetchBlob.config({
        fileCache: true,
        // appendExt : 'pdf'
      })
      .fetch('GET', pdfUrl);

      if (response.respInfo.status !== 200) {
        const errorText = await response.text();
        setError(`Failed to load PDF: ${response.respInfo.status} - ${errorText}`);
      } else {
        // react-native-pdf can load from a file path
        setPdfSource({ uri: 'file://' + response.path() });
      }
    } catch (err) {
      console.error('Error fetching PDF:', err);
      setError(`Error fetching PDF: ${err.message || 'Unknown error'}`);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPdf();
  }, [pdfUrl]); // Refetch if pdfUrl changes

  const handleDownload = async () => {
    if (!pdfSource || !pdfSource.uri) {
      Toast.show({
        type: 'error',
        text1: 'Download Error',
        text2: 'PDF not loaded yet.',
      });
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
        // Use addAndroidDownloads for proper handling of downloads on Android
        RNFetchBlob.config({
          addAndroidDownloads: {
            useDownloadManager: true,
            notification: true,
            path: destinationPath,
            mime: 'application/pdf',
            description: 'Downloading invoice.',
          },
        })
        .fetch('GET', pdfUrl) // Fetch the URL directly
        .then((res) => {
          // The download manager is handling the file saving
          console.log('Download complete. File saved to:', res.path());
          Toast.show({
            type: 'success',
            text1: 'Download Complete',
            text2: `File saved to ${res.path()}`,
          });
        })
        .catch((e) => {
           console.error('Download error:', e);
            Toast.show({
              type: 'error',
              text1: 'Download Failed',
              text2: `Error saving file: ${e.message || 'Unknown error'}`,
            });
        });

      } else {
        // For iOS, continue using copyFile from cache
        await RNFetchBlob.fs.copyFile(filePath, destinationPath);

        Toast.show({
          type: 'success',
          text1: 'Download Complete',
          text2: `File saved to ${destinationPath}`,
        });
      }
    } catch (e) { // Catch errors that occur before platform-specific logic
       console.error('Download error:', e);
       Toast.show({
         type: 'error',
         text1: 'Download Failed',
         text2: `An unexpected error occurred: ${e.message || 'Unknown error'}`,
       });
    }
  };

  return (
    <View style={{ flex: 1 }}>
      <TopBar
        title="Facture"
        onGoBack={() => navigation.goBack()}
        activeLeftIcon="home"
        onNotificationPress={() => navigation.navigate('AdminNotifications')}
        notificationCount={unreadNotificationsCount}
        onSettingsPress={() => navigation.navigate('Settings')}
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
            onLoadComplete={(numberOfPages, filePath) => {
              console.log(`PDF loaded successfully. Number of pages: ${numberOfPages}`);
              setLoading(false);
            }}
            onPageChanged={(page, numberOfPages) => {
              console.log(`Current page: ${page}`);
            }}
            onError={(error) => {
              console.error('Error rendering PDF:', error);
              // This error is likely from the PDF rendering itself, not the fetch
              setError(`Error rendering PDF: ${error.message || 'Unknown rendering error'}`);
              setLoading(false);
              Toast.show({
                type: 'error',
                text1: 'Erreur',
                text2: "Impossible d'afficher le PDF ❌",
              });
            }}
            onPressLink={(uri) => {
              console.log(`Link pressed: ${uri}`);
            }}
            style={{
              flex: 1,
              width: Dimensions.get('window').width,
              height: Dimensions.get('window').height,
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
          margin: 20,
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