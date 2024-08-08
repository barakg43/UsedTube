import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export type ShareState = {
    showModal: boolean;
    userToShareWith: string;
};

const initialState: ShareState = {
    showModal: false,
    userToShareWith: "",
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
    },
});

export const { setShowModal, setUserToShareWith } = shareSlice.actions;

export default shareSlice.reducer;
