import { ROW } from "@/constants";
import { DisplayType, FSNode, ItemsState } from "@/types";
import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { getWritableDraft, openAllAncestorsHelper } from "./utils";

const initialState: ItemsState = {
    myItems: {} as FSNode,
    displayType: ROW,
    activeDirectoryId: "",
    sharedItems: null,
};

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
        toggleIsOpenedDir: (state, action: PayloadAction<FSNode>) => {
            const nodeWritableDraft = getWritableDraft(
                action.payload,
                state.myItems
            );
            if (nodeWritableDraft) {
                nodeWritableDraft.isOpened = !nodeWritableDraft.isOpened;
            }
            if (nodeWritableDraft?.children && !nodeWritableDraft.isOpened) {
                // change isOpened of all subfolders to false
                const stack = [...nodeWritableDraft.children];
                while (stack.length) {
                    const current = stack.pop();
                    if (current?.type === "folder") {
                        current.isOpened = false;
                        stack.push(...(current.children ?? []));
                    }
                }
            }
        },
    },
});

// Action creators are generated for each case reducer function
export const {
    setItems,
    setActiveDirectory,
    setDisplayType,
    toggleIsOpenedDir: toggleIsOpened,
} = itemsSlice.actions;

export default itemsSlice.reducer;
