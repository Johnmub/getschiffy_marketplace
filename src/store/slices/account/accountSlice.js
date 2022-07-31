import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  activeLogin: false,
  address: undefined,
  busdBalance: undefined,
  goldBalance: undefined
};

export const accountSlice = createSlice({
  name: 'account',
  initialState,
  reducers: 
  {
    loadAccount: (state, action) => 
    {
      state.activeLogin = true;
      state.address = action.payload.address;
      state.busdBalance = action.payload.busd_balance;
      state.goldBalance = action.payload.gold_balance;
    },
    disconnectAccount: (state) => {
      state.activeLogin = false;
      state.address = undefined;
      state.busdBalance = undefined;
      state.goldBalance = undefined;
    },
  },
});

export const {loadAccount, disconnectAccount} = accountSlice.actions;