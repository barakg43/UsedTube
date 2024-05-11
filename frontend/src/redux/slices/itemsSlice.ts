import { DisplayType, FSNode, ItemsState } from "@/types";
import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { fakeData } from "./itemsSliceFakeData";
import { grid } from "@/constants";

const initialState: ItemsState = {
  items: fakeData,
  activeDirectory: fakeData.myItems[0],
  displayType: grid,
};

export const itemsSlice = createSlice({
  name: "items",
  initialState,
  reducers: {
    setItems: (state, action) => {
      state = action.payload;
    },
    setActiveDirectory: (state, action: PayloadAction<FSNode>) => {
      state.activeDirectory = action.payload;
    },
    setDisplayType: (state, action: PayloadAction<DisplayType>) => {
      state.displayType = action.payload;
    },
  },
});

// Action creators are generated for each case reducer function
export const { setItems, setActiveDirectory, setDisplayType } = itemsSlice.actions;

export default itemsSlice.reducer;
