import React, { useState } from 'react';
import { View, TouchableOpacity, Image, StyleSheet, Text, Alert } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import * as ImageManipulator from 'expo-image-manipulator';
import * as FileSystem from 'expo-file-system';

interface ImageCompressorProps {
  onImageCompressed: (uri: string) => void;
  initialImageUri?: string;
  isButtonDisabled?:boolean;
}
const API_URL = process.env.EXPO_PUBLIC_API_URL;

const ImageCompressor: React.FC<ImageCompressorProps> = ({ onImageCompressed, initialImageUri, isButtonDisabled }) => {
  const [imageUri, setImageUri] = useState<string | null>(`${initialImageUri}?timestamp=${new Date().getTime()}` || null);
  // console.log("imagen inicial",initialImageUri);
  const pickAndCompressImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    if (!result.canceled) {
      const compressedImage = await ImageManipulator.manipulateAsync(
        result.assets[0].uri,
        [{ resize: { width: 300, height: 300 } }],
        { compress: 0.7, format: ImageManipulator.SaveFormat.JPEG }
      );

      // Obtener el tamaño del archivo comprimido
      const fileInfo = await FileSystem.getInfoAsync(compressedImage.uri);

      if (fileInfo.exists && !fileInfo.isDirectory) {
        const fileSize = fileInfo.size || 0;

        const base64 = await FileSystem.readAsStringAsync(compressedImage.uri, {
          encoding: FileSystem.EncodingType.Base64,
        });
        // Actualizar la vista y pasar la imagen comprimida en base64
        setImageUri(`${compressedImage.uri}?timestamp=${new Date().getTime()}`);
        onImageCompressed(base64);
        //   Alert.alert('Imagen comprimida', `Tamaño: ${fileSize} bytes`);
      } else {
        Alert.alert('Error', 'No se pudo obtener el tamaño del archivo.');
      }
    }
  };
// console.log("imagen de usuario", imageUri);

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={pickAndCompressImage} style={styles.imagePickerButton} disabled={!isButtonDisabled}>
        {/* <Text style={styles.imagePickerButtonText}>Seleccionar Imagen</Text> */}
        { imageUri && initialImageUri !=="https://cobquecurapp-backend.duckdns.orgnull" && initialImageUri !=="https://cobquecurapp-backend.duckdns.org"? 
        <Image source={{ uri: imageUri }} style={styles.imagePreview} />:
        <Image source={require('../../assets/noImageAvailable.png')} style={styles.imagePreview} />}
      </TouchableOpacity>


    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    marginBottom: 0,
  },
  imagePickerButton: {
    // backgroundColor: 'rgb(0, 122, 140)',

    padding: 0,
    borderRadius: 50,
    alignItems: 'center',
    marginBottom: 10,
  },
  imagePickerButtonText: {
    color: '#fff',
    fontSize: 16,
  },
  imagePreview: {
    alignSelf: 'center',
    borderColor: 'rgba(206, 206, 206,0.5)',
    borderWidth: 0.5,
    width: 100,
    height: 100,
    borderRadius: 50,
  },
});

export default ImageCompressor;
