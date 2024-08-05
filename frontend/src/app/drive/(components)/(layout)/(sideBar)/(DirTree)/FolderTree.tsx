import { useDirectoryTreeQuery } from "@/redux/api/driveApi";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { setItems } from "@/redux/slices/itemsSlice";
import { RootState } from "@/redux/store";
import { useEffect } from "react";
import TreeFragment from "./TreeFragment";
import { CircularProgress } from "@mui/material";

function FolderTree() {
    const dispatch = useAppDispatch();
    const { data, isLoading } = useDirectoryTreeQuery(undefined);
    const editableItems = useAppSelector(
        (state: RootState) => state.items.myItems
    );
    useEffect(() => {
        dispatch(setItems(data));
    }, [data, dispatch]);
    if (isLoading) return <CircularProgress />;
    return <TreeFragment node={editableItems} spaces={0} />;
}

export default FolderTree;
