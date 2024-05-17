"use client";
import { store } from "@/redux/store";
import { FC } from "react";
import { Provider } from "react-redux";
import { persistStore } from "redux-persist";

persistStore(store);
const StoreProvider: FC<{ children: React.ReactNode }> = ({ children }) => {
    return <Provider store={store}>{children}</Provider>;
};

export default StoreProvider;
