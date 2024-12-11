import { Dispatch } from '@reduxjs/toolkit';
import axios from 'axios';
import { AppDispatch } from '../store/store';
import { Country, Role } from '../types/types';
import { setCountries, setStates, setRoles, setLoading, setError, State } from '../reducers/redux/globalReducer';

const API_URL = process.env.EXPO_PUBLIC_API_URL;

export const fetchCountries = () => {
    return async (dispatch: AppDispatch) => {
        dispatch(setLoading(true));
        try {
            const response = await axios.get<Country[]>(`${API_URL}/countries`);
            dispatch(setCountries(response.data));
        } catch (error) {
            console.error('Error fetching countries:', error);
            dispatch(setError('Error fetching countries'));
        } finally {
            dispatch(setLoading(false));
        }
    };
};

export const fetchStates = () => {
    return async (dispatch: AppDispatch) => {
        dispatch(setLoading(true));
        try {
            const response = await axios.get<State[]>(`${API_URL}/statuses`);
            dispatch(setStates(response.data));
        } catch (error) {
            console.error('Error fetching states:', error);
            dispatch(setError('Error fetching states'));
        } finally {
            dispatch(setLoading(false));
        }
    };
};

export const fetchRoles = () => {
    return async (dispatch: AppDispatch) => {
        dispatch(setLoading(true));
        try {
            const response = await axios.get<Role[]>(`${API_URL}/roles`);
            dispatch(setRoles(response.data));
        } catch (error) {
            console.error('Error fetching roles:', error);
            dispatch(setError('Error fetching roles'));
        } finally {
            dispatch(setLoading(false));
        }
    };
};

export const loadData = () => {
    return async (dispatch: AppDispatch) => {
        dispatch(setLoading(true));
        try {
            await Promise.all([
                dispatch(fetchCountries()),
                dispatch(fetchStates()),
                dispatch(fetchRoles())
            ]);
        } catch (error) {
            console.error('Error loading data:', error);
            dispatch(setError('Error loading data'));
        } finally {
            dispatch(setLoading(false));
        }
    };
};