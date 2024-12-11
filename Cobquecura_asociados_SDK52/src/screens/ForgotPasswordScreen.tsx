import { useState } from 'react';
import { View, TextInput, TouchableOpacity, Text, StyleSheet, Alert, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { RootStackParamList } from '../navigation/AppNavigator';
import { StackNavigationProp } from '@react-navigation/stack';
import Modal from 'react-native-modal';
import { sendPasswordResetEmail } from '../services/authService';
import ErrorModal from '../components/ErrorModal';
import ExitoModal from '../components/ExitoModal';

type ForgotPasswordScreenProp = StackNavigationProp<RootStackParamList, 'ForgotPassword'>;

const ForgotPasswordScreen: React.FC = () => {
  const navigation = useNavigation<ForgotPasswordScreenProp>();
  const [email, setEmail] = useState('');
  const [modalErrorVisible, setModalErrorVisible] = useState(false);
  const [modalErrorMessage, setModaErrorlMessage] = useState('');
  const [modalSuccessVisible, setModalSuccessVisible] = useState(false);
  const [modalSuccessMessage, setModalSuccessMessage] = useState('');

  const isValidEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };
  const handleSendResetEmail = async () => {

    if (!isValidEmail(email)) {
      setModaErrorlMessage('Por favor, ingresa un correo válido.');
      setModalErrorVisible(true);
      return;
    }
    if (email.length < 6 || email.length > 320) {
      setModaErrorlMessage('El correo debe tener entre 6 y 320 caracteres.');
      setModalErrorVisible(true);
      return;
    }
    try {
      await sendPasswordResetEmail(email);
      setModalSuccessMessage('Se ha enviado un correo de recuperación. Revisa tu bandeja de entrada.');
      setModalSuccessVisible(true)
      setTimeout(() => {
        setModalSuccessVisible(false);
        navigation.navigate('Login');
      }, 3000);
    } catch (error) {
      setModaErrorlMessage('Error al enviar el correo de recuperación.');
      setModalErrorVisible(true);
    }
  };

  return (
    <View style={styles.container}>
      <Image source={require('../../assets/logo.png')} style={styles.logoHome} />
      <Text style={styles.title}>Recupera tu contraseña</Text>
      <TextInput
        style={styles.input}
        placeholder="Correo Electrónico"
        placeholderTextColor="#aaa"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
      />
      <TouchableOpacity style={styles.button} onPress={handleSendResetEmail}>
        <Text style={styles.buttonText}>Enviar</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
        <Text style={styles.backButtonText}>Cancelar</Text>
      </TouchableOpacity>
      {/* <Modal isVisible={isModalVisible}>
        <View style={styles.modalContent}>
          <Text style={styles.modalMessage}>{modalMessage}</Text>
          <TouchableOpacity style={styles.modalButton} onPress={toggleModal}>
            <Text style={styles.modalButtonText}>Cerrar</Text>
          </TouchableOpacity>
        </View>
      </Modal> */}
      <ErrorModal
        visible={modalErrorVisible}
        message={modalErrorMessage}
        onClose={() => setModalErrorVisible(false)}
      />
      <ExitoModal
        visible={modalSuccessVisible}
        message={modalSuccessMessage}
        onClose={() => {setModalSuccessVisible(false)}}
        />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#f7f7f7',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 25,
    marginTop: 50,
    color: 'rgb(0, 122, 140)',
  },
  logoHome: {
    width: 70,
    height: 70,
    marginTop: 20
  },
  input: {
    height: 48,
    width: '80%',
    borderColor: '#ddd',
    borderWidth: 1,
    borderRadius: 8,
    marginBottom: 15,
    paddingHorizontal: 15,
    backgroundColor: '#fff',
    fontSize: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 1,
    elevation: 2,
  },
  button: {
    backgroundColor: 'rgb(0, 122, 140)',
    paddingVertical: 10,
    paddingHorizontal: 30,
    borderRadius: 25,
    marginTop: 10,
    width: '50%',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.5,
    shadowRadius: 1,
    elevation: 1,
    minHeight: 48,
    justifyContent:'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  modalContent: {
    backgroundColor: '#fff',
    color: 'white',
    padding: 20,
    borderRadius: 10,
    alignItems: 'center',
    width: "70%",
    alignSelf: 'center'
  },
  modalMessage: {
    fontSize: 18,
    marginBottom: 20,
    color: 'rgb(0, 122, 140)',
    textAlign:'center',
  },
  modalButton: {
    backgroundColor: 'rgb(0, 122, 140)',
    paddingVertical: 10,
    paddingHorizontal: 30,
    borderRadius: 25,
    alignItems:'center',
    justifyContent:'center',
    minHeight: 48,
  },
  modalButtonText: {
    color: '#fff',
    fontSize: 16,
  },
  backButton: {
    backgroundColor: '#ddd',
    paddingVertical: 10,
    paddingHorizontal: 30,
    borderRadius: 25,
    marginTop: 10,
    width: '50%',
    alignItems:'center',
    justifyContent:'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.5,
    shadowRadius: 1,
    elevation: 1,
    minHeight: 48,
  },
  backButtonText: {
    color: '#007A8C',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default ForgotPasswordScreen;
