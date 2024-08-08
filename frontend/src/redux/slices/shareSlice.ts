import { FSNode } from "@/types";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export type ShareState = {
    showModal: boolean;
    userToShareWith: string;
    fileNode: FSNode;
};

const initialState: ShareState = {
    showModal: false,
    userToShareWith: "",
    fileNode: {} as FSNode,
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
    },
});

export const { setShowModal, setUserToShareWith, setFileNode } =
    shareSlice.actions;

export default shareSlice.reducer;
