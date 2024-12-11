import { Dispatch } from '@reduxjs/toolkit';
import axios from 'axios';
import { RootState, AppDispatch } from '../store/store'; // Importar AppDispatch
import { Category } from '../types/types';
import { setAllCategories, setUserCategories } from '../reducers/categoryReducer';

// const API_URL = 'https://app-turismo-backend.vercel.app';
// const API_URL = 'http://192.168.100.4:5000';
const API_URL = process.env.EXPO_PUBLIC_API_URL;
export const fetchAllCategories = () => {
  return async (dispatch: AppDispatch) => {
    try {
      const response = await axios.get<Category[]>(`${API_URL}/categories`);
      // console.log("respuesta de categorias", response.data);
      
      dispatch(setAllCategories(response.data));
    } catch (error) {
      throw error;
    }
  };
};

export const fetchUserCategories = (userId: number) => {
  return async (dispatch: AppDispatch, getState: () => RootState) => { 
    try {
      const state = getState();
      const token = state.user.accessToken;

      if (!token) {
        throw new Error('User not authenticated');
      }

      const response = await axios.get(`${API_URL}/partners/${userId}`);
      // console.log("response categorias usuario",response.data);

      
      dispatch(setUserCategories(response.data.categories));
    } catch (error) {
      throw error;
    }
  };
};
