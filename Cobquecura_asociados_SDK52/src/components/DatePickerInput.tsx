import React, { useState } from 'react';
import { TouchableOpacity, Text, Modal, View, Platform, StyleSheet, Dimensions } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';

interface DatePickerInputProps {
  selectedDate: Date | null;
  onDateChange: (field: string, value: string) => void;
}
const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

const DatePickerInput: React.FC<DatePickerInputProps> = ({ selectedDate, onDateChange }) => {
  const [showDatePicker, setShowDatePicker] = useState(false);

  const formatDateToYYYYMMDD = (dateString: string): string => {
    const [day, month, year] = dateString.split('-');
    return `${year}-${month}-${day}`;
  };

  const handleDateChange = (event: any, selectedDate?: Date) => {
    if (Platform.OS !== 'ios') {
      setShowDatePicker(false);
    }
    if (selectedDate) {
  
      const formattedDate = formatDateToYYYYMMDD(
        `${selectedDate.getDate()}-${selectedDate.getMonth() + 1}-${selectedDate.getFullYear()}`
      );
      onDateChange('birth_date', formattedDate);
    }
  };

  const confirmDate = () => {
    if (selectedDate) {
      const formattedDate = formatDateToYYYYMMDD(
        `${selectedDate.getDate()}-${selectedDate.getMonth() + 1}-${selectedDate.getFullYear()}`
      );
      onDateChange('birth_date', formattedDate);
    }
    setShowDatePicker(false);
  };

  return (
    <>
      <TouchableOpacity onPress={() => setShowDatePicker(true)} style={styles.inputdate}>
        <Text style={styles.textDate}>
          {selectedDate ? selectedDate.toLocaleDateString() : 'Fecha de Nacimiento (DD-MM-YYYY)'}
        </Text>
      </TouchableOpacity>

      {/* Modal para iOS y Android */}
      {showDatePicker && (
        <Modal
          transparent
          animationType="slide"
          visible={showDatePicker}
          onRequestClose={() => setShowDatePicker(false)}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.datePickerContainer}>
              <DateTimePicker
                value={selectedDate || new Date()}
                mode="date"
                display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                maximumDate={new Date()}
                onChange={handleDateChange}
              />
              {Platform.OS === 'ios' && (
                <TouchableOpacity onPress={confirmDate} style={styles.confirmButton}>
                  <Text style={styles.confirmButtonText}>Confirmar fecha</Text>
                </TouchableOpacity>
              )}
            </View>
          </View>
        </Modal>
      )}
    </>
  );
};

const styles = StyleSheet.create({
  inputdate: {
    display: 'flex',
    justifyContent: 'center',
    alignContent: 'flex-start',
    alignItems:'flex-start',
    height: 48,
    width: screenWidth*0.8,
    borderColor: 'rgb(172, 208, 213)',
    borderWidth: 1,
    borderRadius: 8,
    marginBottom: 10,
    paddingHorizontal: 15,
    backgroundColor: '#fff',
    fontSize: 16,
  },
  textDate: {
    textAlign: 'center',
    fontSize: 16,
    color: '#333',
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  datePickerContainer: {
    width: '90%',
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 20,
    alignItems: 'center',
  },
  confirmButton: {
    minHeight: 48,
    justifyContent: 'center',
    backgroundColor: '#007a8c',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 25,
    alignItems: 'center',
    marginBottom: 10,
    width: '50%',
    alignSelf: 'center',
  },
  confirmButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default DatePickerInput;
