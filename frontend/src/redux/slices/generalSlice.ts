import { FSNode, GeneralState } from "@/types";
import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

const initialState: GeneralState = {
  showModal: false,
  activeDirectory: null,
  userId: "",
};

export const generalSlice = createSlice({
  name: "general",
  initialState,
  reducers: {
    setShowModal: (state, action: PayloadAction<boolean>) => {
      state.showModal = action.payload;
    },
    setActiveDirectory: (state, action: PayloadAction<FSNode>) => {
      state.activeDirectory = action.payload;
    },
    setUserId: (state, action: PayloadAction<string>) => {
      state.userId = action.payload;
    },
  },
});

// Action creators are generated for each case reducer function
export const { setShowModal, setActiveDirectory, setUserId } = generalSlice.actions;

export default generalSlice.reducer;
