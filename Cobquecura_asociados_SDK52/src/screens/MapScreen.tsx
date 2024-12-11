import React, { useState, useEffect, useRef } from 'react';
import { View, StyleSheet, ActivityIndicator, Text, TouchableOpacity, Dimensions, Alert, TouchableWithoutFeedback, Platform, Image } from 'react-native';
import MapView, { Marker, Callout } from 'react-native-maps';
import * as Location from 'expo-location';
import { useDispatch, useSelector } from 'react-redux';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { useNavigation } from '@react-navigation/native';
import CustomCallout from '../components/CustomCallout';
import MapViewDirections from 'react-native-maps-directions';
import { getMemoizedBranches } from '../redux/selectors/branchSelectors';
import Loader from '../components/Loader';
import { Ionicons } from '@expo/vector-icons';
import { getMemoizedTouristPoints } from '../redux/selectors/touristPointSelectors';
import { fetchTouristPoints } from '../redux/actions/touristPointActions';
import { AppDispatch } from '../redux/store/store';

const initialRegion = {
  latitude: -36.133852565671226,
  longitude: -72.79750640571565,
  latitudeDelta: 0.035,
  longitudeDelta: 0.02,
};

const GOOGLE_MAPS_APIKEY = process.env.EXPO_PUBLIC_API_KEYGOOGLE;
const screenHeight = Dimensions.get('window').height;


