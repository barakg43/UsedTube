"use client";
import { useToaster } from "@/app/(common)/(hooks)/(toaster)/useToaster";
import { useFolderContentQuery } from "@/redux/api/driveApi";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { RootState } from "@/redux/store";
import { Typography } from "@mui/material";
import ItemsDisplay from "../../(itemsDisplay)/Display";
import ItemsDisplayToggle from "../../(itemsDisplay)/ItemsDisplayToggle";
import CreateNewFolder from "./CreateNewFolder";
import Loading from "@/app/(common)/(components)/Loading";
import { useEffect } from "react";
import { setActiveDirectory } from "@/redux/slices/itemsSlice";
import ParentsRow from "./ParentsRow";
import { FSNode, FileNode } from "@/types";

const MainArea = ({ folderId }: { folderId: string | undefined }) => {
    const { data, error, isLoading } = useFolderContentQuery({ folderId });
    const dispatch = useAppDispatch();
    const {
        files,
        folders,
        parents,
    }: { files: FileNode[]; folders: FSNode[]; parents: FSNode[] } = data || {};
    const activeDirectory = useAppSelector(
        (state: RootState) => state.items.activeDirectoryId
    );
    useEffect(() => {
        // if (!activeDirectory)
        // dispatch(setActiveDirectory(parents && parents[0]?.id));
        dispatch(setActiveDirectory(folderId || ""));
    });
    if (isLoading) {
        <Loading />;
    }

    return (
        <div className="flex flex-col flex-grow px-4 py-4 mb-4 mr-4 bg-dustyPaper rounded-3xl">
            <div className="flex flex-row justify-between w-full">
                <Typography variant="h4">
                    <ParentsRow parents={parents?.slice().reverse()} />
                </Typography>
                <div className="flex flex-row justify-between w-[250px]">
                    <CreateNewFolder />
                    <ItemsDisplayToggle />
                </div>
            </div>
            <ItemsDisplay
                parent={parents && parents[1]}
                folders={folders || []}
                files={files || []}
            />
        </div>
    );
};

export default MainArea;
