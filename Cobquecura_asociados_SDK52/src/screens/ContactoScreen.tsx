import { View, Text, Linking, StyleSheet, ScrollView, Image } from 'react-native';

const ContactComponent = () => {
  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Image 
        source={ require('../../assets/logo.png')} 
        style={styles.logo} 
      />
      <Image 
        source={ require('../../assets/logo2.png')} 
        style={styles.logo2} 
      />
      
      <Text style={styles.text}>
        Somos la Cámara de Comercio, Turismo y Desarrollo de Cobquecura, dedicados a promover y fomentar un turismo familiar, seguro, sostenible y responsable en nuestra hermosa comuna. 
        Nuestra misión es preservar y realzar el paisaje natural y cultural de la región, promoviendo la conservación del medio ambiente y respetando las tradiciones locales, sin perturbar el estilo de vida campesino que caracteriza Cobquecura.
      </Text>
      
      <Text style={styles.subHeader}>NUESTRA COMISIÓN DIRECTIVA</Text>
      <Text style={styles.text}>
        Presidente: Francisco Maldonado Gaete {'\n'}
        Vice Presidente: Cristobal Bustos Torres {'\n'}
        Tesorería: Julia Fernandez {'\n'}
        Secretaria: Melina Polo {'\n'}
        Director: Leonardo Blait {'\n'}
        Dir. Consejero: Oscar Solar Arriagada
      </Text>
      
      <Text style={styles.subHeader}>MEDIOS DE CONTACTO</Text>
      <Text style={styles.text}>Cesfam: (+56 42) 2585412</Text>
      <Text style={styles.text}>Emergencias: (+569) 447-7199, (+56 42) 234-7609</Text>
      <Text style={styles.text}>Reciclaje: (+569) 737-85708</Text>
      
      <Text style={styles.link} onPress={() => Linking.openURL('https://www.camaradeturismocobquecura.cl/')}>
        Visítanos en nuestra página web
      </Text>
      
      <Text style={styles.footer}>2024 - Todos los derechos reservados</Text>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: '#f0f0f0',
  },
  logo: {
    width: 100,
    height: 100,
    alignSelf: 'center',
    marginBottom: 20,
  },
  logo2: {
    width: 98,
    height: 30,
    alignSelf: 'center',
    marginBottom: 20,
  },
  header: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#333',
    textAlign: 'center',
  },
  subHeader: {
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: 15,
    marginBottom: 5,
    color: '#555',
  },
  text: {
    fontSize: 18,
    marginBottom: 10,
    color: '#666',
    lineHeight: 26,
  },
  link: {
    fontSize: 18,
    color: '#1e90ff',
    textDecorationLine: 'underline',
    marginTop: 20,
    textAlign: 'center',
  },
  footer: {
    fontSize: 16,
    marginTop: 20,
    textAlign: 'center',
    color: '#999',
  },
});

export default ContactComponent;