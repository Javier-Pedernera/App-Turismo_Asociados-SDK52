import { createSlice, PayloadAction } from '@reduxjs/toolkit';

// Define las interfaces para los datos
export interface CountryState {
  code: string;
  id: number;
  name: string;
  phone_code: string | null;
}

export interface State {
  id: number;
  name: string;
  description: string | null;
}

interface RoleFunctionality {
  id: number;
  name: string;
  description: string;
  platform: string;
}

interface Role {
  role_id: number;
  role_name: string;
  functionalities: RoleFunctionality[];
}

interface GlobalState {
  countries: CountryState[];
  states: State[];
  roles: Role[];
  loading: boolean;
  error: string | null;
}

const initialState: GlobalState = {
  countries: [],
  states: [],
  roles: [],
  loading: false,
  error: null,
};

const globalSlice = createSlice({
  name: 'global',
  initialState,
  reducers: {
    setCountries: (state, action: PayloadAction<CountryState[]>) => {
      state.countries = action.payload;
    },
    setStates: (state, action: PayloadAction<State[]>) => {
      state.states = action.payload;
    },
    setRoles: (state, action: PayloadAction<Role[]>) => {
      state.roles = action.payload;
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
  },
});

export const { setCountries, setStates, setRoles, setLoading, setError } = globalSlice.actions;
export default globalSlice.reducer;