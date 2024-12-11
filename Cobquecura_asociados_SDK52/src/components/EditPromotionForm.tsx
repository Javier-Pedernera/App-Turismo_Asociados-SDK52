import React, { useCallback, useState } from 'react';
import { ScrollView, View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, Platform } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import MultiImageCompressor from './MultiImageCompressor';
import { useDispatch, useSelector } from 'react-redux';
import { getMemoizedPartner, getMemoizedUserData } from '../redux/selectors/userSelectors';
import { Promotion } from '../redux/types/types';
import CategoryPicker from './CategoryPicker';
import { getMemoizedAllCategories } from '../redux/selectors/categorySelectors';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { formatDateToDDMMYYYY } from '../utils/formatDate';
import { AppDispatch } from '../redux/store/store';
import { modifyPromotion } from '../redux/actions/promotionsActions';
import { Image } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import Loader from './Loader';
import ErrorModal from './ErrorModal';
import ExitoModal from './ExitoModal';
import { getMemoizedBranches } from '../redux/selectors/branchSelectors';

interface EditPromotionFormProps {
  promotion: Promotion;
  onClose: () => void;
}
const API_URL = process.env.EXPO_PUBLIC_API_URL;

const EditPromotionForm: React.FC<EditPromotionFormProps> = ({ promotion, onClose }) => {
  const dispatch: AppDispatch = useDispatch();
  const user = useSelector(getMemoizedUserData);
  const allCategories = useSelector(getMemoizedAllCategories);
  const partner = useSelector(getMemoizedPartner);
  const branches = useSelector(getMemoizedBranches);
  const [title, setTitle] = useState(promotion.title);
  const [description, setDescription] = useState(promotion.description);
  const [discountPercentage, setDiscountPercentage] = useState<number | null>(promotion.discount_percentage || null);
  const [availableQuantity, setAvailableQuantity] = useState<number | null>(promotion.available_quantity || null);
  const [existingImages, setExistingImages] = useState<any>(promotion.images);
  const [newImages, setNewImages] = useState<{ filename: string; data: string }[]>([]);
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showStartDatePicker, setShowStartDatePicker] = useState(false);
  const [showEndDatePicker, setShowEndDatePicker] = useState(false);
  const [isCategoriesModalVisible, setCategoriesModalVisible] = useState(false);
  const [selectedCategories, setSelectedCategories] = useState<number[]>(promotion.categories.map(category => category.category_id));
  const [imagesToDelete, setImagesToDelete] = useState<number[]>([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [modalMessage, setModalMessage] = useState('');
  const [modalSuccessVisible, setModalSuccessVisible] = useState(false);
  const [modalSuccessMessage, setModalSuccessMessage] = useState('');

 const handleImagesCompressed = useCallback((images: { filename: string; data: string }[]) => {
  if (images.length <= 10) {
    setNewImages(images);
  } else {
    showErrorModal('No se pueden agregar más de 10 imágenes.');
  }
}, []);

  const handleSelectCategories = (newSelectedCategories: number[]) => {
    setSelectedCategories(newSelectedCategories);
  };
  const handleDeleteImage = (imageId: number) => {
    setImagesToDelete([...imagesToDelete, imageId]);
    setExistingImages(existingImages.filter((img: any) => img.image_id !== imageId));
  };
  const handleSubmit = () => {
    const activeBranch = branches.find(
      (branch: any) => branch.status?.name === 'active' || branch.status?.name === 'inactive'
    );
    if (!user?.user_id || !activeBranch?.branch_id) {
      showErrorModal('No se pudo obtener el ID del socio o la sucursal. Intente de nuevo.');
      return;
    }
    // console.log("campos vacios?",title,description,discountPercentage);
    
    setIsLoading(true)
    if (!title || discountPercentage === null ) {
      const missingFields = [];
      if (!title) missingFields.push('título');
      if (discountPercentage === null) missingFields.push('porcentaje de descuento');

        const errorMessage = `Los siguientes campos son obligatorios: ${missingFields.join(', ')}.`;
        showErrorModal(errorMessage);
        setIsLoading(false);
        return;
    }
    const promotionData = {
      branch_id: activeBranch.branch_id,
      title,
      description,
      start_date: startDate?.toLocaleDateString(),
      expiration_date: endDate?.toLocaleDateString(),
      discount_percentage: discountPercentage,
      available_quantity: availableQuantity,
      partner_id: user?.user_id || 0,
      category_ids: selectedCategories,
      images: [
        ...newImages
      ]
    };
    const deletedImageIds = imagesToDelete
    // console.log("datos a enviar",promotionData, deletedImageIds);
    if (promotion.promotion_id) {
      dispatch(modifyPromotion(promotion.promotion_id, promotionData, deletedImageIds))
        .then(() => {
          setIsLoading(false)
          setModalSuccessMessage('La promoción ha sido actualizada correctamente.');
          setModalSuccessVisible(true);
          // // Alert.alert('Éxito', 'La promoción ha sido actualizada correctamente.');
          // onClose();
        })
        .catch((error: any) => {
          setIsLoading(false)

          showErrorModal('Hubo un problema al actualizar la promoción. Intente de nuevo.');
          console.error("Error al actualizar la promoción: ", error);
        });
    } else {
      setIsLoading(false)
      Alert.alert('Error', 'No hay ID de promoción');
    }
  };

  const handleStartDateChange = (event: any, date?: Date) => {
    if (date && endDate && date > endDate ) {
      showErrorModal('La fecha de finalización no puede ser mayor a la fecha de fin.');
      setEndDate(endDate)
      setShowStartDatePicker(false);
      return;
    }
    if (date && date < new Date()) {
      showErrorModal('La fecha de inicio no puede ser menor a la fecha actual.');
      setShowStartDatePicker(false);
      return;
    }
    if (Platform.OS === 'ios') {
      setStartDate(date || startDate);
    } else {
      if (date) {
        setStartDate(date);
      }
      setShowStartDatePicker(false);
    }
  };

  const handleEndDateChange = (event: any, date?: Date) => {
    if (date && startDate && date < startDate ) {
      showErrorModal('La fecha de finalización no puede ser menor a la fecha de inicio.');
      setEndDate(startDate)
      setShowStartDatePicker(false);
      return;
    }
    if (date && date < new Date()) {
      showErrorModal('La fecha de fin no puede ser menor a la fecha actual.');
      setShowStartDatePicker(false);
      return;
    }
    if (Platform.OS === 'ios') {
      setEndDate(date || endDate);
    } else {
      if (date) {
        setEndDate(date);
      }
      setShowEndDatePicker(false);
    }
  };

  const confirmStartDate = () => {
    if (startDate) {
      setStartDate(startDate);
    }
    setShowStartDatePicker(false);
  };

  const confirmEndDate = () => {
    if (endDate) {
      setEndDate(endDate);
    }
    setShowEndDatePicker(false);
  };

  const adjustDateToUTC = (date: Date): Date => {
    const utcDate = new Date(date.getTime() + date.getTimezoneOffset() * 60000);
    return utcDate;
  };
  const showErrorModal = (message: string) => {
    setModalMessage(message);
    setModalVisible(true);
  };

  return (
    <ScrollView contentContainerStyle={styles.formContainer}>
      {isLoading&& <Loader/>}
      <Text style={styles.texttitle}>Título</Text>
      <TextInput
        style={styles.input}
        placeholder="* Título"
        value={title}
        onChangeText={(text) => {
          if (text.length <= 45) {
            setTitle(text);
          } else {
            showErrorModal('El título no puede superar los 45 caracteres.');
          }
        }}
      />
      <Text style={styles.texttitle}>Descripción</Text>
      <TextInput
        style={styles.descriptionInput}
        placeholder="Descripción"
        value={description}
        onChangeText={setDescription}
        multiline
      />
      <Text style={styles.texttitle}>% de descuento</Text>
      <TextInput
        style={styles.input}
        placeholder="* Porcentaje de descuento (0-99)"
        keyboardType="numeric"
        value={discountPercentage !== undefined ? discountPercentage?.toString() : ''}
        onChangeText={(text) => {
          const value = Number(text);
          if (value >= 0 && value <= 99) {
            setDiscountPercentage(value);
          } else {
            showErrorModal('El porcentaje debe estar entre 0 y 99.');
          }
        }}
      />

      <TextInput
        style={styles.input}
        placeholder="Cantidad disponible"
        keyboardType="numeric"
        value={availableQuantity !== undefined ? availableQuantity?.toString() : ''}
        onChangeText={(text) => {
          if (text === '') {
            setAvailableQuantity(null);
          } else {
            if (text.length > 8) {
              showErrorModal('La cantidad disponible no puede superar los 8 caracteres.');
            } else {
              const value = Number(text);
              if (value > 0) {
                setAvailableQuantity(value);
              } else {
                showErrorModal('La cantidad debe ser mayor a 0.');
              }
            }
          }
        }}
      />
      <TouchableOpacity
        style={styles.categoryButton}
        onPress={() => setCategoriesModalVisible(true)}
      >
        <MaterialIcons name="category" size={24} color="#fff" />
        <Text style={styles.submitButtonText}>Seleccionar Categorías</Text>
      </TouchableOpacity>
      <CategoryPicker
        // categories={allCategories}
        selectedCategories={selectedCategories}
        onSelectCategories={handleSelectCategories}
        isVisible={isCategoriesModalVisible}
        onClose={() => setCategoriesModalVisible(false)}
      />
      {/* Mostrar las imágenes existentes */}
      <MultiImageCompressor onImagesCompressed={handleImagesCompressed} initialImages={existingImages?.length}/>
      <Text style={styles.texttitle}>Imágenes actuales</Text>
      <View style={styles.imagesContainer}>
        {existingImages.length > 0 ? (
          existingImages.map((image: any, index: any) => (
            <View key={index} style={styles.imageWrapper}>
              <Image
                source={{ uri: `${API_URL}${image.image_path}` }}
                style={styles.image}
              />
              <TouchableOpacity
                style={styles.deleteButton}
                onPress={() => handleDeleteImage(image.image_id)}
              >
                <Ionicons name="trash-outline" size={22} color="#e04545" />
              </TouchableOpacity>
            </View>
          ))
        ) : (
          <Text>No hay imágenes existentes.</Text>
        )}
      </View>

      {/* Mostrar las fechas */}
      <View style={styles.datePickerContainer}>
        {!startDate ? <Text style={styles.textDateActual}>Fecha de inicio actual: {formatDateToDDMMYYYY(promotion.start_date)} </Text> : <Text></Text>}
        {startDate ? <Text style={styles.texttitle}>Inicia</Text> : <Text></Text>}
        {!showStartDatePicker && (
          <TouchableOpacity onPress={() => setShowStartDatePicker(true)} style={styles.inputdate}>
            <Text style={styles.textDate}>
              {startDate ? startDate.toLocaleDateString() : 'Modificar fecha de inicio'}
            </Text>
          </TouchableOpacity>
        )}
        {showStartDatePicker && (
          <View>
            <DateTimePicker
              value={startDate || new Date()}
              mode="date"
              display="default"
              onChange={handleStartDateChange}
              minimumDate={new Date()}
            />
            {Platform.OS === 'ios' && (
              <TouchableOpacity onPress={confirmStartDate} style={styles.submitButton}>
                <Text style={styles.submitButtonText}>Confirmar fecha</Text>
              </TouchableOpacity>
            )}
          </View>
        )}
      </View>

      <View style={styles.datePickerContainer}>
        {!endDate ? <Text style={styles.textDateActual}>Fecha de fin actual: {formatDateToDDMMYYYY(promotion.expiration_date)} </Text> : <Text></Text>}
        {endDate ? <Text style={styles.texttitle}>Finaliza</Text> : <Text></Text>}
        {!showEndDatePicker && (
          <TouchableOpacity onPress={() => setShowEndDatePicker(true)} style={styles.inputdate}>
            <Text style={styles.textDate}>
              {endDate ? endDate.toLocaleDateString() : 'Modificar fecha de Fin'}
            </Text>
          </TouchableOpacity>
        )}
        {showEndDatePicker && (
          <View>
            <DateTimePicker
              value={endDate || new Date()}
              mode="date"
              display="default"
              onChange={handleEndDateChange}
              minimumDate={startDate? startDate : new Date()}
            />
            {Platform.OS === 'ios' && (
              <TouchableOpacity onPress={confirmEndDate} style={styles.submitButton}>
                <Text style={styles.submitButtonText}>Confirmar fecha</Text>
              </TouchableOpacity>
            )}
          </View>
        )}
      </View>

      <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
        <Text style={styles.submitButtonText}>Guardar Cambios</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.cancelButton} onPress={onClose}>
        <Text style={styles.submitButtonText}>Cancelar</Text>
      </TouchableOpacity>
      <ErrorModal
        visible={modalVisible}
        message={modalMessage}
        onClose={() => setModalVisible(false)}
      />
      <ExitoModal
        visible={modalSuccessVisible}
        message={modalSuccessMessage}
        onClose={() => {
          setModalSuccessVisible(false);
          onClose();
        }}
        />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  formContainer: {
    padding: 20,
    backgroundColor: '#fff',
  },
  input: {
    height: 40,
    borderColor: '#ddd',
    borderWidth: 1,
    marginBottom: 10,
    paddingHorizontal: 10,
  },
  descriptionInput: {
    height: 100,
    borderColor: '#ddd',
    borderWidth: 1,
    marginBottom: 10,
    padding: 10,
    textAlignVertical: 'top',
  },
  categoryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-evenly',
    backgroundColor: '#00abc1',
    padding: 10,
    borderRadius: 25,
    marginTop:10,
    marginBottom: 5,
    width: '80%',
    alignSelf: 'center',

  },
  submitButton: {
    backgroundColor: 'rgb(0, 122, 140)',
    padding: 10,
    borderRadius: 5,
    marginVertical: 10,
  },
  submitButtonText: {
    color: '#fff',
    textAlign: 'center',
    fontWeight: 'bold',
  },
  inputdate: {
    height: 40,
    borderColor: '#ddd',
    borderWidth: 1,
    marginBottom: 10,
    paddingHorizontal: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  textDate: {
    color: 'rgb(0, 122, 140)',
  },
  textDateActual: {
    color: 'rgb(0, 122, 140)'
  },
  datePickerContainer: {
    marginBottom: 10,
  },
  imagesContainer: {
    marginBottom: 10,
    marginTop: 10,
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  imageWrapper: {

    width: '45%',
    marginRight: 10,
    marginBottom: 10,
    position: 'relative',
  },
  image: {
    width: 100,
    height: 100,
    borderRadius: 5,
  },
  deleteButton: {
    position: 'absolute',
    top: 0,
    right: 0,
    backgroundColor: 'rgba(255,255,255,0.7)',
    borderRadius: 50,
    padding: 2,
  },
  cancelButton: {
    backgroundColor: '#8e8e8e',
    padding: 10,
    borderRadius: 5,
  },
  texttitle: {
    fontSize: 14,
    color: '#707070'
  }
});

export default EditPromotionForm;
