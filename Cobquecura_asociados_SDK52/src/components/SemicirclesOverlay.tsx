import React from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';

const { width: screenWidth } = Dimensions.get('window');
const SemicirclesOverlay = () => {
  return (
    <View style={styles.container}>
      <View style={[styles.semicircle, styles.semicircle1]} />
      <View style={[styles.semicircle, styles.semicircle2]} />
      <View style={[styles.semicircle, styles.semicircle3]} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',

    zIndex: -1,
    left: 0,
    right: 0,
    height: 200,
    top:-100,
    justifyContent: 'center',
    alignItems: 'center',
    width:screenWidth
  },
  semicircle: {
    width: screenWidth, // Ajusta el ancho de los semicírculos
    height: 200, // La mitad del ancho para crear un semicírculo
    borderRadius: 100, // La mitad del ancho y altura para un semicírculo perfecto
    position: 'absolute',
  },
  semicircle1: {
    width: '100%',
    backgroundColor: '#007A8C',
    top: 0,
  },
  semicircle2: {
    width: '110%',
    backgroundColor: 'rgba(0, 120, 138, 0.6)',
    top: 40,
  },
  semicircle3: {
    width: '115%',
    backgroundColor: 'rgba(0, 122, 140, 0.2)',
    top: 80,
  },
});

export default SemicirclesOverlay;
