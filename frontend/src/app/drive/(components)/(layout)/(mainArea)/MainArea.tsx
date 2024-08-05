"use client";
import { useFolderContentQuery } from "@/redux/api/driveApi";
import { Typography } from "@mui/material";
import ItemsDisplay from "../../(itemsDisplay)/Display";
import ItemsDisplayToggle from "../../(itemsDisplay)/ItemsDisplayToggle";
import CreateNewFolder from "./CreateNewFolder";
import Loading from "@/app/(common)/(components)/Loading";
import ParentsRow from "./ParentsRow";
import { FSNode, FileNode } from "@/types";
import ShareItem from "./ShareItem";

const MainArea = ({ folderId }: { folderId: string }) => {
    const { data, error, isLoading } = useFolderContentQuery(
        { folderId },
        { skip: folderId === "" }
    );
    const {
        files,
        folders,
        parents,
    }: { files: FileNode[]; folders: FSNode[]; parents: FSNode[] } = data || {};

    if (isLoading) {
        <Loading />;
    }

    return (
        <div className="flex flex-col flex-grow px-4 py-4 mb-4 mr-4 rounded-3xl">
            <div className="flex flex-row justify-between w-full">
                <Typography variant="h4">
                    <ParentsRow parents={parents?.slice().reverse()} />
                </Typography>
                <div className="flex flex-row justify-between">
                    <ShareItem />
                    <CreateNewFolder />
                    <ItemsDisplayToggle />
                </div>
            </div>
            <ItemsDisplay
                parent={parents && parents[1]}
                folders={folders}
                files={files}
            />
        </div>
    );
};

export default MainArea;
