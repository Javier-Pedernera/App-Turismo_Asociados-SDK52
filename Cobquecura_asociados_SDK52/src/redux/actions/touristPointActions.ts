import { Dispatch } from '@reduxjs/toolkit';
import axios from 'axios';
import { AppDispatch, RootState } from '../store/store';
import { TouristPoint, Rating, NewRating } from '../types/types';
import { setRatings, setRatingsError, setTouristPoints, setTouristPointsError, addRating, updateRating, deleteRating } from '../reducers/touristPointReducer';

const API_URL = process.env.EXPO_PUBLIC_API_URL;

const getErrorMessage = (error: unknown): string => {
  if (axios.isAxiosError(error)) {
    return error.response?.data?.message || error.message;
  }
  return String(error);
};

export const fetchTouristPoints = () => {
  return async (dispatch: AppDispatch) => {
    try {
      const response = await axios.get<TouristPoint[]>(`${API_URL}/tourist_points`);
      // console.log("respuesta de puntos turisticos",response);
      
      dispatch(setTouristPoints(response.data));
    } catch (error) {
      dispatch(setTouristPointsError(getErrorMessage(error)));
    }
  };
};

export const fetchRatings = (touristPointId: number) => {
  return async (dispatch: AppDispatch) => {
    try {
      const response = await axios.get<Rating[]>(`${API_URL}/tourist_points/${touristPointId}/ratings`);
      // console.log("respuesta de ratings",response.data);
      
      dispatch(setRatings(response.data));
    } catch (error) {
      dispatch(setRatingsError(getErrorMessage(error)));
    }
  };
};

export const addNewRating = (rating: NewRating, tourist_point_id:any) => {
  return async (dispatch: AppDispatch) => {
    try {
      const response = await axios.post(`${API_URL}/tourist_points/${tourist_point_id}/ratings`, rating);
      // console.log(response);
      
      dispatch(addRating(response.data));
    } catch (error) {
      dispatch(setRatingsError(getErrorMessage(error)));
    }
  };
};

export const updateExistingRating = (rating: Rating) => {
  return async (dispatch: AppDispatch) => {
    try {
      const response = await axios.put<Rating>(`${API_URL}/ratings/${rating.id}`, rating);
      dispatch(updateRating(response.data));
    } catch (error) {
      dispatch(setRatingsError(getErrorMessage(error)));
    }
  };
};

export const deleteExistingRating = (ratingId: number) => {
  return async (dispatch: AppDispatch) => {
    try {
      await axios.delete(`${API_URL}/ratings/${ratingId}`);
      dispatch(deleteRating(ratingId));
    } catch (error) {
      dispatch(setRatingsError(getErrorMessage(error)));
    }
  };
};
