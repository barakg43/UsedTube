import { DisplayType, FSNode, ItemsState } from "@/types";
import { PayloadAction, createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { fakeData } from "./itemsSliceFakeData";
import { ROW } from "@/constants";
import { getWritableDraft } from "./utils";
import axios from "axios";

const initialState: ItemsState = {
    items: fakeData,
    activeDirectory: fakeData.myItems,
    displayType: ROW,
};

export const createNewFolder = createAsyncThunk(
    "items/createNewFolder",
    async (folderName: string, thunkAPI) => {
        const response = await axios.post(
            `${process.env.NEXT_PUBLIC_HOST}/files/register`,
            folderName
        );
        return response.data;
    }
);

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
            const nodeWritableDraft = getWritableDraft(
                action.payload,
                state.items.myItems
            );
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
