import { FSNode } from "@/types";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export type ShareState = {
    showModal: boolean;
    userToShareWith: string;
    fileNode: FSNode;
    showSharedItems: boolean;
};

const initialState: ShareState = {
    showModal: false,
    userToShareWith: "",
    fileNode: {} as FSNode,
    showSharedItems: false,
};

export const shareSlice = createSlice({
    name: "share",
    initialState,
    reducers: {
        setShowModal: (state, action: PayloadAction<boolean>) => {
            state.showModal = action.payload;
        },
        setUserToShareWith: (state, action: PayloadAction<string>) => {
            state.userToShareWith = action.payload;
        },
        setFileNode: (state, action: PayloadAction<FSNode>) => {
            state.fileNode = action.payload;
        },
        setShowSharedItems(state, action: PayloadAction<boolean>) {
            state.showSharedItems = action.payload;
        },
    },
});

export const {
    setShowModal,
    setUserToShareWith,
    setFileNode,
    setShowSharedItems,
} = shareSlice.actions;

export default shareSlice.reducer;
