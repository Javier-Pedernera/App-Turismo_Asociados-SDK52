import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Image, FlatList, Dimensions, Alert, ActivityIndicator, Platform } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import MapSingle from './MapSingle';
import { Branch, UserData } from '../redux/types/types';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch } from '../redux/store/store';
import { addBranch, deleteBranch, fetchBranches, updateBranch } from '../redux/actions/branchActions';
import { getMemoizedUserData } from '../redux/selectors/userSelectors';
import * as Location from 'expo-location';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import Loader from './Loader';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { fetchPartnerById } from '../redux/actions/userActions';
import { getMemoizedStates } from '../redux/selectors/globalSelectors';
import Ionicons from '@expo/vector-icons/Ionicons';
import DeleteModal from './DeleteModal';
import CustomAlert from './CustomAlert';
import { getMemoizedPromotions } from '../redux/selectors/promotionSelectors';
import ExitoModal from './ExitoModal';
import { fetchPromotions } from '../redux/actions/promotionsActions';
import ErrorModal from './ErrorModal';

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');
const API_URL = process.env.EXPO_PUBLIC_API_URL;

interface BranchFormProps {
  branch: any;
  onClose: () => void;
}
export interface BranchCreate {
  partner_id: number;
  name: string;
  address: string;
  latitude: number;
  longitude: number;
  description: string;
  status_id: number;
  image_url?: string;
  image_data?: string;
}
const initialRegion = {
  latitude: -36.133852565671226,
  longitude: -72.79750640571565,
  latitudeDelta: 0.035,
  longitudeDelta: 0.02,
};
export const BranchForm: React.FC<BranchFormProps> = ({ branch, onClose }) => {

  const dispatch: AppDispatch = useDispatch();
  const user = useSelector(getMemoizedUserData) as UserData;
  const promotions = useSelector(getMemoizedPromotions);
  const statuses = useSelector(getMemoizedStates);
  const [name, setName] = useState(branch?.name || '');
  const [address, setAddress] = useState(branch?.address || '');
  const [latitude, setLatitude] = useState(branch?.latitude?.toString() || '');
  const [longitude, setLongitude] = useState(branch?.longitude?.toString() || '');
  const [images, setImages] = useState<{ filename: string, data: string }[]>([]);
  const [branchSelect, setBranchSelect] = useState<any>(null);
  const [description, setDescription] = useState(branch?.description || '');
  const [isLoading, setIsLoading] = useState(false);
  const [isEditing, setIsEditing] = useState(branch? false: true );
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [branchNameInput, setBranchNameInput] = useState('');
  const [confirmBranchName, setConfirmBranchName] = useState('');
  const [deleting, setDeleting] = useState(false);
  const [showAlert, setShowAlert] = useState(false);
  const [modalSuccessVisible, setModalSuccessVisible] = useState(false);
  const [modalSuccessMessage, setModalSuccessMessage] = useState('');
  const [modalMessage, setModalMessage] = useState('');
  const [modalErrorVisible, setModalErrorVisible] = useState(false);
  // console.log("sucursal elegida", branch);
  // console.log("promociones de la sucursal", promotions);
  const handleSubmit = async () => {

    setIsLoading(true);
    const image_data = images?.length > 0 ? images[0].data : '';
    const branchData: BranchCreate = {
      partner_id: user.user_id,
      name,
      address,
      description,
      latitude:parseFloat(latitude),
      longitude: parseFloat(longitude),
      status_id: 1,
      image_data: image_data.length? image_data : undefined,
    };

     try {
    // console.log('Enviando datos de la sucursal:', branchData);
    // console.log('Tiene branch id:', branch.branch_id);
    // console.log('imagen nueva?:', image_data.length);
    let resp;
    
    if (branch && branch.branch_id) {
      if(!branchData.name){
        const errorMessage = `El campo "Nombre" es obligatorio.`;
        showErrorModal(errorMessage)
        return
      }
      console.log('status id:', branch.status.id);
      branchData.status_id = branch.status.id
      resp = await dispatch(updateBranch(branch.branch_id, branchData));
      // console.log("respuesta del dispatch (update)", resp);
      dispatch(fetchBranches(user.user_id))
      dispatch(fetchPartnerById(user.user_id));
      showSuccessModal('La sucursal se ha actualizado correctamente.');
    } else {
      if(!branchData.name || !branchData.latitude || !branchData.longitude){
        const missingFields = [];
        if (!branchData.name || branchData.name =='') missingFields.push('Nombre');
        if (!branchData.latitude) missingFields.push('Latitud y Longitud');
        const errorMessage = `Los siguientes campos son obligatorios: ${missingFields.join(', ')}.`;
        showErrorModal(errorMessage)
        return
      }
      resp = await dispatch(addBranch(branchData));
      console.log(resp);
      dispatch(fetchBranches(user.user_id))
      dispatch(fetchPartnerById(user.user_id));
      showSuccessModal('La sucursal se ha creado correctamente.');
      // console.log("respuesta del dispatch (add)", resp);
    }
      onClose();
    } catch (error) {
      console.error('Error al enviar los datos de la sucursal:', error);
      showErrorModal('Hubo un problema al guardar la sucursal. Por favor, inténtalo de nuevo.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (branchSelect) {
      setLatitude(branchSelect.latitude.toString());
      setLongitude(branchSelect.longitude.toString());
    }
  }, [branchSelect]);

  const handleImagePick = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      base64: true,
      aspect: [16, 9],
      quality: 0.7
    });

    if (!result.canceled) {
      const image = result.assets[0];
      const filename = image.uri.split('/').pop() || 'default_filename.jpg';
      setImages([{ filename, data: image.base64 || '' }]);
    }
  };
  const handleSetCurrentLocation = async () => {
    try {
      // Pedir permiso para acceder a la ubicación
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        showErrorModal('Permiso para acceder a la ubicación denegado');
        return;
      }

      // Obtener la ubicación actual
      const location = await Location.getCurrentPositionAsync({});
      setLatitude(location.coords.latitude.toString());
      setLongitude(location.coords.longitude.toString());
    } catch (error) {
      console.error('Error al obtener la ubicación:', error);
    }
  };

  const handleDeleteBranch = () => {
    setShowAlert(true);
  };
  const handleCancel = () => {
    setShowAlert(false);
  };

  const handleConfirm = () => {
    setShowAlert(false);
    setShowDeleteModal(true)
    // Aquí puedes realizar la acción de eliminación
  };
  
  // Función para eliminar la sucursal
  const handleConfirmDelete = async () => {
    const deletedState = statuses.find(status => status?.name === 'deleted');
    const promotionsIds = promotions.filter(promotion => promotion.branch_id === branch.branch_id).map(promotion => promotion.promotion_id);
    // console.log("ids de as promos a eliminar", promotionsIds);
    
    if (branch && branch.name && branchNameInput === confirmBranchName && branchNameInput === branch?.name) {
      setDeleting(true);
      try {
        // console.log('Sucursal eliminada:', branch.branch_id, deletedState?.id,promotionsIds);
        const resp = await dispatch(deleteBranch(branch.branch_id, deletedState?.id,promotionsIds));
        // console.log('Status eliminada:', resp.status);
        if(resp.status == 200){
          dispatch(fetchBranches(user.user_id))
          dispatch(fetchPromotions(user.user_id))
          showSuccessModal('La sucursal y sus promociones se eliminaron correctamente.');
        }
       
        // Alert.alert('Éxito', 'La sucursal ha sido eliminada correctamente.');
        // onClose();
      } catch (error) {
        console.error('Error al eliminar la sucursal:', error);
        showErrorModal('Hubo un problema al eliminar la sucursal.');
      } finally {
        setDeleting(false);
        setShowDeleteModal(false);
      }
    } else {
      showErrorModal('El nombre de la sucursal no coincide.');
    }
  };
  const showErrorModal = (message: string) => {
    setModalMessage(message);
    setModalErrorVisible(true);
  };
  const showSuccessModal = (message: string) => {
    setModalSuccessMessage(message);
    setModalSuccessVisible(true);
  };
  const handleNameChange = (text: string) => {
    if (text.length > 30) {
      showErrorModal('El nombre no puede superar los 30 caracteres.');
    } else {
      setName(text);
    }
  };
  
  const handleAddressChange = (text: string) => {
    if (text.length > 50) {
      showErrorModal('La dirección no puede superar los 50 caracteres.');
    } else {
      setAddress(text);
    }
  };
  
  const handleDescriptionChange = (text: string) => {
    if (text.length > 250) {
      showErrorModal('La descripción no puede superar los 250 caracteres.');
    } else {
      setDescription(text);
    }
  };

  const handleClose = () => {
    setBranchNameInput('');
    setConfirmBranchName('');
    setShowDeleteModal(false)
  };
  const formItems = [
    {
      id: 'image',
      component: (
        <View  style={styles.imageContainer} >
          {!isEditing? 
          <View style={styles.buttonContainer}><TouchableOpacity onPress={() => setIsEditing(true)} style={styles.editButton}>
              <MaterialCommunityIcons name="file-edit-outline" size={23} color="#fff" />
          </TouchableOpacity>
          <TouchableOpacity
      style={styles.deleteButton}
      onPress={handleDeleteBranch}
    >
      <Ionicons name="trash-outline" size={23} color="#d30000"  />
    </TouchableOpacity>
          </View> : <View></View> }
          <TouchableOpacity onPress={handleImagePick} disabled={!isEditing}>
            {images && images.length > 0 ? (
              <Image source={{ uri: `data:image/jpeg;base64,${images[0].data}` }} style={styles.image} resizeMode='cover' />
            ) : (
              branch?.image_url?.length? <Image source={{ uri: `${API_URL}${branch.image_url}`  }} style={styles.image} resizeMode='cover' /> :
              <View style={styles.placeholderImage}>
                <Image source={require('../../assets/noimage.png')} style={styles.image} alt={branch?.name}/>
              </View>
            )}
          </TouchableOpacity>
          
        </View>
      ),
    },
    {
      id: 'name',
      component: (
        isEditing?
        <>
          <Text style={styles.labelTitle}>Nombre</Text>
          <TextInput
            style={styles.input}
            placeholder="* Nombre de la sucursal"
            value={name}
            onChangeText={handleNameChange}
          />
        </>: <Text style={styles.labelName}>{name}</Text>
      ),
    },
    {
      id: 'address',
      component: (
        isEditing?
        <>
          <Text style={styles.labelTitle}>Dirección</Text>
          <TextInput
            style={styles.input}
            placeholder="Dirección"
            value={address}
            onChangeText={handleAddressChange}
          />
        </>:<View>
         <Text style={styles.labelTitle}>Dirección</Text>
         <Text style={styles.label}>{address}</Text>
        </View>
      ),
    },
    {
      id: 'description',
      component: (
        isEditing?
        <>
          <Text style={styles.labelTitle}>Descripción</Text>
          <TextInput
            style={styles.descriptioninput}
            placeholder="Descripción de la sucursal"
            value={description}
            onChangeText={handleDescriptionChange}
            multiline={true} 
          />
        </>: <View>
         <Text style={styles.labelTitle}>Descripción</Text>
         <Text style={styles.label}>{description}</Text>
        </View>
      ),
    },
    {
      id: 'setCurrentLocation',
      component: (
        isEditing?
        <TouchableOpacity style={styles.locationButton} onPress={handleSetCurrentLocation}>
          <Text style={styles.locationButtonText}>Usar mi ubicación actual</Text>
        </TouchableOpacity>:
        <View></View>
      ),
    },
    {
      id: 'locationInputs',
      component: (
        <View style={styles.locationContainer}>
          <View style={styles.locationInputWrapper}>
            <Text style={styles.labellat}>Latitud</Text>
            <TextInput
              style={styles.inputLatLong}
              placeholder="* Latitud"
              keyboardType="numeric"
              value={latitude}
              onChangeText={setLatitude}
              editable={false}
            />
          </View>
          <View style={styles.locationInputWrapper}>
            <Text style={styles.labellat}>Longitud</Text>
            <TextInput
              style={styles.inputLatLong}
              placeholder="* Longitud"
              keyboardType="numeric"
              value={longitude}
              onChangeText={setLongitude}
              editable={false}
            />
          </View>
        </View>
      ),
    },
    {
      id: 'map',
      component: (
        <View>
          {isEditing? <Text style={styles.labelMap}>Elige la ubicación de la sucursal en el mapa</Text>:<></>} 
          <MapSingle
            branch={{ ...branch, latitude: parseFloat(latitude), longitude: parseFloat(longitude) }}
            currentPosition={null}
            destination={{ latitude: parseFloat(latitude), longitude: parseFloat(longitude) }}
            routeSelected={false}
            selectedBranch={branch}
            onMapPress={() => { }}
            handleGetDirections={() => { }}
            setSelectedBranch={isEditing? setBranchSelect: () => { }}
            routeLoading={false}
            setRouteLoading={() => { }}
            ratings={{ average_rating: 0 }}
            initialRegion={initialRegion}
            isEditing={isEditing}
            justSee={false}
          />
        </View>
      ),
    },
    {
      id: 'submitButton',
      component: (
        isEditing?
        <TouchableOpacity style={styles.submitButton} onPress={handleSubmit} disabled={isLoading}>
          {isLoading ? (
            <ActivityIndicator size="small" color="#fff" />
          ) : (
            <Text style={styles.submitButtonText}>
              {branch ? 'Guardar Cambios' : 'Crear Sucursal'}
            </Text>
          )}
        </TouchableOpacity> : <></>
      ),
    },
    {
      id: 'cancelButton',
      component: (
        isEditing?
        <TouchableOpacity style={styles.cancelButton} onPress={onClose}>
          <Text style={styles.cancelButtonText}>Cancelar</Text>
        </TouchableOpacity>: <></>
      ),
    },
  ];

  return (
    <View
    style={styles.contBranch}
    >
      {isLoading? <Loader />:<></>}
      <TouchableOpacity onPress={onClose} style={styles.backbutton}>
          <MaterialIcons name="arrow-back-ios-new" size={22} color="#fff" />
      </TouchableOpacity>
      <FlatList
        data={formItems}
        keyExtractor={item => item.id}
        renderItem={({ item }) => <View>{item.component}</View>}
        contentContainerStyle={styles.container}
      />

    <ExitoModal
      visible={modalSuccessVisible}
      message={modalSuccessMessage}
      onClose={() => {
        setModalSuccessVisible(false);
        onClose();
      }}
    />
    <ErrorModal
        visible={modalErrorVisible}
        message={modalMessage}
        onClose={() => setModalErrorVisible(false)}
      />

    <CustomAlert
              isVisible={showAlert}
              title="Eliminar Sucursal"
              message="¿Estás seguro de eliminar esta sucursal y todas sus promociones asociadas?"
              onCancel={handleCancel}
              onConfirm={handleConfirm}
            />
       {/* DeleteModal */}
    <DeleteModal
      isVisible={showDeleteModal}
      branchNameInput={branchNameInput}
      confirmBranchName={confirmBranchName}
      onInputChange={setBranchNameInput}
      onConfirmChange={setConfirmBranchName}
      onSubmit={handleConfirmDelete}
      onCancel={handleClose}
      isDeleting={deleting}
    />
    </View>
  );
};

