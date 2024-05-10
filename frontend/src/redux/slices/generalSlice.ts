import { GeneralState } from "@/types";
import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

const initialState: GeneralState = {
  showModal: false,
};

export const generalSlice = createSlice({
  name: "general",
  initialState,
  reducers: {
    setShowModal: (state, action: PayloadAction<boolean>) => {
      state.showModal = action.payload;
    },
  },
});

// Action creators are generated for each case reducer function
export const { setShowModal } = generalSlice.actions;

export default generalSlice.reducer;
