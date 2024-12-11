import axios from "axios";
import { LoginResponse, UserData } from "../redux/types/types";
import { clearUserData } from "../utils/storage";
import { logOut } from "../redux/reducers/userReducer";
import { Dispatch } from "@reduxjs/toolkit";

const API_URL = process.env.EXPO_PUBLIC_API_URL;

  
export const loginUserAuth = async (email: string, password: string): Promise<LoginResponse> => {
  try {
    const response = await axios.post<LoginResponse>(`${API_URL}/login`, { email, password });
    // Guardar el token en AsyncStorage
    // if (response.data.token) {
    //   await AsyncStorage.setItem('token', response.data.token);
    // }
    return response.data;
  } catch (error: any) {
    if (error.response && error.response.data) {
      const backendMessage = error.response.data.message || 'Error desconocido del servidor';
      throw new Error(backendMessage);
    } else if (error.request) {
      throw new Error('No se recibió respuesta del servidor');
    } else {
      throw new Error(error.message); 
    }
  }
};
  
export const logoutUser = () => {
  return async (dispatch: Dispatch) => {
    try {
      await clearUserData();
      dispatch(logOut());
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };
};

export const sendPasswordResetEmail = async (email: string) => {
  try {
    // console.log("envio email para recuperar contraseña");
    
    const response = await axios.post(`${API_URL}/reset_password`, { email });
    // console.log(response.data);
    return response.data;
  } catch (error) {
    throw new Error('Error al enviar el correo de recuperación.');
  }
};

// Función para restablecer la contraseña
export const resetPassword = async (token: string, newPassword: string) => {
  console.log("envio contraseña para cambiar");

  // const response = await axios.post(`${API_URL}/auth/reset-password/${token}`, { password: newPassword });
  // return response.data;
};