const styles = StyleSheet.create({
  contBranch:{
    paddingTop:Platform.OS === 'ios' ? screenHeight*0.02 : 0
  },
  container: {
    flexGrow: 1,
    padding: 16,
    backgroundColor: '#fff',
  },
  backbutton:{
    position:'absolute',
    backgroundColor:'#007a8c',
    justifyContent:'center',
    textAlign:'center',
    alignItems:'center',
    top: Platform.OS === 'ios' ? screenHeight*0.08 : 20,
    left:25,
    width:40,
    height:35,
    borderRadius:5,
    zIndex:1
  },
  image: {
    width: '100%',
    height: screenHeight * 0.3,
    marginBottom: 16,
    borderRadius: 10,
    top: 10,
    zIndex: 1,
  },

  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    zIndex: 2, 
  },

  placeholderImage: {
    width: '100%',
    height: screenHeight * 0.3,
    marginBottom: 16,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#ccc',
  },
  labelName:{
    marginTop:15,
    fontWeight:'bold',
    fontSize: 20,
    marginBottom: 5,
    color: '#007a8c'
  },
  label: {
    fontSize: 17,
    marginBottom: 5,
    color: '#333'
  },
  labelTitle:{
    marginTop:10,
    fontSize: 14,
    marginBottom: 3,
    color: '#007a8b'
  },
  input: {
    height: 35,
    borderWidth: 1,
    borderColor: '#acd1d6',
    padding: 8,
    borderRadius: 8,
    marginBottom: 16,
  },
  locationContainer: {
    flexDirection: 'row',
    justifyContent: 'center',

  },
  locationInputWrapper: {
    flex: 1,

    textAlign: 'center',
    marginRight: 10,
  },
  labellat: {
    marginTop: 20,
    textAlign: 'center',
    color: '#333'
  },
  inputLatLong: {
    textAlign: 'center',
    color: 'rgb(172, 208, 213)',
    // backgroundColor: '#f0f0f0',
    padding: 5,
    borderRadius: 5,
  },
  submitButton: {
    marginTop: 5,
    backgroundColor: 'rgb(0, 122, 140)',
    padding: 10,
    borderRadius: 8,
    alignItems: 'center',
  },
  submitButtonText: {
    color: '#fff',
    fontSize: 16,
  },
  cancelButton: {
    backgroundColor: '#ccc',
    padding: 10,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 10,
    marginBottom: 20
  },
  cancelButtonText: {
    color: '#fff',
    fontSize: 16,
  },
  locationButton: {
    backgroundColor: 'rgb(0, 122, 140)',
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
    marginVertical: 10,
  },
  locationButtonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  labelMap: {
    marginTop: 30,
    marginBottom: -10,
    color: '#007a8c',
    alignSelf: 'center'
  },
  editButton: {
    position:'absolute',
    zIndex:1,
    top:screenHeight*0.27,
    right:screenHeight*0.12,
    width:40,
    height:40,
    padding:5,
    borderRadius: 25,
    backgroundColor: '#007a8c',
    alignItems:'center',
    justifyContent: 'center',
    alignSelf: 'flex-end',
    shadowColor: '#000', 
    shadowOffset: { width: 0, height: 2 }, 
    shadowOpacity: 0.1, 
    shadowRadius: 3.5, 
    elevation: 5,
  },
  editButtonText: {
    color: 'white',
    fontSize: 16,
  },
  readOnlyText: {
    fontSize: 16,
    color: '#555',
    marginBottom: 10,
  },
  // estilos de eliminar
  deleteButton: {
    position: 'absolute',
    top: screenHeight * 0.27,
    right: screenHeight * 0.04,
    backgroundColor: '#e8e8e8',
    width:40,
    height:40,
    borderRadius: 25,
    padding: 5,
    alignItems:'center',
    justifyContent: 'center',
    alignSelf: 'flex-end',
    zIndex: 1,
    shadowColor: '#000', 
    shadowOffset: { width: 0, height: 2 }, 
    shadowOpacity: 0.1, 
    shadowRadius: 3.5, 
    elevation: 5,
  },
  deleteModal: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  descriptioninput: {
      height: 150,
      borderColor: '#acd1d6',
      borderWidth: 1,
      marginBottom: 10,
      padding: 10,
      textAlignVertical: 'top',
      borderRadius:5
    },
    imageContainer:{
      
    }
});

export default BranchForm;
// verde: #007a8c rgb(0, 122, 140)
// verde claro: #acd0d5 rgb(172, 208, 213)
//  verdeHoja: background: #336749;
// gris: #f6f6f6 rgb(246, 246, 246)