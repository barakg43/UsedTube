import { DisplayType, FSNode, ItemsState } from "@/types";
import { PayloadAction, createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { fakeData } from "./itemsSliceFakeData";
import { ROW } from "@/constants";
import { getWritableDraft } from "./utils";
import axios from "axios";
import { root_api } from "@/axios";

const initialState: ItemsState = {
  myItems: { id: "", name: "" },
  displayType: ROW,
  activeDirectoryId: "",
  sharedItems: null,
};

// export const createNewFolder = createAsyncThunk(
//   "items/createNewFolder",
//   async (folderName: string, thunkAPI) => {
//     const response = await axios.post(`${root_api}/files/register`, folderName);
//     return response.data;
//   }
// );

export const itemsSlice = createSlice({
  name: "items",
  initialState,
  reducers: {
    setItems: (state, action) => {
      state.myItems = action.payload;
    },
    setActiveDirectory: (state, action: PayloadAction<string>) => {
      state.activeDirectoryId = action.payload;
    },
    setDisplayType: (state, action: PayloadAction<DisplayType>) => {
      state.displayType = action.payload;
    },
    toggleIsOpened: (state, action: PayloadAction<FSNode>) => {
      const nodeWritableDraft = getWritableDraft(action.payload, state.myItems);
      if (nodeWritableDraft) {
        nodeWritableDraft.isOpened = !nodeWritableDraft.isOpened;
      }
    },
  },
});

// Action creators are generated for each case reducer function
export const { setItems, setActiveDirectory, setDisplayType, toggleIsOpened } =
  itemsSlice.actions;

export default itemsSlice.reducer;
