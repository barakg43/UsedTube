import { configureStore } from "@reduxjs/toolkit";
import userSlice from "./slices/userSlice";
import itemsSlice from "./slices/itemsSlice";
import generalSlice, { generalPersistConfig } from "./slices/generalSlice";
import { combineReducers } from "@reduxjs/toolkit";
import { persistReducer } from "redux-persist";

const rootReducer = combineReducers({
    user: userSlice,
    items: itemsSlice,
    general: persistReducer(generalPersistConfig, generalSlice),
});

export const store = configureStore({
    reducer: rootReducer,
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
            serializableCheck: false,
        }),
});

// Infer the type of makeStore
// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
