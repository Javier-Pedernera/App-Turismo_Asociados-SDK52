import React from 'react';
import { View, StyleSheet } from 'react-native';
import RNPickerSelect from 'react-native-picker-select';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../redux/store/store';
import { getMemoizedCountries } from '../redux/selectors/globalSelectors';

interface CountryPickerProps {
  selectedCountry: string;
  onCountryChange: (value: string) => void;
  estilo: boolean;
}

const CountryPicker: React.FC<CountryPickerProps> = ({ selectedCountry, onCountryChange, estilo }) => {
  const dispatch = useDispatch<AppDispatch>();
  const countries = useSelector((state: RootState) => getMemoizedCountries(state));

  // Transform countries to the format RNPickerSelect expects
  const countryItems = countries.map((country: any) => ({
    label: country.name,
    value: country.name,
  }));

  return (
    <View style={[styles.container, estilo && styles.pickerWrapper]}>
      <RNPickerSelect
        onValueChange={(value) => onCountryChange(value)}
        value={selectedCountry}
        items={countryItems}
        placeholder={{ label: '* Seleccione un país', value: '' }}
        style={pickerSelectStyles}
        useNativeAndroidPickerStyle={false}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    // marginBottom: 5,
  },
  pickerWrapper: {
    height:48,    
    justifyContent: 'center',
    borderColor: '#ddd',
    borderWidth: 1,
    borderRadius: 8,
    backgroundColor: '#fff',
    paddingHorizontal: 10,
    paddingVertical: 12,
  },
});

const pickerSelectStyles = StyleSheet.create({
  inputIOS: {
    fontSize: 16,
    paddingVertical: 8,
    paddingHorizontal: 10,
    color: '#333',
    paddingRight: 30,
    borderWidth: 1,
    borderColor: 'rgb(172, 208, 213)',
    borderRadius: 8,
    height:48,
    alignItems:'center',
    justifyContent:'center'
  },
  inputAndroid: {
    fontSize: 16,
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: 'rgb(172, 208, 213)',
    borderRadius: 8,
    color: '#333',
    paddingRight: 30,
    backgroundColor: '#fff',
    height:48,
    alignItems:'center',
    justifyContent:'center'
  },
});

export default CountryPicker;
