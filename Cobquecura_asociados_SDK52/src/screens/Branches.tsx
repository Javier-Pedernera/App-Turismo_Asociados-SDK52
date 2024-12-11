import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image, FlatList, Modal } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { getMemoizedBranches } from '../redux/selectors/branchSelectors';
import { BranchForm } from '../components/BranchForm';
import SemicirclesOverlay from '../components/SemicirclesOverlay';
import { Dimensions } from 'react-native';
import { fetchPartnerById } from '../redux/actions/userActions';
import { getMemoizedUserData } from '../redux/selectors/userSelectors';
import { UserData } from '../redux/types/types';
import { fetchBranches, inactivateBranch, updateBranch } from '../redux/actions/branchActions';
import { AppDispatch } from '../redux/store/store';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { Switch } from 'react-native';
import { getMemoizedStates } from '../redux/selectors/globalSelectors';
import ErrorModal from '../components/ErrorModal';
import ExitoModal from '../components/ExitoModal';
import { loadData } from '../redux/actions/dataLoader';
import { fetchPromotions } from '../redux/actions/promotionsActions';

const API_URL = process.env.EXPO_PUBLIC_API_URL;
const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

const Branches: React.FC = () => {
  const branches = useSelector(getMemoizedBranches);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedBranch, setSelectedBranch] = useState(null);
  const user = useSelector(getMemoizedUserData) as UserData;
  const dispatch: AppDispatch = useDispatch();
  const statuses = useSelector(getMemoizedStates);
  const [modalErrorVisible, setModalErrorVisible] = useState(false);
  const [modalErrorMessage, setModalErrorMessage] = useState('');
  const [modalSuccessVisible, setModalSuccessVisible] = useState(false);
  const [modalSuccessMessage, setModalSuccessMessage] = useState('');

  useEffect(() => {
    dispatch(loadData());
    dispatch(fetchPartnerById(user.user_id));
    dispatch(fetchBranches(user.user_id));
  }, []);

  const handleView = (branch: any) => {
    setSelectedBranch(branch);
    setIsModalVisible(true);
  };

  const handleCreate = () => {
    setSelectedBranch(null);
    setIsModalVisible(true);
  };

  const closeModal = () => {
    setIsModalVisible(false);
    setSelectedBranch(null);
  };
