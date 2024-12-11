import axios from 'axios';
import { setUserCategories } from '../redux/reducers/categoryReducer';

// const API_URL = 'https://app-turismo-backend.vercel.app';
// const API_URL = 'http://192.168.100.4:5000';
const API_URL = process.env.EXPO_PUBLIC_API_URL;

export const createTourist = async (touristData: {
  user_id: number;
  origin: string | null;
  birthday: string | null;
  gender: string | null;
  category_ids: number[];
}) => {
  try {
    const response = await axios.post(`${API_URL}/tourists`, touristData);
    // console.log("respuesta de turista", response);
    
    return response;
  } catch (error) {
    throw new Error('Creation of tourist profile failed');
  }
};
export const updateTourist = async (user_id: number, touristData: {
  origin: string | null;
  birthday: string | null;
  gender: string | null;
  category_ids: number[];
}) => {
  try {
    const response = await axios.put(`${API_URL}/tourists/${user_id}`, touristData);
    // console.log("Respuesta de actualización de turista", response);
    return response;
  } catch (error) {
    throw new Error('Actualización del perfil de turista fallida');
  }
};