const MapScreen: React.FC = () => {
  const navigation = useNavigation();
  const dispatch = useDispatch<AppDispatch>();
  const branches = useSelector(getMemoizedBranches);
  const [location, setLocation] = useState<Location.LocationObject | null>(null);
  const [loading, setLoading] = useState(true);
  const [destination, setDestination] = useState<{ latitude: number; longitude: number } | null>(null);
  const [route, setRoute] = useState<boolean>(false);
  const [selectedBranch, setSelectedBranch] = useState<any>(null);
  const [routeLoading, setRouteLoading] = useState(false);
  const mapRef = useRef<MapView>(null);
  const touristPoints = useSelector(getMemoizedTouristPoints);
  const [showPOI, setShowPOI] = useState(true);
  // console.log("sucursales", branches);
  // console.log("api key==============", GOOGLE_MAPS_APIKEY);
  // console.log("localizacion del usuario", location);

  useEffect(() => {
    dispatch(fetchTouristPoints());
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        console.error('Permission to access location was denied');
        setLoading(false);
        return;
      }

      let location = await Location.getCurrentPositionAsync({});
      setLocation(location);
      setLoading(false);
    })();
  }, []);

  const handleMarkerPress = (branch: any) => {
    setSelectedBranch(branch);
    setRoute(false)
  };

  const handleRoutePress = (latitude: number, longitude: number) => {
    setDestination({ latitude, longitude });
    setRoute(true)
    setSelectedBranch(null);
    setRouteLoading(true);
  };

  const handleMapPress = () => {
    setSelectedBranch(null);
  };

  if (loading) {
    return (
      <View style={styles.loaderContainer}>
        <Loader />
      </View>
    );
  }

  if (!location || !branches) {
    return (
      <View style={styles.loaderContainer}>
        <Text style={styles.errorText}>Unable to fetch current location or branches</Text>
      </View>
    );
  }

  if (!GOOGLE_MAPS_APIKEY) {
    return (
      <View style={styles.loaderContainer}>
        <Text style={styles.errorText}>Google Maps API key is not defined</Text>
      </View>
    );
  }

  const centerMap = () => {
    if (mapRef.current && location) {
      mapRef.current.animateToRegion({
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
        latitudeDelta: 0.035,
        longitudeDelta: 0.02,
      });
    }
  };

  const goToInitialRegion = () => {
    if (mapRef.current) {
      mapRef.current.animateToRegion(initialRegion);
    }
  };
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
  const mapStyle = showPOI ? [] : [
    {
      elementType: 'labels',
      stylers: [{ visibility: 'off' }],
    },
    {
      featureType: 'poi',
      stylers: [{ visibility: 'off' }],
    },
  ];
  return (
    <TouchableWithoutFeedback onPress={handleMapPress}>
      <View style={styles.container}>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <MaterialIcons name="arrow-back-ios-new" size={24} color="rgb(0, 122, 140)" />
        </TouchableOpacity>
        <MapView
          ref={mapRef}
          style={styles.map}
          initialRegion={{
            latitude: -36.133852565671226,
            longitude: -72.79750640571565,
            latitudeDelta: 0.035,
            longitudeDelta: 0.02,
          }}
          customMapStyle={mapStyle}
          onPress={handleMapPress}
        >
          {branches.map((branch: any) => (
            <Marker
              key={branch.branch_id}
              coordinate={{
                latitude: branch.latitude ?? 0,
                longitude: branch.longitude ?? 0,
              }}
              onPress={() => handleMarkerPress(branch)}
            >
              <MaterialCommunityIcons name="map-marker" size={40} color="#F1AD3E" />
              {Platform.OS === 'ios' && (
                <Callout style={route ? styles.calloutContainerHide : styles.calloutContainerIos} tooltip>
                  <View style={styles.callout}>
                    <View style={styles.calloutImageContainer}>
                      <Image
                        source={{ uri: branch.image_url }}
                        style={styles.calloutImage}
                      />
                    </View>
                    <Text style={styles.calloutTitle}>{branch.name}</Text>
                    <View style={styles.divider} />
                    <View style={styles.ratingContainer}>
                      {/* Aqui debo agregar las estrellas  */}
                      {renderStars(3.5)}
                    </View>
                    <Text style={styles.calloutDescription}>{branch.description}</Text>
                    <Text style={styles.calloutDescription}>{branch.address}</Text>
                    <TouchableOpacity
                      style={styles.calloutButton}
                      onPress={() => handleRoutePress(branch.latitude ?? 0, branch.longitude ?? 0)}
                    >
                      <Text style={styles.calloutButtonText}>Cómo llegar?</Text>
                    </TouchableOpacity>
                  </View>
                </Callout>
              )}
            </Marker>
          ))}
          {/* Mostrar puntos turísticos */}
          {touristPoints.map((touristPoint: any) => (
            <Marker
              key={touristPoint.id} // Asegúrate de usar el campo correcto como key
              coordinate={{
                latitude: touristPoint.latitude ?? 0,
                longitude: touristPoint.longitude ?? 0,
              }}
              onPress={() => handleMarkerPress(touristPoint)}
            >
              <MaterialCommunityIcons name="map-marker-star-outline" size={40} color="#3dc6f4" />
              {Platform.OS === 'ios' && (
                <Callout style={route ? styles.calloutContainerHide : styles.calloutContainerIos} tooltip>
                  <View style={styles.callout}>
                    <View style={styles.calloutImageContainer}>
                      <Image
                        source={{ uri: touristPoint.images[0]?.image_path }}
                        style={styles.calloutImage}
                      />
                    </View>
                    <Text style={styles.calloutTitle}>{touristPoint.title}</Text>
                    <View style={styles.divider} />
                    <View style={styles.ratingContainer}>
                      {renderStars(touristPoint.average_rating)}
                    </View>
                    {/* <Text style={styles.calloutDescription}>{touristPoint.description}</Text> */}
                    <Text style={styles.calloutDescription}>{touristPoint.address}</Text>
                    <TouchableOpacity
                      style={styles.calloutButton}
                      onPress={() => handleRoutePress(touristPoint.latitude ?? 0, touristPoint.longitude ?? 0)}
                    >
                      <Text style={styles.calloutButtonText}>Cómo llegar?</Text>
                    </TouchableOpacity>
                  </View>
                </Callout>
              )}
            </Marker>
          ))}


          <Marker
            coordinate={{
              latitude: location.coords.latitude,
              longitude: location.coords.longitude,
            }}
            title="Tu ubicación"
          >
            <MaterialCommunityIcons name="map-marker-account" size={40} color="rgb(0, 122, 140)" />
          </Marker>
          {destination && location && (
            <MapViewDirections
              origin={{
                latitude: location.coords.latitude,
                longitude: location.coords.longitude,
              }}
              destination={destination}
              apikey={GOOGLE_MAPS_APIKEY!}
              strokeWidth={3}
              strokeColor="rgb(0, 122, 140)"
              timePrecision="none"
              precision='high'
              onReady={() => {
                setRouteLoading(false);
              }}
              onError={(errorMessage) => {
                console.error('GMSDirections Error: ', errorMessage);
                Alert.alert('Error', 'No se pudo calcular la ruta.');
              }}
            />
          )}
        </MapView>
        {routeLoading && (
          <View style={styles.routeLoaderContainer}>
            <ActivityIndicator size="large" color="rgb(0, 122, 140)" />
          </View>
        )}
        {selectedBranch && Platform.OS === 'android' && (
          <View style={styles.calloutContainer}>
            <CustomCallout
              branch={selectedBranch}
              handleRoutePress={() => handleRoutePress(selectedBranch.latitude ?? 0, selectedBranch.longitude ?? 0)}
            />
          </View>
        )}
        <TouchableOpacity style={styles.centerButton} onPress={centerMap}>
          <MaterialCommunityIcons name="crosshairs-gps" size={24} color="#FFF" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.initialRegionButton} onPress={goToInitialRegion}>
          <MaterialIcons name="discount" size={24} color="#FFF" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.referButton} onPress={() => setShowPOI(prev => !prev)}>
          <MaterialCommunityIcons name="map-marker-remove-outline" size={24} color="#FFF" />
        </TouchableOpacity>
      </View>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // backgroundColor: '#fff',
  },
  map: {
    width: '100%',
    height: '100%',
  },
  calloutContainerIos: {
    backgroundColor: 'rgba(255, 255, 255,0.7)'
  },
  calloutContainerHide: {
    display: "none"
  },
  callout: {
    flexDirection: 'column',
    alignItems: 'center',
    width: 200,
    padding: 10,
  },
  calloutImageContainer: {
    marginBottom: 5,
    justifyContent: 'center',
    alignItems: 'center',
  },
  calloutImage: {
    width: 150,
    height: 100,
    borderRadius: 5,
  },
  calloutTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  divider: {
    height: 1,
    width: '100%',
    backgroundColor: 'rgba(206, 206, 206, 0.5)',
    marginVertical: 5,
  },
  ratingContainer: {
    flexDirection: 'row',
    marginBottom: 5,
  },
  calloutDescription: {
    fontSize: 14,
    color: '#555',
    textAlign: 'center',
    marginBottom: 5,
  },
  calloutButton: {
    backgroundColor: 'rgb(0, 122, 140)',
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 5,
  },
  calloutButtonText: {
    color: '#fff',
  },
  calloutContainer: {
    position: 'absolute',
    bottom: 100,
    left: 0,
    right: 0,
    alignItems: 'center',
  },
  loaderContainer: {
    height: '100%',
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorText: {
    fontSize: 18,
    color: 'red',
  },
  centerButton: {
    position: 'absolute',
    zIndex: 1,
    bottom: 110,
    right: 20,
    backgroundColor: 'rgb(0, 122, 140)',
    padding: 10,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
    elevation: 5,
  },
  initialRegionButton: {
    position: 'absolute',
    zIndex: 1,
    bottom: 60,
    right: 20,
    backgroundColor: '#F1AD3E',
    padding: 10,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
    elevation: 5,
  },
  referButton: {
    position: 'absolute',
    zIndex: 1,
    bottom: 30,
    left: 13,
    backgroundColor: '#999a9b',
    padding: 10,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
    elevation: 5,
  },
  routeLoaderContainer: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: [{ translateX: -25 }, { translateY: -25 }],
    zIndex: 3,
  },
  backButton: {
    position: 'absolute',
    // alignSelf:'center',
    zIndex: 1,
    width: 45,
    top: 30,
    height: 35,
    left: 10,
    backgroundColor: 'rgb(255, 255, 255)',
    padding: 5,
    borderRadius: 5,
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    alignContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 1,
    elevation: 3,
  },
});

export default MapScreen;