// console.log("sucursales",branches);
// console.log("imprimo imagende la sucursal miniatura",`${API_URL}${branches[0].image_url}`);
const handleInactivate = async (branchId: number, currentStatus: string) => {
  const statusInactive = statuses.find(status => status.name === 'inactive');
  const statusActive = statuses.find(status => status.name === 'active');
  // console.log("estado inactivo", statusInactive);
  const newStatusId = currentStatus === 'active' ? statusInactive?.id : statusActive?.id;
  try {

    // Aquí despachamos la acción para inactivar la sucursal
    await dispatch(inactivateBranch(branchId, newStatusId));
    await dispatch(fetchPromotions(user.user_id))
    setModalSuccessMessage('Estado cambiado exitosamente');
    setModalSuccessVisible(true);
  } catch (err) {
    setModalErrorMessage('Hubo un error al inactivar la sucursal');
    setModalErrorVisible(true);
  }
};
  return (
    <View style={styles.container}>
      <SemicirclesOverlay/>
      <Text style={styles.nameTitle}>Sucursal</Text>
      {!branches?.length?
        <TouchableOpacity style={styles.createButton} onPress={handleCreate}>
          <Text style={styles.createButtonText}>Crear Sucursal</Text>
        </TouchableOpacity>:
         <FlatList
        data={branches}
        keyExtractor={(item) => item.branch_id.toString()}
        renderItem={({ item }) => (
          <View style={styles.branchContainer}>
            <View  style={styles.branchimage_title}>
            {item.image_url ? <Image source={{ uri: `${API_URL}${item.image_url}` }} style={styles.image} /> :
              <Image
                source={require('../../assets/noimage.png')}
                style={styles.image}
                alt={item.name}
              />}
            <Text style={styles.name}>{item.name}</Text>
            </View>
            <View style={styles.line}></View>
            <View style={styles.buttonContainer}>
              <View  style={styles.buttonActivebranch}>
              <Text style={styles.namestatus}>Sucursal {item?.status?.name == 'active'? 'activa' : 'inactiva'}</Text>
              <Switch
                  value={item.status?.name === 'active'}
                  onValueChange={() => handleInactivate(item.branch_id, item.status?.name)}
                  thumbColor={item?.status?.name === 'active' ? '#007a8c' : '#ccc'}
                  trackColor={{ false: '#9cd1d8', true: '#00c8e2' }}
                  ios_backgroundColor="#9cd1d8"
                />
              </View>
              <TouchableOpacity
                style={styles.viewButton}
                onPress={() => handleView(item)}
              >
                <MaterialCommunityIcons name="store-cog-outline" size={28} color="#007a8c" />
                {/* <Text style={styles.buttonText}>Ver</Text> */}
              </TouchableOpacity>
            </View>
          </View>
        )}
      />
      }
      <Modal visible={isModalVisible} animationType="slide">
        <BranchForm branch={selectedBranch} onClose={closeModal} />
      </Modal>
      <ErrorModal
        visible={modalErrorVisible}
        message={modalErrorMessage}
        onClose={() => setModalErrorVisible(false)}
      />
      <ExitoModal
        visible={modalSuccessVisible}
        message={modalSuccessMessage}
        onClose={() => {
          setModalSuccessVisible(false);
        }}
        />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    display:'flex',
    height: screenHeight ,
    padding: 15,
    backgroundColor: '#fff',
  },
  nameTitle:{
    height: screenHeight *0.25,
    fontSize: 16,
    color:'#fff',
    fontWeight:'600',
    textAlign:'center',
  },
  branchContainer: {
    flexDirection: 'column',
    alignItems: 'center',
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius:5,
    paddingTop: 10,
    paddingBottom: 8,
    paddingLeft:5,
    paddingRight:5
  },
  branchimage_title:{
    width:'95%',
    flexDirection: 'row',
    alignItems: 'center',
  },
  image: {
    width: 90,
    height: 50,
    marginRight: 16,
    borderRadius:5
  },
  name: {
    fontSize: 16,
    flex: 1,
  },
  namestatus:{
    fontSize: 12,
  },
  line:{
    marginTop: 15,
    width:'95%',
    borderTopWidth: 1,
    borderColor: '#ccc',
    paddingBottom: 5,
    paddingLeft:5,
    paddingRight:5
  },
  buttonContainer: {
    flexDirection: 'row',
    width:'100%',
    alignContent:'center',
    justifyContent:'space-between',
    alignItems:'center',
    marginTop:15
  },
  buttonActivebranch:{
    flexDirection: 'row',
    justifyContent:'center',
    alignContent:'center',
    alignItems:'center',
    marginLeft:20
  },
  viewButton: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: 'rgba(0, 122, 140,0.1)',
    padding: 2,
    borderRadius: 50,
    width:48,
    textAlign:'center',
    height:48,
    alignItems:'center',
    justifyContent:'center',
    marginRight:15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.8,
    shadowRadius: 2,
    elevation: 3,
  },
  buttonText: {

    textAlign:'center',
    color: '#fff',
  },
  createButton: {
    backgroundColor: '#007a8c',
    padding: 10,
    width:'80%',
    borderRadius: 8,
    alignSelf:'center',
    marginTop: 16,
    height:48,
    alignItems:'center',
    justifyContent:'center'
  },
  createButtonText: {
    color: '#fff',
    fontSize: 16,
  },
  inactivateButton: {
    backgroundColor: '#ff3b3b',
    padding: 8,
    borderRadius: 8,
    marginLeft: 10,
    width: 80,
    alignItems: 'center',
    justifyContent: 'center',
    height: 48,
  },
  inactive: {
    backgroundColor: '#ccc',
  },
});

export default Branches;
