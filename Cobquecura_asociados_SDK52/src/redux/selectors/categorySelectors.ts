import { createSelector } from 'reselect';
import { RootState } from '../store/store';
import { Category, UserCategory } from '../types/types';

const getAllCategories = (state: RootState) => state.categories.allCategories;
const getUserCategories = (state: RootState) => state.categories.userCategories;

export const getMemoizedAllCategories = createSelector(
  [getAllCategories],
  (allCategories: Category[]) => [...allCategories]
);

export const getMemoizedUserCategories = createSelector(
  [getUserCategories],
  (userCategories: UserCategory[]) => [...userCategories] 
);