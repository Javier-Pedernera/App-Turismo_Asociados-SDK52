import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, Platform, Dimensions, ActivityIndicator } from 'react-native';
import MapView, { Marker, Callout } from 'react-native-maps';
import MapViewDirections from 'react-native-maps-directions';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import CustomCallout from '../components/CustomCallout';
import { Ionicons } from '@expo/vector-icons';

const { width: screenWidth } = Dimensions.get('window');
const screenHeight = Dimensions.get('window').height;
const API_URL = process.env.EXPO_PUBLIC_API_URL;

interface MapComponentProps {
  branch: any | null;
  currentPosition: { latitude: number, longitude: number } | null;
  destination: { latitude: number, longitude: number } | null;
  routeSelected: boolean;
  selectedBranch: any;
  onMapPress?: () => void;
  handleGetDirections: () => void;
  setSelectedBranch: (branch: any) => void;
  routeLoading: boolean;
  isEditing?: boolean;
  setRouteLoading: (loading: boolean) => void;
  ratings: any;
  justSee:boolean;
  initialRegion?: {
    latitude: number;
    longitude: number;
    latitudeDelta: number;
    longitudeDelta: number;
  };
}

const MapSingle: React.FC<MapComponentProps> = ({
  ratings,
  branch,
  currentPosition,
  destination,
  routeSelected,
  selectedBranch,
  onMapPress,
  handleGetDirections,
  setSelectedBranch,
  routeLoading,
  isEditing,
  setRouteLoading,
  initialRegion,
  justSee
}) => {
  const [searchLocation, setSearchLocation] = useState({
    latitude: branch?.latitude || initialRegion?.latitude,
    longitude: branch?.longitude || initialRegion?.longitude,
    address: branch?.address || '',
  });
  console.log("ubicacion branch",branch?.latitude, branch?.longitude);
  
  useEffect(() => {
    if(branch?.latitude && branch?.longitude)
    setSearchLocation({ ...searchLocation, latitude:branch?.latitude , longitude:branch?.longitude })
  }, [branch?.latitude, branch?.longitude]);

  const handleMapPress = (e: any) => {
    // console.log("funcion pressmap", e.nativeEvent);
    const { latitude, longitude } = e.nativeEvent.coordinate;
    setSearchLocation({ ...searchLocation, latitude, longitude });
    setSelectedBranch({ ...branch, latitude, longitude });
  };
  // console.log("selected branch", selectedBranch);

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

  return (
    <View style={styles.mapContainer}>
      <MapView
        style={styles.map}
        region={{
          latitude: searchLocation.latitude,
          longitude: searchLocation.longitude,
          latitudeDelta: 0.01,
          longitudeDelta: 0.01,
        }}
        onPress={isEditing? handleMapPress: undefined}
        scrollEnabled={isEditing}
      >
        {branch && (
          <Marker
            coordinate={{ latitude: searchLocation.latitude, longitude: searchLocation.longitude }}
            onPress={() => setSelectedBranch(branch)}
          >
            <MaterialCommunityIcons name="map-marker" size={40} color="#F1AD3E" />
            {Platform.OS === 'ios' && (
              <Callout style={routeSelected ? styles.calloutContainerHide : styles.calloutContainerIos} tooltip>
                <View style={styles.callout}>
                  <View style={styles.calloutImageContainer}>
                    <Image source={{ uri: `${API_URL}${branch.image_url}`}} style={styles.calloutImage} />
                  </View>
                  <Text style={styles.calloutTitle}>{branch.name}</Text>
                  <View style={styles.divider}></View>
                  <View style={styles.ratingContainer}>{renderStars(ratings.average_rating)}</View>
                  <Text style={styles.calloutDescription}>{branch.description}</Text>
                  <Text style={styles.calloutDescription}>{branch.address}</Text>
                  <TouchableOpacity style={styles.calloutButton} >
                    <Text style={styles.calloutButtonText}>Cómo llegar?</Text>
                  </TouchableOpacity>
                </View>
              </Callout>
            )}
          </Marker>
        )}
        {currentPosition && (
          <Marker coordinate={currentPosition} title="Mi ubicación" pinColor="blue">
            <MaterialCommunityIcons name="map-marker-radius" size={40} color="rgb(0, 122, 140)" />
          </Marker>
        )}
      </MapView>
      {routeLoading && (
        <View style={styles.loader}>
          <ActivityIndicator size="large" color="#64C9ED" />
        </View>
      )}
      {selectedBranch && !routeSelected && Platform.OS === 'android' && (
        <View style={isEditing?  styles.calloutContainer:styles.calloutContainerPrev}>
         {isEditing? <Text style={styles.labelMap}>Ejemplo de marcador</Text>:<></>} 
          <CustomCallout branch={selectedBranch} handleRoutePress={handleGetDirections} prevSee={justSee}/>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  mapContainer: {
    padding: 1,
  },
  map: {
    width: '100%',
    height: screenHeight * 0.5,
    marginTop: 20,
  },
  labelMap: {
    textAlign:'center',
    marginTop: 30,
    marginBottom: -20,
    color: '#007a8c',
    alignSelf: 'center'
  },
  ratingContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginVertical: 5,
  },
  calloutContainerHide: {
    display: 'none',
  },
  calloutContainerIos: {
    width: 150,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    padding: 10,
    borderRadius: 10,
    alignItems: 'center',
  },
  callout: {
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  calloutImageContainer: {
    width: 120,
    height: 90,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  calloutImage: {
    width: 130,
    height: 80,
    borderRadius: 5,
    marginBottom: 5,
  },
  calloutTitle: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  calloutButton: {
    backgroundColor: 'rgb(0, 122, 140)',
    marginTop: 10,
    padding: 5,
    borderRadius: 5,
  },
  calloutButtonText: {
    color: '#fff',
    fontSize: 12,
  },
  divider: {
    height: 1,
    width: '100%',
    backgroundColor: 'gray',
    opacity: 0.5,
    marginVertical: 5,
  },
  calloutDescription: {
    textAlign: 'center',
    fontSize: 12,
    color: 'gray',
    marginBottom: 0,
  },
  calloutContainer: {
    width: 200,
    alignItems: 'center',
  },
  calloutContainerPrev:{
    width: screenWidth*0.5,
    // alignItems: 'center',
  },
  loader: {
    position: 'absolute',
    top: '50%',
    left: '45%',
  },
});

export default MapSingle;
