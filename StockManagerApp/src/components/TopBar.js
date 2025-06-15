import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import {
  ArrowLeft,
  Home,
  Boxes,
  Bell,
  Package,
  Settings,
  ShoppingCart,
} from 'lucide-react-native';

const TopBar = ({ title, activeLeftIcon = 'home', onGoBack, onNotificationPress, activeRightIcon, notificationCount, onSettingsPress }) => {
  const iconColor = (iconName) => (
    (activeLeftIcon === iconName) || (activeRightIcon === iconName) ? '#E1B12C' : 'white'
  );

  const renderLeftIcon = () => {
    switch (activeLeftIcon) {
      case 'home':
        return <Home size={26} color={iconColor('home')} />;
      case 'stock':
        return <Boxes size={26} color={iconColor('stock')} />;
      case 'ProductAD':
        return <Package size={26} color={iconColor('ProductAD')} />;
      case 'BuysScreen':
        return <ShoppingCart size={26} color={iconColor('BuysScreen')} />;
      case 'notifications':
        return (
          <View>
            <Bell size={26} color={iconColor('notifications')} />
            {notificationCount > 0 && (
              <View style={styles.notificationBadge}>
                <Text style={styles.notificationBadgeText}>{String(notificationCount)}</Text>
              </View>
            )}
          </View>
        );
      default:
        return null;
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.leftSection}>
        {onGoBack && (
          <TouchableOpacity onPress={onGoBack} style={styles.backButton}>
            <ArrowLeft size={24} color="white" />
          </TouchableOpacity>
        )}
        {renderLeftIcon()}
        <Text style={styles.title}>{title}</Text>
      </View>

      <View style={styles.rightSection}>
        <TouchableOpacity style={styles.iconButton} onPress={onNotificationPress}> 
          <Bell size={22} color={iconColor('notifications')} />
          {notificationCount > 0 && (
            <View style={styles.notificationBadge}>
              <Text style={styles.notificationBadgeText}>{String(notificationCount)}</Text>
            </View>
          )}
        </TouchableOpacity>
        <TouchableOpacity onPress={onSettingsPress}>
          <Settings size={22} color={iconColor('settings')} />
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
    color: 'white',
    fontSize: 22,
    fontWeight: '700',
    marginLeft: 10,
  },
  iconButton: {
    marginRight: 16,
  },
  notificationBadge: {
    position: 'absolute',
    top: -5,
    right: -5,
    backgroundColor: 'red',
    borderRadius: 9,
    width: 18,
    height: 18,
    justifyContent: 'center',
    alignItems: 'center',
  },
  notificationBadgeText: {
    color: 'white',
    fontSize: 10,
    fontWeight: 'bold',
  },
});

export default TopBar;
