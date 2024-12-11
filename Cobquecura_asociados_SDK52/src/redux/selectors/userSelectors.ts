import { createSelector } from 'reselect';
import { RootState } from '../store/store';
import { Promotion, UserData } from '../types/types';

// Selectores básicos para obtener los datos del usuario y el token de acceso del estado
const getUserData = (state: RootState) => state.user.userData;
const getAccessToken = (state: RootState) => state.user.accessToken;
const getFavorites = (state: RootState) => state.user.favorites;
const getPartner = (state: RootState) => state.user.partner;
// Selectores memoizados que evitan devolver nuevas referencias innecesarias
export const getMemoizedUserData = createSelector(
  [getUserData],
  (userData: UserData | null) => userData ? { ...userData } : null
);

export const getMemoizedAccessToken = createSelector(
  [getAccessToken],
  (accessToken: string | null) => accessToken || ''
);

export const getMemoizedFavorites = createSelector(
  [getFavorites],
  (favorites: number[]) => favorites.slice()
);

export const getMemoizedPartner = createSelector(
  [getPartner],
  (partner) => partner ? { ...partner } : null
);