import { root_api } from "@/axios";
import { ROW } from "@/constants";
import { DisplayType, FSNode, ItemsState } from "@/types";
import { PayloadAction, createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import { getWritableDraft, openAllAncestorsHelper } from "./utils";

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
    setItems: (state, action: PayloadAction<FSNode | undefined>) => {
      state.activeDirectoryId = state.activeDirectoryId
        ? state.activeDirectoryId
        : action.payload?.id ?? "";
      if (action.payload) {
        state.myItems = structuredClone(action.payload);
        openAllAncestorsHelper(state.myItems, state.activeDirectoryId);
      }
    },
    setActiveDirectory: (state, action: PayloadAction<string>) => {
      state.activeDirectoryId = action.payload;
      openAllAncestorsHelper(state.myItems, action.payload);
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
