import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { DrawerContentScrollView, DrawerItemList, DrawerItem } from '@react-navigation/drawer';
import { useDispatch } from 'react-redux';
import { logoutUser } from '../services/authService';

export const DrawerContent = (props: any) => {
  const dispatch = useDispatch();

  const handleSignOut = () => {
    logoutUser() 
    props.navigation.navigate('Home');
  };

  return (
    <DrawerContentScrollView {...props}>
      <View style={styles.container}>
        <DrawerItemList {...props} />
        <DrawerItem
          label="Cerrar Sesión"
          onPress={handleSignOut}
          style={styles.signOutButton}
        />
      </View>
    </DrawerContentScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  signOutButton: {
    marginTop: 'auto', // Coloca el botón de cerrar sesión al final
  },
});
