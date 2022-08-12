import { createSlice } from '@reduxjs/toolkit';

const initialState = 
{
  activeLogin: false,
  address: undefined,
  busdBalance: undefined,
  goldBalance: undefined,

  messageSigned: undefined,
  registered: undefined,
  lastLogin: undefined,
  lastDevice: undefined
};

export const accountSlice = createSlice({
  name: 'account',
  initialState,
  reducers: 
  {
    loadAccount: (state, action) => 
    {
      state = Object.assign(state, {
        activeLogin : true,
        address : action.payload.address,
        busdBalance : action.payload.busd_balance,
        goldBalance : action.payload.gold_balance,
        
        messageSigned : action.payload.messageSigned,
        registered: action.payload.registered,
        lastLogin: action.payload.last_login,
        lastDevice: action.payload.last_device
      });
    },
    disconnectAccount: (state) => {
      state = Object.assign(state, initialState);
    },
  },
});

export const {loadAccount, disconnectAccount} = accountSlice.actions;