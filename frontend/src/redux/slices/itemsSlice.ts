import { FSItems } from "@/types";
import { createSlice } from "@reduxjs/toolkit";
import { fakeData } from "./itemsSliceFakeData";

const initialState: FSItems = fakeData;

export const itemsSlice = createSlice({
  name: "items",
  initialState,
  reducers: {
    setItems: (state, action) => {
      state = action.payload;
    },
  },
});

// Action creators are generated for each case reducer function
export const {} = itemsSlice.actions;

export default itemsSlice.reducer;
