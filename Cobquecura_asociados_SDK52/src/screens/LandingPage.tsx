import { View, Text, ImageBackground, StyleSheet, TouchableOpacity, Image, Dimensions } from 'react-native';
import { NavigationProp, useNavigation } from '@react-navigation/native';
import { RootStackParamList } from '../navigation/AppNavigator';
import Ionicons from '@expo/vector-icons/Ionicons';
import { Platform } from 'react-native';

const { width: screenWidth } = Dimensions.get('window');

const LandingPage: React.FC = () => {
    const navigation = useNavigation<NavigationProp<RootStackParamList>>();

 

  return (
    <ImageBackground
      source={require('../../assets/images/fondo.jpeg')}
      style={styles.background}
    >
      <View style={styles.logoContainer}>
        <Image source={require('../../assets/logo.png')} style={styles.logoImage} />
      </View>

      <View style={styles.card}>
        <Text style={styles.cardText}>Listo para disfrutar de</Text>
        <Text style={styles.cardTextGreen}>Cobquecura </Text>
        <View  style={styles.cardTextContainer}>
          <Text style={styles.cardText3}>y las mejores</Text>
        <Text style={styles.cardTextGreen4}>promociones?</Text>
        </View>
                  
        <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('Login')}>
         <Text style={styles.buttonText}>Disfruta los descuentos aquí  </Text>
         <Ionicons name="storefront-outline" size={24} color="#f6f6f6" />
        </TouchableOpacity>
      </View>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  background: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoContainer: {
    position: 'absolute',
    top: Platform.OS === 'ios' ? 200:100,
    alignItems: 'center',
    width: 100,
    height: 100,
  },
  logo: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
  },
  logoImage:{
    width: '100%',
    height: '100%',
  },
  card: {
    backgroundColor: '#f6f6f6',
    padding: 20,
    borderRadius: 10,
    alignItems: 'center',
    width: screenWidth,
    position: 'absolute',
    height:Platform.OS === 'ios' ? '30%':'35%',
    bottom: 0,

    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: -5,
    },
    shadowOpacity: 0.8,
    shadowRadius: 5,
    elevation: 5
  },
  cardTextContainer:{
    width:screenWidth,
    display:'flex',
    flexDirection:'row',
    justifyContent:'center',
    alignSelf:'center'
  },
  cardText: {
    fontFamily: 'Inter-Regular-400',
    fontSize: Platform.OS === 'ios' ? 18 : 16,
    fontWeight: '800',
    lineHeight: 30,
    textAlign: 'center',
    color: 'rgb(51, 103, 73)',
    width: screenWidth,
  },
  cardTextGreen: {
    fontFamily: 'Inter-Regular-400',
    fontSize: Platform.OS === 'ios' ? 25 : 23,
    fontWeight: '800',
    lineHeight: 30,
    textAlign: 'center',
    color: '#007A8C',
    width: screenWidth,
  },
  cardText3: {
    fontFamily: 'Inter-Regular-400',
    fontSize: Platform.OS === 'ios' ? 20 : 18,
    fontWeight: '800',
    lineHeight: 30,
    textAlign: 'center',
    color: 'rgb(51, 103, 73)',
    width: screenWidth * 0.38,
  },
  cardTextGreen4: {
    fontFamily: 'Inter-Regular-400',
    fontSize: Platform.OS === 'ios' ? 21 : 20,
    fontWeight: Platform.OS === 'ios' ? '600':'800',
    lineHeight: 30,
    textAlign: 'center',
    color: '#007A8C',
    width: screenWidth * 0.38,
  },
  button: {
    minHeight: 48,
    marginTop:20,
    backgroundColor: '#007a8c',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 25,
    display:'flex',
    flexDirection:'row',
    justifyContent:'space-evenly',
    alignContent:'center',
    alignItems:'center',
    width:'90%',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 3,
  },
  buttonText: {
    color: '#fff',
    fontSize: 14,
    fontFamily: 'Inter-Regular-400',
  },
});

export default LandingPage;
