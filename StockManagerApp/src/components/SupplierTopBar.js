import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Home, Settings, ArrowLeft, DollarSign, User, Bell } from 'lucide-react-native';
import { useNavigation } from '@react-navigation/native';

const ACTIVE_COLOR = '#E1B12C';

const SupplierTopBar = ({ title, onSettingsPress, onGoBack, iconName, active }) => {
  const navigation = useNavigation();
  const iconColor = active ? ACTIVE_COLOR : 'white';

  const handleBack = () => {
    if (onGoBack) {
      onGoBack();
    } else {
      navigation.goBack();
    }
  };

  const renderIcon = () => {
    switch (iconName) {
      case 'sell':
        return <DollarSign size={26} color={iconColor} style={styles.iconBeforeTitle} />;
      case 'home':
        return <Home size={26} color={iconColor} style={styles.iconBeforeTitle} />;
      case 'profile':
        return <User size={26} color={iconColor} style={styles.iconBeforeTitle} />;
      default:
        return <Home size={26} color="white" style={styles.iconBeforeTitle} />;
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.leftSection}>
        <TouchableOpacity onPress={handleBack} style={styles.backButton}>
          <ArrowLeft size={24} color="white" />
        </TouchableOpacity>
        {renderIcon()}
        <Text style={[styles.title, { color: ACTIVE_COLOR }]}>{title}</Text>
      </View>

      <View style={styles.rightSection}>
        <TouchableOpacity 
          onPress={() => navigation.navigate('SupplierNotifications')}
          style={styles.iconButton}
        >
          <Bell size={22} color="white" />
        </TouchableOpacity>
        <TouchableOpacity 
          onPress={onSettingsPress}
          style={styles.iconButton}
        >
          <Settings size={22} color="white" />
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
    marginRight: 6,
    padding: 4,
  },
  iconButton: {
    marginLeft: 16,
    padding: 4,
  },
  iconBeforeTitle: {
    marginRight: 4,
  },
  title: {
    fontSize: 22,
    fontWeight: '700',
    marginLeft: 10,
  },
});

export default SupplierTopBar; 