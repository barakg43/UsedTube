import { configureStore } from "@reduxjs/toolkit";
import userSlice from "./slices/userSlice";
import itemsSlice from "./slices/itemsSlice";
import generalSlice from "./slices/generalSlice";
import authSlice from "./slices/authSlice";
import { baseApi } from "./baseApi";
import fileUploadSlice from "./slices/fileUploadSlice";

export const makeStore = () => {
  return configureStore({
    reducer: {
      [baseApi.reducerPath]: baseApi.reducer,
      user: userSlice,
      items: itemsSlice,
      general: generalSlice,
      auth: authSlice,
      fileUpload: fileUploadSlice,
    },
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware({
        serializableCheck: {
          ignoredActions: ["fileUpload/setFile"],
          ignoredPaths: ["fileUpload.file"],
        },
      }).concat(baseApi.middleware),

    devTools: process.env.NODE_ENV !== "production",
  });
};
export const store = makeStore();
// Infer the type of makeStore
export type AppStore = typeof store;
// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
