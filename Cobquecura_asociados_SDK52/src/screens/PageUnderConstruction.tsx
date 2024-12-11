import React from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';

const PageUnderConstruction = () => {
  return (
    <View style={styles.container}>
      <Image source={require('../../assets/construction.png')} style={styles.icon} />
      <Text style={styles.text}>Página en Construcción</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f7f7f7',
  },
  icon: {
    width: 100,
    height: 100,
  },
  text: {
    marginTop: 20,
    fontSize: 18,
    fontWeight: 'bold',
    color: '#555',
  },
});

export default PageUnderConstruction;
