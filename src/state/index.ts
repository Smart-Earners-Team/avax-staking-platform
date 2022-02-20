import { configureStore } from "@reduxjs/toolkit";
import { save, load } from "redux-localstorage-simple";
import { useDispatch } from "react-redux";
import poolsReducer from "./pools";
import auctionsReducer from "./auctions";
import { updateVersion } from "./global/actions";

const PERSISTED_KEYS: string[] = ["auctions"];

const store = configureStore({
  devTools: process.env.NODE_ENV !== "production",
  reducer: {
    pools: poolsReducer,
    auctions: auctionsReducer,
  },
  middleware: (getDefaultMiddleware) => [
    ...getDefaultMiddleware({ thunk: true }),
    save({ states: PERSISTED_KEYS, debounce: 1000 }),
  ],
  preloadedState: load({
    states: PERSISTED_KEYS,
  }),
});

store.dispatch(updateVersion());

/**
 * @see https://redux-toolkit.js.org/usage/usage-with-typescript#getting-the-dispatch-type
 */
export type AppDispatch = typeof store.dispatch;
export type AppState = ReturnType<typeof store.getState>;
export const useAppDispatch = () => useDispatch();

export default store;
