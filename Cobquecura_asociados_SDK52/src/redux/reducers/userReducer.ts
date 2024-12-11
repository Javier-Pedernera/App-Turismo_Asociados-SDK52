import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { PartnerData, Promotion, UserData } from '../types/types';
import { UserStorageData } from '../../utils/storage';

export interface UserState {
  userData: UserData | null;
  accessToken: string | null;
  favorites: number[];
  partner: PartnerData | null;
}

const initialState: UserState = {
  userData: null,
  accessToken: null,
  favorites: [],
  partner: null,
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    loginUser: (state, action: PayloadAction<{ token: string; user: UserData }>) => {
      const { token, user } = action.payload;
      return {
        ...state,
        userData: user,
        accessToken: token,
      };
    },
    logOut: (state) => {
      state.userData = null;
      state.accessToken = null;
    },
    setUser: (state, action: PayloadAction<any>) => {
      return {
      ...state,
      userData: action.payload
      }
    },
    setPartner: (state, action: PayloadAction<PartnerData>) => {
      return {
        ...state,
        partner: action.payload,
      };
    },
    setFavorites: (state, action: PayloadAction<number[]>) => {
      state.favorites = action.payload;
    },
    addFavorite: (state, action: PayloadAction<number>) => {
      state.favorites.push(action.payload);
    },
    removeFavorite: (state, action: PayloadAction<number>) => {
      state.favorites = state.favorites.filter(id => id !== action.payload);
    },
  },
});

export const { loginUser, logOut, setUser,setFavorites ,addFavorite, removeFavorite, setPartner } = userSlice.actions;
export default userSlice.reducer;