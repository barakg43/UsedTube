import { useDirectoryTreeQuery } from "@/redux/api/driveApi";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { setActiveDirectory, setItems } from "@/redux/slices/itemsSlice";
import { RootState } from "@/redux/store";
import { useEffect } from "react";
import TreeFragment from "./TreeFragment";
import { CircularProgress } from "@mui/material";

function FolderTree() {
    const { data, isLoading } = useDirectoryTreeQuery(undefined);
    if (isLoading) return <CircularProgress />;
    return <TreeFragment node={data} spaces={0} />;
}

export default FolderTree;
