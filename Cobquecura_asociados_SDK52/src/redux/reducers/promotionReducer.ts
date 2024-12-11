import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Promotion, PromotionConsumed } from '../types/types';

interface PromotionState {
  promotions: Promotion[];
  consumedPromotions: PromotionConsumed[];
  error: string | null;
}

const initialState: PromotionState = {
  promotions: [],
  consumedPromotions: [],
  error: null,
};

const promotionSlice = createSlice({
  name: 'promotions',
  initialState,
  reducers: {
    setPromotions: (state, action: PayloadAction<Promotion[]>) => {
      state.promotions = action.payload;
      state.error = null;
    },
    addPromotion: (state, action: PayloadAction<Promotion>) => {
      state.promotions.push(action.payload);
    },
    updatePromotion: (state, action: PayloadAction<Promotion>) => {
      const index = state.promotions.findIndex(promo => promo.promotion_id === action.payload.promotion_id);
      if (index !== -1) {
        state.promotions[index] = action.payload;
      }
    },
    deletePromotion: (state, action: PayloadAction<number>) => {
      state.promotions = state.promotions.filter(promo => promo.promotion_id !== action.payload);
    },
    setPromotionsError: (state, action: PayloadAction<string>) => {
      state.error = action.payload;
    },
    setConsumedPromotions: (state, action: PayloadAction<PromotionConsumed[]>) => {
      state.consumedPromotions = action.payload;
      state.error = null;
    },
    updateConsumedPromotion: (state, action: PayloadAction<PromotionConsumed>) => {
      const index = state.consumedPromotions.findIndex(promo => promo.id === action.payload.id);
      if (index !== -1) {
        state.consumedPromotions[index] = action.payload;
      }
    },
  },
});

export const { setPromotions, addPromotion, updatePromotion, deletePromotion, setPromotionsError, setConsumedPromotions, updateConsumedPromotion } = promotionSlice.actions;
export default promotionSlice.reducer;


