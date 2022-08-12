import { createSlice } from '@reduxjs/toolkit';

const initialState = 
{
  email: undefined,
  goldBalance: undefined,
  gameVerified: undefined,
  registered: undefined,

  lastLogin: undefined,
  lastDevice: undefined
};

export const gameSlice = createSlice({
  name: 'account',
  initialState,
  reducers: 
  {
    loadGame: (state, action) => 
    {
      state = Object.assign(state, {
        email: action.payload.game_email,
        goldBalance: action.payload.game_gold,
        gameVerified: action.payload.game_verified,
        registered: action.payload.registered,
        
        lastLogin: action.payload.last_login,
        lastDevice: action.payload.last_device
      });
    },
    loadEmail: (state, action) => {
      state.email = action.payload
    },
    disconnectGame: (state) => {
      state = Object.assign(state, initialState);
    },
  },
});

export const {loadGame, loadEmail, disconnectGame} = gameSlice.actions;