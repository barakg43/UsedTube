import { DisplayType, FSNode, ItemsState } from "@/types";
import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { fakeData } from "./itemsSliceFakeData";
import { row } from "@/constants";
import { getWritableDraft } from "./utils";

const initialState: ItemsState = {
  items: fakeData,
  activeDirectory: fakeData.myItems,
  displayType: row,
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
    toggleIsOpened: (state, action: PayloadAction<FSNode>) => {
      const nodeWritableDraft = getWritableDraft(action.payload, state.items.myItems);
      if (nodeWritableDraft) {
        nodeWritableDraft.isOpened = !nodeWritableDraft.isOpened;
      }
    },
  },
});

// Action creators are generated for each case reducer function
export const { setItems, setActiveDirectory, setDisplayType, toggleIsOpened } = itemsSlice.actions;

export default itemsSlice.reducer;
