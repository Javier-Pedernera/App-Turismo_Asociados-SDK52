import { createSelector } from 'reselect';
import { RootState } from '../store/store';
import { Promotion, PromotionConsumed } from '../types/types';

const getPromotions = (state: RootState) => state.promotions.promotions;
const getConsumedPromotions = (state: RootState) => state.promotions.consumedPromotions;

export const getMemoizedPromotions = createSelector(
  [getPromotions],
  (promotions: Promotion[]) => {
    return promotions.map(promotion => ({ ...promotion }));
  }
);

export const getMemoizedConsumedPromotions = createSelector(
  [getConsumedPromotions], (consumedPromotions: PromotionConsumed[]) => {
    return consumedPromotions.map(consumedPromotion => ({ ...consumedPromotion }));
  }
);