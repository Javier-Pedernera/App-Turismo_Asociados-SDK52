import React, { useState } from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import {  useNavigation } from '@react-navigation/native';
import { createDrawerNavigator, useDrawerStatus } from '@react-navigation/drawer';
import { StyleSheet } from 'react-native';
import ScanMe from '../screens/ScanMe';
import ProfileScreen from '../screens/ProfileScreen';
import { FontAwesome } from '@expo/vector-icons';
import PromotionsScreen from './PromotionsScreen';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import SimpleLineIcons from '@expo/vector-icons/SimpleLineIcons';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import Ionicons from '@expo/vector-icons/Ionicons';
import Branches from './Branches';

const Tab = createBottomTabNavigator();
const Drawer = createDrawerNavigator();

const MainTabs = () => {
  const navigation = useNavigation();
  const drawerStatus = useDrawerStatus();
  const [focusedTab, setFocusedTab] = useState<string | null>(null);

  const getIconName = (routeName: string): any => {
    switch (routeName) {
      case 'QR-Scanner':
        return 'qr-code-scanner';
      case 'Ajustes':
        return 'settings';
      case 'Promociones':
        return 'ticket-percent-outline';
      case 'Sucursal':
        return 'storefront-outline';
      case 'Perfil':
        return 'address-card';
      default:
        return 'circle';
    }
  };

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ color, size }) => {
          const iconName = getIconName(route.name);
          const isFocused = focusedTab === route.name;
          if (route.name === 'QR-Scanner') {
            return (
              <MaterialIcons name={iconName} size={size} color={isFocused ? 'rgb(0, 122, 140)' : color} />
            );
          }
          if (route.name === 'Promociones') {
            return (
              <MaterialCommunityIcons name={iconName} size={size} color={isFocused ? 'rgb(0, 122, 140)' : color} />
            );
          }
          if (route.name === 'Ajustes') {
            return (
              <SimpleLineIcons name={iconName} size={size} color={isFocused ? 'rgb(0, 122, 140)' : color} />
            );
          }
          if (route.name === 'Sucursal') {
            return (
              <Ionicons name={iconName} size={size} color={isFocused ? 'rgb(0, 122, 140)' : color} />
            );
          }

          return <FontAwesome name={iconName} size={size} color={isFocused ? 'rgb(0, 122, 140)' : color} />;
        },
        tabBarActiveTintColor: 'rgb(0, 122, 140)',
        tabBarInactiveTintColor: '#aaa',
        tabBarStyle: {
          backgroundColor: '#fff',
          borderTopWidth: 0,
          elevation: 5,
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.8,
          shadowRadius: 2,
        },
        tabBarLabelStyle: {
          fontSize: 10,
          fontWeight: 'bold',
        },
        tabBarIconStyle: {
          marginTop: 1,
        },
        tabBarItemStyle: {
          padding: 5,
        },
      })}
    >
      <Tab.Screen
        name="QR-Scanner"
        component={ScanMe}
        options={{ headerShown: false }}
        listeners={{
          tabPress: () => setFocusedTab('Inicio'),
        }}
      />
      <Tab.Screen
        name="Promociones"
        component={PromotionsScreen}
        options={{ headerShown: false }}
        listeners={{
          tabPress: () => setFocusedTab('Descuentos'),
        }}
      />
      <Tab.Screen
        name="Sucursal"
        component={Branches}
        options={{ headerShown: false }}
        listeners={{
          tabPress: () => setFocusedTab('Sucursal'),
        }}
      />
      <Tab.Screen
        name="Perfil"
        component={ProfileScreen}
        options={{ headerShown: false }}
        listeners={{
          tabPress: () => setFocusedTab('Credencial'),
        }}
      />
      {/* <Tab.Screen
         name="Ajustes"
         component={MapScreen}
         options={{ headerShown: false }}
         listeners={{
           tabPress: () => setFocusedTab('Mapa'),
         }}
       />       */}
    </Tab.Navigator>

  );
};

const MainAppScreen: React.FC = () => {


  return (
    <Drawer.Navigator
      screenOptions={{
        drawerPosition: 'right',
        drawerStyle: {
          width: 250,
        },
      }}
    >
      <Drawer.Screen name="MainTabs" component={MainTabs} options={{ headerShown: false }} />
    </Drawer.Navigator>
  );
};

export default MainAppScreen;

const styles = StyleSheet.create({
  shadow: {
    shadowColor: '#7F5DF0',
    shadowOffset: {
      width: 0,
      height: 10,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.5,
    elevation: 5,
  },
});
