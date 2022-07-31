import { configureStore } from "@reduxjs/toolkit";
import { accountSlice } from "./slices/account/accountSlice";

export const Store = configureStore({
  reducer: {
    account: accountSlice.reducer,
  },
});