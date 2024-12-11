import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, Modal, ScrollView, StyleSheet } from 'react-native';
import Checkbox from 'expo-checkbox'; // Asegúrate de que expo-checkbox esté instalado
import { getMemoizedAllCategories } from '../redux/selectors/categorySelectors';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch } from '../redux/store/store';
import { fetchAllCategories } from '../redux/actions/categoryActions';

interface Category {
  category_id: number;
  name: string;
}

interface CategoryPickerProps {
  
  selectedCategories: number[];
  onSelectCategories: (selected: number[]) => void;
  isVisible: boolean;
  onClose: () => void;
}

const CategoryPicker: React.FC<CategoryPickerProps> = ({ selectedCategories, onSelectCategories, isVisible, onClose }) => {
  const dispatch: AppDispatch = useDispatch();
  const [localSelectedCategories, setLocalSelectedCategories] = useState<number[]>(selectedCategories);
  const categories = useSelector(getMemoizedAllCategories);
// console.log("categorías en el picker",categories);

useEffect(() => {
  if(!categories.length ){
   dispatch(fetchAllCategories());
  }
}, []);

  useEffect(() => {
    setLocalSelectedCategories(selectedCategories);
  }, [selectedCategories]);

  const handleCategoryChange = (categoryId: number) => {
    setLocalSelectedCategories(prevSelected =>
      prevSelected.includes(categoryId)
        ? prevSelected.filter(id => id !== categoryId)
        : [...prevSelected, categoryId]
    );
  };

  const handleSave = () => {
    onSelectCategories(localSelectedCategories);
    onClose();
  };

  return (
    <Modal visible={isVisible} animationType="slide" transparent>
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <Text style={styles.modalTitle}>Seleccionar Categorías</Text>
          <ScrollView>
            {categories?.map(category => (
              <View key={category.category_id} style={styles.checkboxContainer}>
                <Checkbox
                  value={localSelectedCategories.includes(category.category_id)}
                  onValueChange={() => handleCategoryChange(category.category_id)}
                />
                <Text style={styles.label}>{category.name}</Text>
              </View>
            ))}
          </ScrollView>
          <TouchableOpacity onPress={handleSave} style={styles.modalButton}>
            <Text style={styles.modalButtonText}>Guardar</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={onClose} style={styles.modalButtonCancel}>
            <Text style={styles.modalButtonText}>Cancelar</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)'
  },
  modalContent: {
    height:"95%",
    width: '80%',
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 20,
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 3,
  },
  label: {
    marginLeft: 10,
    fontSize: 14,
  },
  modalButton: {
    backgroundColor: 'rgb(0, 122, 140)',
    padding: 10,
    borderRadius: 25,
    marginVertical: 10,
    width: '100%',
    alignItems: 'center',
  },
  //   naranja: #F1AD3E
  //         mostaza: #d59831
  //         azul: rgb(0, 122, 140)
  //         celeste: #64C9ED
  modalButtonCancel: {
    backgroundColor: '#F1AD3E',
    padding: 10,
    borderRadius: 25,
    width: '100%',
    alignItems: 'center',
  },
  modalButtonText: {
    color: 'white',
    fontSize: 16,
  },
});

export default CategoryPicker;
