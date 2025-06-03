import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ImageBackground,
  Switch,
} from 'react-native';
import {
  ArrowLeft,
  Settings,
  Bell,
  Users,
  Blocks,
} from 'lucide-react-native';

export default function SettingsScreen({ navigation }) {
  const [isNotifEnabled, setIsNotifEnabled] = useState(true);

  return (
    <ImageBackground
      source={require('../assets/bg.jpg')}
      style={styles.background}
    >
      <View style={styles.container}>
        {/* En-tête */}
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <ArrowLeft size={24} color="#333" />
        </TouchableOpacity>

        <View style={styles.titleWrapper}>
          <Settings size={18} color="#1e1e1e" />
          <Text style={styles.title}>Paramètres</Text>
        </View>

        {/* Options des paramètres */}
        <TouchableOpacity style={styles.optionBox} onPress={() => navigation.navigate('UsersScreen')}>
          <View style={styles.iconText}>
            <Users size={22} color="#4e5e30" />
            <View style={{ marginLeft: 10 }}>
              <Text style={styles.optionTitle}>Comptes</Text>
              <Text style={styles.optionSubtitle}>Gérer les comptes et les rôles</Text>
            </View>
          </View>
        </TouchableOpacity>

        <TouchableOpacity style={styles.optionBox} onPress={() => navigation.navigate('SettingsCategorieScreen')}>
          <View style={styles.iconText}>
            <Blocks size={22} color="#4e5e30" />
            <View style={{ marginLeft: 10 }}>
              <Text style={styles.optionTitle}>Catégories</Text>
              <Text style={styles.optionSubtitle}>Gérer et ajouter des catégories</Text>
            </View>
          </View>
        </TouchableOpacity>

        <View style={styles.optionBox}>
          <View style={styles.iconText}>
            <Bell size={22} color="#4e5e30" />
            <Text style={[styles.optionTitle, { marginLeft: 10 }]}>Notifications</Text>
          </View>
          <Switch
            value={isNotifEnabled}
            onValueChange={setIsNotifEnabled}
            trackColor={{ true: '#4e5e30', false: '#ccc' }}
            thumbColor="#fff"
          />
        </View>
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
    resizeMode: 'cover',
    justifyContent: 'center',
  },
  container: {
    backgroundColor: '#fff',
    margin: 20,
    borderRadius: 20,
    padding: 20,
    elevation: 5,
  },
  backButton: {
    marginBottom: 10,
  },
  titleWrapper: {
    flexDirection: 'row',
    backgroundColor: '#d9e3d2',
    alignItems: 'center',
    alignSelf: 'center',
    borderRadius: 8,
    paddingHorizontal: 20,
    paddingVertical: 8,
    marginBottom: 20,
    borderWidth: 2,
    borderColor: '#4e5e30',
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1e1e1e',
    marginLeft: 8,
  },
  optionBox: {
    backgroundColor: '#d9e3d2',
    borderRadius: 12,
    padding: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  iconText: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  optionTitle: {
    fontWeight: 'bold',
    fontSize: 15,
    color: '#2c2c2c',
  },
  optionSubtitle: {
    fontSize: 12,
    color: '#555',
  },
});