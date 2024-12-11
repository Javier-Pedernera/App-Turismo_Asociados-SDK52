import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image, Platform, Alert } from 'react-native';
import { WebView } from 'react-native-webview';
import { Ionicons } from '@expo/vector-icons';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';

interface CustomCalloutProps {
  branch: any;
  handleRoutePress: () => void;
  prevSee: boolean;
}
const API_URL = process.env.EXPO_PUBLIC_API_URL;

const CustomCallout: React.FC<CustomCalloutProps> = ({ branch, handleRoutePress, prevSee }) => {
  // console.log("punto turistico", branch);
  const imageUrl = branch.branch_id
    ? `${API_URL}${branch.image_url}`
    : branch.images && branch.images.length > 0
      ? branch.images[0].image_path
      : null;

  const displayName = branch.branch_id
    ? branch.name
    : branch.title;
  const renderStars = (rating: number) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <Ionicons
          key={i}
          name={i <= rating ? 'star' : i - rating <= 0.5 ? 'star-half' : 'star-outline'}
          size={16}
          color="#FFD700"
        />
      );
    }
    return stars;
  };
  const handleDirectionsPress = () => {
    Alert.alert('Vista previa', 'Esto es solo una vista previa de la promoción');
  };
  return (
    <View style={prevSee? styles.calloutContainerSee: styles.calloutContainer}>
      <View style={styles.calloutBack}>
        {Platform.OS === 'android' ? (
          <View style={styles.calloutImageAndroidCont}>
            {imageUrl == "https://cobquecurapp-backend.duckdns.orgnull"? 
            <Image style={styles.calloutImageAndroid} source={require('../../assets/noimage.png')} />:<Image style={styles.calloutImageAndroid} source={{ uri: imageUrl }} />
          }
            
          </View>
        ) : (
          <View style={styles.calloutImageContainer}>
            {imageUrl == "https://cobquecurapp-backend.duckdns.orgnull"? 
            <Image style={styles.calloutImageAndroid} source={require('../../assets/noimage.png')} />:<Image source={{ uri: branch.image_url }} style={styles.calloutImage} />}
          </View>
        )}
        <View style={styles.callout}>
          <Text style={styles.calloutTitle}>{displayName}</Text>
          <View style={styles.divider}></View>
          <View style={styles.ratingContainer}>
            {/* <Text style={styles.calloutDescription}>{branch.description}</Text> */}
            <View style={styles.starsContainer}>
              {renderStars(3.5)}
            </View>
          </View>
          <View style={styles.addressBttn}>
            <Text style={styles.calloutadress}>{branch.address}</Text>
            <TouchableOpacity style={styles.calloutButton} onPress={handleDirectionsPress}>
              <MaterialCommunityIcons name="directions" size={24} color="rgb(49, 121, 187)" />
              <Text style={styles.calloutButtonText}>Cómo llegar?</Text>
            </TouchableOpacity>
          </View>
        </View>

      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  calloutContainer: {
    marginBottom: 50,
    marginTop: 50,
    left: '30%',
    zIndex: 999,
    width: 250,
  },
  calloutContainerSee:{
    marginBottom: 50,
    marginTop: -450,
    left: '30%',
    zIndex: 999,
    width: 250,
  },
  calloutBack: {
    height: 280,
    display: 'flex',
    justifyContent: 'center',
    alignContent: 'center',
    alignItems: 'center',
    padding: 10,
    borderRadius: 10,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    elevation: 15, 
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 0 }, 
    shadowOpacity: 1,
    shadowRadius: 1,
  },
  callout: {
    width: '90%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    alignContent: 'center',
  },
  calloutTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    // marginBottom: 5,
  },
  divider: {
    height: 1,
    width: '90%',
    backgroundColor: 'rgba(206, 206, 206, 0.5)',
    marginVertical: 5,
  },

  ratingContainer: {
    width: '100%',
    display: 'flex',
    flexDirection: 'row',
    // justifyContent:'space-evenly',
  },
  calloutDescription: {
    width: '60%',
    textAlign: 'left',
    fontSize: 14,
    color: 'gray',
    marginBottom: 0,
  },
  starsContainer: {
    width: '30%',
    display: 'flex',
    flexDirection: 'row',
  },
  calloutButton: {
    width: '35%',
    paddingVertical: 5,
    paddingHorizontal: 5,
    borderRadius: 5,
    alignItems: 'center',

  },
  calloutButtonText: {
    fontSize: 12,
    color: 'rgb(0, 122, 140)',
    marginBottom: 0,
  },
  calloutImageContainer: {
    width: 150,
    height: 100,
    borderRadius: 10,
    overflow: 'hidden',
    marginBottom: 5,
    backgroundColor: 'trasparent',
  },
  calloutImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  calloutImageAndroidCont: {
    marginBottom: 15,
    width: 200,
    height: 100,
    backgroundColor: 'white',
  },
  calloutImageAndroid: {
    backgroundColor: 'transparent',
    width: '100%',
    height: '100%',
  },
  addressBttn: {
    width: '100%',
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center'
  },
  calloutadress: {
    width: '68%',
    fontSize: 14,
    color: 'gray',
    marginBottom: 0,
  }
});

export default CustomCallout;
