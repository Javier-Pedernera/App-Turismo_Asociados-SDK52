import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Category, UserCategory } from '../types/types';

interface CategoriesState {
  allCategories: Category[];
  userCategories: UserCategory[];
}

const initialState: CategoriesState = {
  allCategories: [],
  userCategories: [],
};

const categoriesSlice = createSlice({
  name: 'categories',
  initialState,
  reducers: {
    setAllCategories: (state, action: PayloadAction<Category[]>) => {
      return {
        ...state,
        allCategories: action.payload,
      };
    },
    setUserCategories: (state, action: PayloadAction<UserCategory[]>) => {
      return {
        ...state,
        userCategories: action.payload,
      };
    },
  },
});

export const { setAllCategories, setUserCategories } = categoriesSlice.actions;
export default categoriesSlice.reducer;