import { View, Text, StyleSheet, Image, Dimensions } from 'react-native';
import QRCode from 'react-native-qrcode-svg';
import { useSelector } from 'react-redux';
import { UserData } from '../redux/types/types';
import * as Animatable from 'react-native-animatable';
import { getMemoizedUserData } from '../redux/selectors/userSelectors';

const { width } = Dimensions.get('window');
const API_URL = process.env.EXPO_PUBLIC_API_URL;
const UserCredential: React.FC = () => {
  const user = useSelector(getMemoizedUserData) as UserData;

  if (!user) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyText}>No user data available</Text>
      </View>
    );
  }

  const userId = user?.user_id?.toString() || '';

  return (
    <View style={styles.background}>
      <View style={styles.credentialContainer}>
        <View style={styles.imageContainer}>
          <Image
            source={{ uri: `${API_URL}${user?.image_url}` || 'https://via.placeholder.com/150' }}
            style={styles.image}
          />
        </View>
        <View style={styles.infoContainer}>
          <Text style={styles.name}>
            {user.first_name} {user.last_name}
          </Text>
          <Text style={styles.email}>{user.email}</Text>
        </View>
        <Animatable.View animation="bounceIn" duration={1500} style={styles.qrCard}>
          {userId ? (
            <QRCode value={userId} size={width * 0.4} />
          ) : (
            <Text style={styles.emptyText}>No QR Code available</Text>
          )}
        </Animatable.View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  background: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#ffffff'
  },
  credentialContainer: {
    width: width * 0.85,
    backgroundColor: '#f7f7f7',
    borderRadius: 15,
    padding: 20,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.5,
    shadowRadius: 5,
    elevation: 5,
  },
  imageContainer: {
    borderColor: 'rgb(0, 122, 140)',
    borderWidth: 1,
    borderRadius: 60,
    padding: 5,
    marginBottom: 20,
  },
  image: {
    width: 120,
    height: 120,
    borderRadius: 60,
  },
  infoContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  name: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#1c242b',
    textAlign: 'center',
  },
  email: {
    fontSize: 16,
    color: '#555',
    textAlign: 'center',
    marginTop: 5,
  },
  qrCard: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.5,
    shadowRadius: 5,
    elevation: 5,
    alignItems: 'center',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  emptyText: {
    fontSize: 18,
    color: '#888',
  },
});

export default UserCredential;
