import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  ScrollView,
  PermissionsAndroid,
  Platform,
} from 'react-native';
import {
  User,
  Settings,
  Lock,
  LogOut,
  Edit3,
  ArrowLeft,
  Camera,
} from 'lucide-react-native';

import { launchImageLibrary } from 'react-native-image-picker';
import bgImage from '../assets/bg.jpg';
import profilePic from '../assets/profile-placeholder.jpg';
import BottomNavBar from '../components/BottomNavBar';
import { useNavigation } from '@react-navigation/native';

export default function ProfileScreen() {
  const navigation = useNavigation();
  const [imageUri, setImageUri] = useState(null);

  // ✅ Demande de permission (Android)
  const requestGalleryPermission = async () => {
    if (Platform.OS === 'android') {
      try {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.READ_MEDIA_IMAGES || PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
          {
            title: 'Accès à la galerie',
            message: 'L\'application a besoin d\'accéder à votre galerie.',
            buttonPositive: 'OK',
            buttonNegative: 'Annuler',
          }
        );
        return granted === PermissionsAndroid.RESULTS.GRANTED;
      } catch (err) {
        console.warn(err);
        return false;
      }
    }
    return true;
  };

  // ✅ Ouvre la galerie
  const handleSelectImage = async () => {
    const hasPermission = await requestGalleryPermission();
    if (!hasPermission) return;

    launchImageLibrary(
      {
        mediaType: 'photo',
        selectionLimit: 1,
      },
      (response) => {
        if (response.didCancel) {
          console.log('Annulé par l’utilisateur');
        } else if (response.errorCode) {
          console.log('Erreur: ', response.errorMessage);
        } else if (response.assets && response.assets.length > 0) {
          setImageUri(response.assets[0].uri);
        }
      }
    );
  };

  return (
    <View style={styles.container}>
      <Image source={bgImage} style={styles.headerBackground} resizeMode="cover" />

      <View style={styles.headerRow}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <ArrowLeft size={24} color="#fff" />
        </TouchableOpacity>
        <View style={styles.titleBadge}>
          <User size={20} color="#4e5e30" />
          <Text style={styles.pageTitle}>My Profile</Text>
        </View>
      </View>

      <View style={styles.whitePanel}>
        <View style={styles.profileSection}>
          <View style={styles.imageWrapper}>
            <Image
              source={imageUri ? { uri: imageUri } : profilePic}
              style={styles.profileImage}
            />
            <TouchableOpacity style={styles.cameraIcon} onPress={handleSelectImage}>
              <Camera size={14} color="#fff" />
            </TouchableOpacity>
          </View>
          <Text style={styles.username}>Achraf ELMOUDEN</Text>
          <Text style={styles.role}>Admin</Text>
        </View>

        <ScrollView contentContainerStyle={styles.options}>
          <OptionButton label="Account Information" icon={<User size={18} color="#4e5e30" />} editable />
          <OptionButton label="Settings" icon={<Settings size={18} color="#4e5e30" />} />
          <OptionButton label="Password" icon={<Lock size={18} color="#4e5e30" />} editable />
          <OptionButton label="Log Out" icon={<LogOut size={18} color="#4e5e30" />} onPress={() => navigation.navigate('Login')} />
        </ScrollView>
      </View>

      <BottomNavBar navigation={navigation} currentRoute="Profile" />
    </View>
  );
}

function OptionButton({ label, icon, editable, onPress }) {
  return (
    <TouchableOpacity style={styles.optionRow} onPress={onPress}>
      <View style={styles.optionLeft}>
        {icon}
        <Text style={styles.optionLabel}>{label}</Text>
      </View>
      {editable && <Edit3 size={16} color="#4e5e30" />}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  headerBackground: {
    position: 'absolute',
    width: '100%',
    height: 140,
    top: 0,
    left: 0,
    zIndex: 0,
  },
  headerRow: {
    position: 'absolute',
    top: 35,
    left: 0,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    zIndex: 2,
  },
  titleBadge: {
    marginLeft: 10,
    flexDirection: 'row',
    backgroundColor: '#d9e3d2',
    paddingVertical: 6,
    paddingHorizontal: 20,
    borderRadius: 20,
    alignItems: 'center',
  },
  pageTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#4e5e30',
    marginLeft: 10,
  },
  whitePanel: {
    flex: 1,
    backgroundColor: '#fff',
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    marginTop: 98,
    paddingTop: 20,
    zIndex: 1,
  },
  profileSection: { alignItems: 'center' },
  imageWrapper: { position: 'relative', marginBottom: 12 },
  profileImage: {
    width: 90,
    height: 90,
    borderRadius: 45,
  },
  cameraIcon: {
    position: 'absolute',
    bottom: 0,
    right: -6,
    backgroundColor: '#6b8425',
    borderRadius: 10,
    padding: 4,
  },
  username: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1e1e1e',
  },
  role: {
    fontSize: 14,
    color: '#6b7280',
    marginTop: 2,
  },
  options: {
    marginTop: 30,
    paddingHorizontal: 30,
    paddingBottom: 90,
  },
  optionRow: {
    backgroundColor: '#d9e3d2',
    borderRadius: 10,
    paddingVertical: 12,
    paddingHorizontal: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 14,
  },
  optionLeft: { flexDirection: 'row', alignItems: 'center' },
  optionLabel: { fontSize: 15, color: '#333', marginLeft: 12 },
});
