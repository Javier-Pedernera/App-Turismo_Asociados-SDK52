import { Dispatch } from 'redux';
import { PartnerData, Promotion, UpdatePartnerPayload, UserActionTypes, UserData } from '../types/types'; 
import {  addFavorite, loginUser, logOut, removeFavorite, setFavorites, setPartner, setUser } from '../reducers/userReducer';
import { loginUserAuth } from '../../services/authService';
import { RootState } from '../store/store';
import axios from 'axios';


const API_URL = process.env.EXPO_PUBLIC_API_URL;
// Acción asíncrona para realizar el login
export const userLogIn = (email: string, password: string) => {
  return async (dispatch: Dispatch) => {
    try {
      const data = await loginUserAuth(email, password);
      // console.log("data en la action de login", data);
      
      // Verificar si data.user y data.user.status existen
      if (!data.user || !data.user.status) {
        throw new Error('Error en la respuesta del servidor. No se pudo obtener el estado del usuario.');
      }

      // Validación del estado del usuario
      if (data.user.status.name !== 'active') {
        throw new Error('Tu cuenta está inactiva. Contacta al soporte para más información.');
      }

      // Validación del rol del usuario
      const hasAssociatedRole = data.user.roles?.some((role: { role_name: string }) => role.role_name === 'associated');
      if (!hasAssociatedRole) {
        throw new Error('Solo se permite el ingreso a los asociados.');
      }

      // Si pasa todas las validaciones, guardar los datos en el estado global
      dispatch(loginUser(data));
      return data;
    } catch (error) {
      throw error;
    }
  };
};

export const getUserInfo = (token:string) => {
  return async (dispatch: Dispatch) => {
    try {
      const response = await axios.get(`${API_URL}/user`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      // console.log(response.data);
      
      dispatch(setUser(response.data));
    } catch (error:any) {
      console.error("Error en get User Info:", error.message);
      throw error;
    }
  };
};
export const logOutUser = () => {
  return (dispatch: Dispatch) => {
    dispatch(logOut());
  };
};

export const updateUserAction = (updatedUserData: UserData) => {
  return async (dispatch: Dispatch, getState: () => RootState) => {
    try {
      const state = getState();
      const token = state.user.accessToken;
      // console.log("token",token);
      if (!token) {
        throw new Error('User not authenticated');
      }
      const { user_id, ...updatedDataToSend } = updatedUserData;

      const response = await axios.put(`${API_URL}/user/${user_id}`, updatedDataToSend, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      // console.log("respuesta del backend",response.status);
      dispatch(setUser(response.data));
      return response;
    } catch (error) {
      throw error;
    }
  };
};
export const changePasswordAction = (userId: number, newPassword: string, currentPassword: string) => {
  return async (dispatch: Dispatch, getState: () => RootState) => {
    try {
      const state = getState();
      const token = state.user.accessToken;
      const data = {password: newPassword, current_password: currentPassword}
      //  console.log("token", token);
      if (!token) {
        throw new Error('User not authenticated');
      }
      const response = await axios.put(`${API_URL}/user/${userId}`, 
        data, 
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return response;
    } catch (error) {
      throw error;
    }
  };
};

export const fetchUserFavorites = () => {
  return async (dispatch: Dispatch, getState: () => RootState) => {
    try {
      const state = getState();
      const token = state.user.accessToken;
      const userId = state.user.userData?.user_id;

      if (!token || !userId) {
        throw new Error('User not authenticated');
      }
      const response = await axios.get(`${API_URL}/users/${userId}/favorites`);
      // console.log(response);
      
      const favorites = response.data.map((fav: { promotion_id: number }) => fav.promotion_id);
      dispatch(setFavorites(favorites));
    } catch (error) {
      throw error;
    }
  };
};

export const addFavoriteAction = (promotion: Promotion) => {
  return async (dispatch: Dispatch, getState: () => RootState) => {
    try {
      const state = getState();
      const token = state.user.accessToken;
      const userId = state.user.userData?.user_id;
      
      

      if (!token || !userId) {
        throw new Error('User not authenticated');
      }
      // console.log("al agregar a favorito", userId, promotion);
      await axios.post(
        `${API_URL}/favorites`,
        { user_id: userId, promotion_id: promotion.promotion_id },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      dispatch(addFavorite(promotion.promotion_id));
    } catch (error) {
      throw error;
    }
  };
};

export const removeFavoriteAction = (promotionId: number) => {
  return async (dispatch: Dispatch, getState: () => RootState) => {
    try {
      const state = getState();
      const token = state.user.accessToken;
      const userId = state.user.userData?.user_id;

      if (!token || !userId) {
        throw new Error('User not authenticated');
      }
      await axios.delete(`${API_URL}/favorites`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        data: {
          user_id: userId,
          promotion_id: promotionId,
        },
      });
      dispatch(removeFavorite(promotionId));
    } catch (error) {
      throw error;
    }
  };
};

export const fetchPartnerById = (partnerId: number) => {
  return async (dispatch: Dispatch, getState: () => RootState) => {
    try {
      const state = getState();
      const token = state.user.accessToken;

      if (!token) {
        throw new Error('User not authenticated');
      }

      const response = await axios.get(`${API_URL}/partners/${partnerId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      dispatch(setPartner(response.data));
    } catch (error) {
      console.error('Error fetching partner:', error);
      throw error;
    }
  };
};

export const updatePartner = (user_id: number, partnerData: UpdatePartnerPayload) => {
  return async (dispatch: Dispatch, getState: () => RootState) => {
    try {
      const state = getState();
      const token = state.user.accessToken;

      if (!token) {
        throw new Error('User not authenticated');
      }
      const response = await axios.put(`${API_URL}/partners/${user_id}`, partnerData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      dispatch(setPartner(response.data));
      return response    
    } catch (error) {
      console.error('Error updating partner:', error);
      throw error;
    }
  };
};