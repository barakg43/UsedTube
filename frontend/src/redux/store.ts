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

export const makeStore = () => {
    return configureStore({
        reducer: rootReducer,
    });
};

// Infer the type of makeStore
export type AppStore = ReturnType<typeof makeStore>;
// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<AppStore["getState"]>;
export type AppDispatch = AppStore["dispatch"];
