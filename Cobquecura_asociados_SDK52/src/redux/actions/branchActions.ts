import { Dispatch } from 'redux';
import { setBranches, clearBranches, fetchBranchRatingsRequest, fetchBranchRatingsSuccess, fetchBranchRatingsFailure, addBranchRating, editBranchRating, deleteBranchRating, clearBranchRatings, addBranchRequest, addBranchSuccess, addBranchFailure, updateBranchSuccess, updateBranchFailure, updateBranchRequest } from '../reducers/branchReducer';
import { RootState } from '../store/store';
import axios from 'axios';
import { Branch, Rating, RatingBranch } from '../types/types';
import { BranchCreate } from '../../components/BranchForm';


const API_URL = process.env.EXPO_PUBLIC_API_URL;

export const fetchBranches = (partnerId: number) => {
  return async (dispatch: Dispatch, getState: () => RootState) => {
    try {
      const state = getState();
      const token = state.user.accessToken;
      
      if (!token) {
        throw new Error('User not authenticated');
      }
      const response = await axios.get<Branch[]>(`${API_URL}/partners/${partnerId}/branches`, {
        headers: {
          Authorization: `Bearer ${token}`,
        }
      });
      const activeBranches = response.data.filter(branch => branch.status.name !== "deleted");
      console.log("sucursales activas", activeBranches);
      
      dispatch(setBranches(activeBranches));
    } catch (error) {
      console.error('Error fetching branches:', error);
      throw error; 
    }
  };
};
export const addBranch = (branchData: any) => {
  return async (dispatch: Dispatch, getState: () => RootState) => {
    dispatch(addBranchRequest());
    try {
      const state = getState();
      const token = state.user.accessToken;

      if (!token) {
        throw new Error('User not authenticated');
      }

      const response = await axios.post<any>(`${API_URL}/branches`, branchData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      // console.log("respuesta en la action",response);
      
      dispatch(addBranchSuccess(response.data));
    } catch (error: any) {
      dispatch(addBranchFailure(error.toString()));
    }
  };
};
export const updateBranch = (branchId: number, branchData: BranchCreate) => {
  return async (dispatch: Dispatch, getState: () => RootState) => {
    dispatch(updateBranchRequest());
    try {
      const state = getState();
      const token = state.user.accessToken;

      if (!token) {
        throw new Error('User not authenticated');
      }

      const response = await axios.put(`${API_URL}/branches/${branchId}`, branchData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      console.log('Respuesta de actualización de sucursal:', response);
      dispatch(updateBranchSuccess(response.data));
    } catch (error: any) {
      console.error('Error al actualizar la sucursal:', error);
      dispatch(updateBranchFailure(error.toString()));
    }
  };
};

export const clearAllBranches = () => {
  return (dispatch: Dispatch) => {
    dispatch(clearBranches());
  };
};

// Acción para hacer un borrado lógico de la sucursal
export const deleteBranch = (branchId: number, statusId: number | undefined, promotionsIds: number[]) => {
  return async (dispatch: Dispatch, getState: () => RootState) => {
    try {
      const state = getState();
      const token = state.user.accessToken;

      if (!token) {
        throw new Error('User not authenticated');
      }

      // Primero, actualizamos el estado de la sucursal
      const branchResponse = await axios.put(`${API_URL}/branches/${branchId}`, {
        status_id: statusId,
      }, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      // Ahora, si se proporcionan promociones, actualizamos el estado de esas promociones
      if (promotionsIds.length > 0) {
       const branchResponse = await axios.put(`${API_URL}/promotions/bulk_delete`,{promotion_ids:promotionsIds, status_id:statusId})
       console.log(branchResponse);
       
      }
      return branchResponse
    } catch (error) {
      console.error('Error al actualizar el estado de la sucursal y promociones:', error);
      throw error; 
    }
  };
};

export const inactivateBranch = (branchId: number, statusId: number | undefined) => {
  return async (dispatch: Dispatch, getState: () => RootState) => {
    try {
      const state = getState();
      const token = state.user.accessToken;

      if (!token) {
        throw new Error('User not authenticated');
      }

      // Primero, actualizamos el estado de la sucursal
      const branchResponse = await axios.put(`${API_URL}/branches/${branchId}`, {
        status_id: statusId,
      }, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      console.log('Sucursal marcada como inactiva:', branchResponse.data);
      dispatch(updateBranchSuccess(branchResponse.data));
    } catch (error) {
      console.error('Error al actualizar el estado de la sucursal y promociones:', error);
      throw error; 
    }
  };
};
export const fetchBranchRatings = (branchId: number) => {
  return async (dispatch: Dispatch, getState: () => RootState) => {
    dispatch(fetchBranchRatingsRequest());
    try {
      const response = await axios.get<{ ratings: RatingBranch[], average_rating: number }>(`${API_URL}/branches/${branchId}/ratings/all`);
      dispatch(fetchBranchRatingsSuccess(response.data));
    } catch (error:any) {
      dispatch(fetchBranchRatingsFailure(error.toString()));
    }
  };
};

export const addRating = (branchId: number, rating: RatingBranch) => {
  return async (dispatch: Dispatch, getState: () => RootState) => {
    try {
      const response = await axios.post<RatingBranch>(`${API_URL}/branches/${branchId}/ratings`, rating);
      dispatch(addBranchRating(response.data));
    } catch (error) {
      throw error;
    }
  };
};

export const editRating = (branchId: number, rating: RatingBranch) => {
  return async (dispatch: Dispatch, getState: () => RootState) => {
    try {
      const response = await axios.put<RatingBranch>(`${API_URL}/branches/ratings/${branchId}`, rating);
      dispatch(editBranchRating(response.data));
    } catch (error) {
      throw error;
    }
  };
};

export const deleteRating = (branchId: number, ratingId: number) => {
  return async (dispatch: Dispatch, getState: () => RootState) => {
    try {
      await axios.delete(`${API_URL}/branches/ratings/${branchId}`, { data: { id: ratingId } });
      dispatch(deleteBranchRating(ratingId));
    } catch (error) {
      throw error;
    }
  };
};
export const clearBranchRatingsAction = () => {
  return (dispatch: Dispatch, getState: () => RootState) => {
    dispatch(clearBranchRatings());
  };
};