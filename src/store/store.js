import { configureStore } from "@reduxjs/toolkit";
import { accountSlice } from "./slices/account/accountSlice";
import { gameSlice } from "./slices/game/gameSlice";

export const Store = configureStore({
  reducer: {
    account: accountSlice.reducer,
    game: gameSlice.reducer,
  },
});