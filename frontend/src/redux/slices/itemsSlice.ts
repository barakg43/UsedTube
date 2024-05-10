import { ItemsType, UserValues } from "@/types";
import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import { fakeData } from "./itemsSliceFakeData";

const initialState: ItemsType = fakeData;

export const itemsSlice = createSlice({
  name: "items",
  initialState,
  reducers: {},
});

// Action creators are generated for each case reducer function
export const {} = itemsSlice.actions;

export default itemsSlice.reducer;
