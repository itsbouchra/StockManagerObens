import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import {
  ArrowLeft,
  Home,
  ClipboardList,
  User,
  Bell,
  Settings,
} from 'lucide-react-native';
import { useNavigation } from '@react-navigation/native';

const CustomerTopBar = ({
  title,
  active = 'home',
  onGoBack,
  onNotificationPress,
  onSettingsPress,
}) => {
  const navigation = useNavigation();

  const handleGoBack = () => {
    if (onGoBack) {
      onGoBack();
    } else if (navigation.canGoBack()) {
      navigation.goBack();
    } else {
      navigation.navigate('CustomerDashboard');
    }
  };

  const getIconColor = (iconName) =>
    active === iconName ? '#E1B12C' : '#ffffff';

  const renderActiveIcon = () => {
    switch (active) {
      case 'home':
        return <Home size={22} color={getIconColor('home')} />;
      case 'orders':
        return <ClipboardList size={22} color={getIconColor('orders')} />;
      case 'profile':
        return <User size={22} color={getIconColor('profile')} />;
      case 'notification':
        return <Bell size={22} color={getIconColor('notification')} />;
      case 'settings':
        return <Settings size={22} color={getIconColor('settings')} />; // ✅ nouveau cas ajouté
      default:
        return null;
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.leftSection}>
        {onGoBack && (
          <TouchableOpacity onPress={handleGoBack} style={styles.backButton}>
            <ArrowLeft size={24} color="#fff" />
          </TouchableOpacity>
        )}
        {renderActiveIcon()}
        <Text style={styles.title}>{title}</Text>
      </View>

      <View style={styles.rightSection}>
        <TouchableOpacity onPress={() => navigation.navigate('CustomerNotificationsScreen')}>
          <Bell size={22} color="#fff" />
        </TouchableOpacity>

        <TouchableOpacity
          onPress={
            onSettingsPress
              ? onSettingsPress
              : () => navigation.navigate('CustomerSettingsScreen')
          }
          style={{ marginLeft: 12 }}
        >
          <Settings size={22} color={getIconColor('settings')} /> {/* couleur dynamique */}
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#708238',
    paddingTop: 42,
    paddingBottom: 14,
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    elevation: 4,
    borderBottomLeftRadius: 16,
    borderBottomRightRadius: 16,
  },
  leftSection: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  rightSection: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  backButton: {
    marginRight: 12,
    padding: 4,
  },
  title: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
    marginLeft: 10,
  },
});

export default CustomerTopBar;