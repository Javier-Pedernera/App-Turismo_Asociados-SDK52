import { createSelector } from 'reselect';
import { RootState } from '../store/store';
import { Role } from '../types/types';
import { CountryState, State } from '../reducers/redux/globalReducer';

const getCountries = (state: RootState) => state.global.countries;
const getStates = (state: RootState) => state.global.states;
const getRoles = (state: RootState) => state.global.roles;

export const getMemoizedCountries = createSelector(
    [getCountries],
    (countries: CountryState[]) => [...countries]
  );

export const getMemoizedStates = createSelector(
    [getStates],
    (states: State[]) => [...states]
);

export const getMemoizedRoles = createSelector(
    [getRoles],
    (roles: Role[]) => [...roles]
);