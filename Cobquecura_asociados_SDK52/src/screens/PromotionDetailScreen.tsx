import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, Dimensions, ActivityIndicator, Modal, Alert, TextInput } from 'react-native';
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { Share } from 'react-native';
import { RootStackParamList } from '../navigation/AppNavigator';
import { AppDispatch } from '../redux/store/store';
import { useDispatch, useSelector } from 'react-redux';
import { getMemoizedBranches, getMemoizedBranchRatingsWithMetadata } from '../redux/selectors/branchSelectors';
import { Branch, ImagePromotion, Promotion } from '../redux/types/types';
import { getMemoizedFavorites, getMemoizedUserData } from '../redux/selectors/userSelectors';
import { addFavoriteAction, removeFavoriteAction } from '../redux/actions/userActions';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import Carousel from 'react-native-reanimated-carousel';
import QRCode from 'react-native-qrcode-svg';
import { Ionicons } from '@expo/vector-icons';
import { ScrollView } from 'react-native-gesture-handler';
import { addRating, clearBranchRatingsAction, fetchBranchRatings } from '../redux/actions/branchActions';
import * as Location from 'expo-location';
import MapSingle from '../components/MapSingle';
import ErrorModal from '../components/ErrorModal';
import ExitoModal from '../components/ExitoModal';

type PromotionDetailScreenRouteProp = RouteProp<RootStackParamList, 'PromotionDetail'>;

const { width: screenWidth } = Dimensions.get('window');
const screenHeight = Dimensions.get('window').height;
const API_URL = process.env.EXPO_PUBLIC_API_URL;

