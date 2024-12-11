import React from 'react';
import { Dimensions, StyleSheet } from 'react-native';
import { View, Text, TextInput, TouchableOpacity, ActivityIndicator } from 'react-native';

interface DeleteModalProps {
    isVisible: boolean;
    branchNameInput: string; 
    confirmBranchName: string; 
    onInputChange: (text: string) => void;
    onConfirmChange: (text: string) => void; 
    onSubmit: () => void; 
    onCancel: () => void;
    isDeleting: boolean; 
  }
  const { width: screenWidth, height: screenHeight } = Dimensions.get('window');
const  DeleteModal: React.FC<DeleteModalProps> = ({
  isVisible,
  branchNameInput,
  confirmBranchName,
  onInputChange,
  onConfirmChange,
  onSubmit,
  onCancel,
  isDeleting,
}) => {
  if (!isVisible) return null;

  return (
    <View style={styles.modalContainer}>
    <View style={styles.modalBackdrop} />
    <View style={styles.deleteModal}>
      <Text style={styles.label}>Ingresa el nombre de la sucursal para poder eliminarla:</Text>
      <TextInput
        style={styles.input}
        placeholder="* Nombre de la sucursal"
        value={branchNameInput}
        onChangeText={onInputChange}
      />
      <TextInput
        style={styles.input}
        placeholder=" * Confirmar nombre de la sucursal"
        value={confirmBranchName}
        onChangeText={onConfirmChange}
      />
      <TouchableOpacity style={styles.submitButton} onPress={onSubmit} disabled={isDeleting}>
        {isDeleting ? (
          <ActivityIndicator size="small" color="#fff" />
        ) : (
          <Text style={styles.submitButtonText}>Confirmar Eliminación</Text>
        )}
      </TouchableOpacity>
      <TouchableOpacity style={styles.cancelButton} onPress={onCancel}>
        <Text style={styles.cancelButtonText}>Cancelar</Text>
      </TouchableOpacity>
    </View>
  </View>
  );
};
const styles = StyleSheet.create({
    modalContainer: {
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      justifyContent: 'center',
      alignItems: 'center',
      zIndex: 10, 
    },
    modalBackdrop: {
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0, 0, 0, 0.5)', 
      zIndex: 9,
    },
    deleteModal: {
      width: screenWidth * 0.8,
      padding: 20,
      backgroundColor: '#fff',
      borderRadius: 10,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.25,
      shadowRadius: 3.84,
      elevation: 5,
      zIndex: 10,
    },
    label: {
      fontSize: 16,
      color: '#007a8c',
      fontWeight: 'bold',
      marginBottom: 10,
      textAlign: 'center',
    },
    input: {
      borderWidth: 1,
      borderColor: '#ccc',
      borderRadius: 5,
      padding: 10,
      marginBottom: 15,
      fontSize: 14,
      color: '#333',
    },
    submitButton: {
      backgroundColor: '#d30000',
      padding: 10,
      borderRadius: 25,
      alignItems: 'center',
      marginBottom: 10,
    },
    submitButtonText: {
      color: '#fff',
      fontSize: 16,
      fontWeight: 'bold',
    },
    cancelButton: {
      backgroundColor: '#007a8c',
      padding: 10,
      borderRadius: 25,
      alignItems: 'center',
    },
    cancelButtonText: {
      color: '#fff',
      fontSize: 16,
      fontWeight: 'bold',
    },
  });
export default DeleteModal;