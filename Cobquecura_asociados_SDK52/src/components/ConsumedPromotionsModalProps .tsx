import React, { useState } from 'react';
import { Modal, View, Text, TouchableOpacity, FlatList, StyleSheet, Dimensions } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import Ionicons from '@expo/vector-icons/Ionicons';
import { deletePromotionConsumed } from '../redux/actions/promotionsActions';
import { getMemoizedStates } from '../redux/selectors/globalSelectors';
import { AppDispatch } from '../redux/store/store';
const { width: screenWidth, height: screenHeight } = Dimensions.get('window');
interface ConsumedPromotionsModalProps {
  visible: boolean;
  onClose: () => void;
  consumedPromotions: any[]; // Ajusta según tu tipo de datos
}

const ConsumedPromotionsModal: React.FC<ConsumedPromotionsModalProps> = ({ visible, onClose, consumedPromotions }) => {
    const dispatch: AppDispatch = useDispatch();
  const statuses = useSelector(getMemoizedStates);
  const [selectedPromotion, setSelectedPromotion] = useState<number | null>(null);
  const [isConfirmModalVisible, setIsConfirmModalVisible] = useState(false);

  const handleDeletePromotion = (promotionId: number) => {
    console.log('Promoción seleccionada para eliminar:', promotionId);
    // Cierra el modal de consumos
    
    setSelectedPromotion(promotionId);
    onClose(); 
    setIsConfirmModalVisible(true);
    console.log('isConfirmModalVisible', isConfirmModalVisible);
  };
// console.log("seleccionada para borrar",selectedPromotion);

  const confirmDelete = () => {
    const statusDeleted = statuses.find(status => status.name === 'deleted');
    const data = {
      status_id: statusDeleted?.id
    };
    if (selectedPromotion) {
      dispatch(deletePromotionConsumed(selectedPromotion, data));
    }
    setIsConfirmModalVisible(false);
  };
  const cancelDelete = () => {
    setIsConfirmModalVisible(false);
  };
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
  
    const year = date.getFullYear();
    const month = (`0${date.getMonth() + 1}`).slice(-2);
    const day = (`0${date.getDate()}`).slice(-2);
    const hours = (`0${date.getHours()}`).slice(-2);
    const minutes = (`0${date.getMinutes()}`).slice(-2);
  
    return `${day}-${month}-${year} -  ${hours}:${minutes}hrs`;
  };
  const renderItem = ({ item }: any) => (
    <View style={styles.promotionItem}>
        <View style={styles.promotionItemText}>
      <Text style={styles.promotionTitle}> # Id transacción: {item.id}</Text>
      <Text>Cantidad consumida: {item.quantity_consumed}</Text>
      <Text>Monto consumido: {item.amount_consumed}</Text>
      <Text>Fecha: {formatDate(item.consumption_date)}</Text>
        </View>
      <TouchableOpacity
        style={styles.deleteButton}
        onPress={() => handleDeletePromotion(item.id)}
      >
        <Ionicons name="trash-outline" size={25} color="#e04545" />
      </TouchableOpacity>
    </View>
  );

  return (
    <>
    <Modal visible={visible} animationType="slide" transparent={true}>
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
       { consumedPromotions.filter(promotion => 
                promotion.status?.name === 'active'
              ).length? 
          <FlatList
            data={consumedPromotions.filter(promotion => 
                promotion.status?.name === 'active'
              )}
            renderItem={renderItem}
            keyExtractor={(item, index) => item.promotion_consumed_id ? item.promotion_consumed_id.toString() : index.toString()} 
          />: <Text> No tienes transacciones realizadas aún</Text> }
          <TouchableOpacity onPress={onClose} style={styles.closeButton}>
            <Text style={styles.closeButtonText}>Cerrar</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
    <Modal
        visible={isConfirmModalVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={cancelDelete}
      >
        <View style={styles.confirmModalContainer}>
          <View style={styles.confirmModalContent}>
            <Text style={styles.confirmationText}>¿Estás seguro de que deseas eliminar esta promoción?</Text>
            <View style={styles.confirmationButtons}>
              <TouchableOpacity onPress={confirmDelete} style={styles.confirmButton}>
                <Text style={styles.confirmButtonText}>Sí</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={cancelDelete} style={styles.cancelButton}>
                <Text style={styles.cancelButtonText}>No</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </>
  );
};

export default ConsumedPromotionsModal;

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)', // Fondo semitransparente
    zIndex: 1, // Nivel más bajo
  },
  modalContent: {
    width: '90%',
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
  },
  promotionItem: {
    marginBottom: 15,
    display:'flex',
    flexDirection:'row',
    width:'100%',
    justifyContent:'space-between',
    alignContent:'center',
    alignItems:'center'
  },
  promotionItemText:{

  },
  promotionTitle: {
    color:'#333',
    fontWeight: 'bold',
    fontSize: 16,
  },
  deleteButton: {
    width:screenWidth*0.2,
    padding: 10,
    marginTop: 10,
    borderRadius: 5,
  },
  deleteButtonText: {
    color: 'white',
    textAlign: 'center',
  },
  closeButton: {
    backgroundColor: '#007a8c',
    padding: 15,
    marginTop: 20,
    borderRadius: 5,
  },
  closeButtonText: {
    color: 'white',
    textAlign: 'center',
  },
  confirmModalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.7)', // Fondo más oscuro
    zIndex: 10, // Mayor prioridad para el modal superior
    elevation: 10, // Asegura que se renderice por encima en Android
  },
  confirmModalContent: {
    width: screenWidth - 80,
    padding: 20,
    backgroundColor: 'white',
    borderRadius: 10,
    elevation: 5,
  },
  confirmationText: {
    marginBottom: 20,
    fontSize: 16,
  },
  confirmationButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  confirmButton: {
    padding: 10,
    backgroundColor: '#007a8c',
    borderRadius: 5,
    marginRight: 10,
    width:'40%',
  },
  confirmButtonText: {
    textAlign:'center',
    color: 'white',
    fontWeight: 'bold',
  },
  cancelButton: {
    width:'40%',
    padding: 10,
    backgroundColor: '#e04545',
    borderRadius: 5,
  },
  cancelButtonText: {
    textAlign:'center',
    color: 'white',
    fontWeight: 'bold',
  },
});