const PromotionDetailScreen: React.FC = () => {
  const route = useRoute<PromotionDetailScreenRouteProp>();
  const dispatch: AppDispatch = useDispatch();
  const branches = useSelector(getMemoizedBranches);
  const { promotion } = route.params;
  const navigation = useNavigation();
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [branch, setBranch] = useState<Branch | null>(null);
  const [currentPosition, setCurrentPosition] = useState<{ latitude: number, longitude: number } | null>(null);
  const userFavorites = useSelector(getMemoizedFavorites);
  const [destination, setDestination] = useState<{ latitude: number, longitude: number } | null>(null);
  const [routeSelected, setRouteSelected] = useState<boolean>(false);
  const [selectedBranch, setSelectedBranch] = useState<any>(null);
  const [routeLoading, setRouteLoading] = useState(false);
  const [newRating, setNewRating] = useState<number>(0);
  const [newComment, setNewComment] = useState<string>('');
  const ratings = useSelector(getMemoizedBranchRatingsWithMetadata);
  const user = useSelector(getMemoizedUserData); 
  const [modalMessage, setModalMessage] = useState('');
  const [modalErrorVisible, setModalErrorVisible] = useState(false);
  const [modalSuccessVisible, setModalSuccessVisible] = useState(false);
  const [modalSuccessMessage, setModalSuccessMessage] = useState('');
  // console.log("newRating",newRating);
  // console.log("newComment",newComment);
  const promoImage = promotion.images.length > 0 ? `${API_URL}${promotion.images[0].image_path}` : 'https://res.cloudinary.com/dbwmesg3e/image/upload/v1721157537/TurismoApp/no-product-image-400x400_1_ypw1vg_sw8ltj.png';

  // console.log("ratings en descripcion ",ratings);
  // console.log("branch en descripcion ",branch);

  useEffect(() => {
    if (branches.length) {
      const branchProm = branches.find(branch => branch.branch_id == promotion.branch_id) || null;
      setBranch(branchProm);
      if (branchProm) {
        dispatch(fetchBranchRatings(branchProm.branch_id));
      }
    }
  }, [branches]);
  useEffect(() => {
    if (branch) {
      dispatch(fetchBranchRatings(branch.branch_id));
    }
  }, [branch]);


  useEffect(() => {
    const requestLocationPermission = async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        showErrorModal('El permiso de geolocalización es necesario para conocer tu ubicacíon actual.');
        return;
      }

      const location = await Location.getCurrentPositionAsync({});
      setCurrentPosition({
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
      });
    };

    requestLocationPermission();
  }, []);
  const handleShare = async () => {
    // try {
    //   const message = `Mira esta promoción: ${promotion.title}`;
    //   await Share.share({ message });
    // } catch (error) {
    //   console.error('Error al compartir:', error);
    // }
  };

  //mapa
  const handleGetDirections = () => {
    if (branch && currentPosition) {
      setRouteLoading(true)
      setRouteSelected(true)
      setDestination({
        latitude: branch.latitude,
        longitude: branch.longitude,
      });
    }
  };


  // Favoritos
  const isFavorite = (promotionId: number) => {
    return userFavorites.includes(promotionId);
  };

  const handleFavoritePress = (promotion: Promotion) => {
  };
  // console.log(user);
  const openModal = (imagePath: string) => {
    setSelectedImage(imagePath);
    setModalVisible(true);
  };

  const handleImageLoadStart = () => setLoading(true);
  const handleImageLoadEnd = () => setLoading(false);
  const closeModal = () => {
    setModalVisible(false);
    setSelectedImage(null);
  };

  const handleBackPress = () => {
    dispatch(clearBranchRatingsAction());
    navigation.goBack();
  };
  const handleAddRating = () => {
    showErrorModal("Solo es una vista previa, la funcionalidad de enviar valoración no está disponible desde aquí.");
    setNewRating(0);
    setNewComment('');
  };
  const showErrorModal = (message: string) => {
    setModalMessage(message);
    setModalErrorVisible(true);
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

  const renderItem = ({ item }: { item: ImagePromotion }) => (
    <View style={styles.carouselItem}>
      <Image source={{ uri: `${API_URL}${item.image_path}` }} style={styles.carouselImage} onLoadStart={handleImageLoadStart} onLoadEnd={handleImageLoadEnd} />
    </View>
  );
  
  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={handleBackPress}>
          <MaterialIcons name="arrow-back-ios-new" size={24} color="rgb(0, 122, 140)" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.shareButton} onPress={handleShare}>
          <MaterialCommunityIcons name="share-variant" size={24} color="rgb(0, 122, 140)" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.favoriteButton} onPress={() => handleFavoritePress(promotion)}>
          <MaterialCommunityIcons name={isFavorite(promotion.promotion_id) ? 'cards-heart' : 'cards-heart-outline'} size={24} color="rgb(0, 122, 140)" />
        </TouchableOpacity>
      </View>
      {loading && (
        <View style={styles.loaderImgLarge}>
          <ActivityIndicator size="large" color="#F1AD3E" />
        </View>
      )}
      <Image
        source={{ uri: promoImage }}
        style={styles.mainImage}
        onLoadStart={handleImageLoadStart}
        onLoadEnd={handleImageLoadEnd}
      />
      <View style={styles.thumbnailsContainer}>
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        {promotion.images.length > 1 &&
          promotion.images.slice(1).map((item) => (
            <TouchableOpacity key={item.image_id} onPress={() => openModal(item.image_path)}>
              {loading && (
                <View style={styles.loader}>
                  <ActivityIndicator size="large" color="#F1AD3E" />
                </View>
              )}
              <Image source={{ uri: `${API_URL}${item.image_path}` }} style={styles.thumbnail} onLoadStart={handleImageLoadStart} onLoadEnd={handleImageLoadEnd} />
            </TouchableOpacity>
          ))
        }
        </ScrollView>
      </View>

      {/* Modal de imagenes */}
      <Modal visible={modalVisible} transparent={true} animationType="slide" onRequestClose={closeModal}>
        <View style={styles.modalContainer}>
          <View style={styles.modalContainer2}>
            <Carousel
              loop
              width={screenWidth}
              height={screenWidth * 0.75}
              autoPlay={true}
              data={promotion.images}
              scrollAnimationDuration={3000}
              mode="parallax"
              modeConfig={{
                parallaxScrollingScale: 0.8,
                parallaxScrollingOffset: 50,
              }}
              renderItem={renderItem}
              style={styles.carousel}
              panGestureHandlerProps={{
                activeOffsetX: [-10, 10],
              }}
            />
            <TouchableOpacity style={styles.closeButton} onPress={closeModal}>
              <MaterialCommunityIcons name="close" size={24} color="#f1ad3e" />
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
      <View style={styles.containerText}>
        <Text style={styles.title}>{promotion.title}</Text>
        <View style={styles.ratingContainerTitle}>
          {renderStars(ratings.average_rating)}
        </View>
        <Text style={styles.descriptiontitle}>Descripción:</Text>
        <Text style={styles.description}>{promotion.description}</Text>
        <View style={styles.qrCode}>
          <QRCode
            value={promotion.qr_code}
            size={screenWidth * 0.5}
            color="black"
            backgroundColor="white"
          />
          <Text style={styles.dates}>Validez:</Text>
          <View style={styles.dates2}>
            <Text style={styles.dates}>Desde: {promotion.start_date}</Text>
            <Text style={styles.dates}>Hasta: {promotion.expiration_date}</Text>
          </View>
        </View>
      </View>
      <View style={styles.descriptiontitleMapCont}>
        {branch && branch.latitude !== null && branch.longitude !== null && (
          <View style={styles.descriptiontitleMap}>
            <Text style={styles.descriptiontitleMap}>Ubicación:</Text>
            <Text style={styles.descriptiontitleMap}>{branch.address}</Text>
            <MapSingle
              branch={branch}
              currentPosition={currentPosition}
              destination={destination}
              routeSelected={routeSelected}
              selectedBranch={selectedBranch}
              ratings={ratings}
              handleGetDirections={handleGetDirections}
              setSelectedBranch={setSelectedBranch}
              routeLoading={routeLoading}
              setRouteLoading={setRouteLoading}
              justSee={true}
            />
          </View>
        )}
      </View>
   
      {/* Sección de valoraciones */}
      <View style={styles.ratingsContainer}>
        <Text style={styles.sectionTitle}>Valoraciones:</Text>
        {ratings.ratings.map((rating) => (
          <View key={rating.id} style={styles.ratingItem}>
            <View style={styles.starsTextContainer}>
              <Text style={styles.starsContainer}>{renderStars(rating.rating)} </Text>
            </View>
            <Text style={styles.comment}>{rating.comment}</Text>
            {rating.first_name && <Text style={styles.commentDate}>{rating.first_name}</Text>}
            {rating.created_at && <Text style={styles.commentDate}>{new Date(rating.created_at).toLocaleDateString()}</Text>}

          </View>
        ))}
      </View>

      {/* Sección para agregar nueva valoración */}
      <View style={styles.newRatingContainer}>
        <Text style={styles.sectionTitle}>Escribe tu comentario:</Text>
        <View style={styles.starsContainer}>
          {[1, 2, 3, 4, 5].map((star) => (
            <TouchableOpacity key={star}>
              <Ionicons name={star <= newRating ? 'star' : 'star-outline'} size={24} color="#FFD700" />
            </TouchableOpacity>
          ))}
        </View>
        <TextInput
          style={styles.input}
          placeholder="Comparte tu experiencia"
          value={newComment}
          onChangeText={setNewComment}
          
        />
        <TouchableOpacity style={styles.button} onPress={handleAddRating}>
          <Text style={styles.buttonText}>Enviar valoración</Text>
        </TouchableOpacity>
      </View>
      <ErrorModal
        visible={modalErrorVisible}
        message={modalMessage}
        onClose={() => setModalErrorVisible(false)}
      />
      <ExitoModal
        visible={modalSuccessVisible}
        message={modalSuccessMessage}
        onClose={() => {setModalSuccessVisible(false)}}
        />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    height: screenHeight,
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    // padding: 16,
    // backgroundColor: 'rgb(0, 122, 140)',
  },
  iconButton: {
    padding: 8,
  },
  mainImage: {
    zIndex: -1,
    width: screenWidth,
    height: screenWidth * 0.75,
    resizeMode: 'cover',
  },
  thumbnailsContainer: {
    display: 'flex',
    flexDirection: 'row',
    marginTop: 16,
    marginBottom: 16,
    paddingHorizontal: 16,
  },
  thumbnail: {
    width: 80,
    height: 80,
    borderRadius: 8,
    marginRight: 8,
  },
  backButton: {
    position: 'absolute',
    width: screenWidth * 0.11,
    top: 65,
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
  favoriteButton: {
    position: 'absolute',
    top: 65,
    width: screenWidth * 0.11,
    height: 35,
    right: 20,
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
  shareButton: {
    position: 'absolute',
    right: 20,
    top: 105,
    width: screenWidth * 0.11,
    height: 35,
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    alignContent: 'center',
    backgroundColor: 'rgb(255, 255, 255)',
    padding: 5,
    borderRadius: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 1,
    elevation: 3,
  },
  loaderImgLarge: {
    position: 'absolute',
    top: '8%',
    left: '45%',
  },
  loader: {
    position: 'absolute',
    top: '18%',
    left: '48%',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    height: '100%',
  },
  modalContainer2: {
    height: '50%',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-evenly',
    alignItems: 'center',
    alignContent: 'center',
  },
  carousel: {
    width: screenWidth,
    height: screenWidth * 0.75,
  },
  carouselItem: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  carouselImage: {
    width: screenWidth,
    height: '100%',
    borderRadius: 5,
  },
  closeButton: {
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    borderRadius: 50,
    padding: 15,
    color: '#f1ad3e',
  },
  ratingContainerTitle: {
    marginVertical: 20,
    width: '100%',
    display: 'flex',
    flexDirection: 'row',
    // justifyContent:'flex-end',
    justifyContent: 'center'
  },
  qrCode: {
    height: screenHeight * 0.35,
    display: 'flex',
    marginTop: 20,
    width: '90%',
    justifyContent: 'center',
    flexDirection: 'column',
    alignItems: 'center',
    alignSelf: 'center',
    marginVertical: 20,
  },
  containerText: {
    padding: 20
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'rgb(0, 122, 140)',
    marginBottom: 10,
    textAlign: 'center',
  },
  description: {
    fontSize: 16,
    color: '#555',
    marginBottom: 10,
  },
  descriptiontitle: {
    fontSize: 18,
    color: '#555',
    marginBottom: 10,
    fontWeight: 'bold',
  },
  dates2: {
    marginTop: -5,
    display: 'flex',
    flexDirection: 'row',
    width: '100%',
    justifyContent: 'space-evenly',
    fontSize: 14,
    color: '#888',
    marginBottom: 10,
  },
  dates: {
    paddingTop: 15,
    fontSize: 14,
    color: '#888',
  },
  descriptiontitleMapCont: {
    maxHeight: 600
  },
  descriptiontitleMap: {
    padding: 10,
    fontSize: 14,
    color: '#555',
  },

  ratingsContainer: {
    padding: 20,
  },
  ratingItem: {
    marginBottom: 10,
  },
  starsTextContainer: {
    display: 'flex',

  },
  starsContainer: {
    flexDirection: 'row',
  },
  comment: {
    fontSize: 16,
    color: '#555',
    marginTop: 5,
  },
  commentDate: {
    fontSize: 14,
    color: '#888',
    marginTop: 5,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  newRatingContainer: {

    padding: 20,
  },
  input: {
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
    marginTop: 10,
    marginBottom: 10,
  },
  button: {
    backgroundColor: 'rgb(0, 122, 140)',
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
    marginBottom: 10
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
  },
});

export default PromotionDetailScreen;
