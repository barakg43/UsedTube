"use client";
import React from "react";
import CreateNewFolderIcon from "@mui/icons-material/CreateNewFolder";
import {
    useCreateFolderMutation,
    useDirectoryTreeQuery,
    useFolderContentQuery,
} from "@/redux/api/driveApi";
import { Button, TextField, Typography, IconButton } from "@mui/material";
import CheckIcon from "@mui/icons-material/Check";
import CloseIcon from "@mui/icons-material/Close";
import { ThemeProvider } from "@emotion/react";
import { theme } from "./theme";
import { useAppSelector } from "@/redux/hooks";
import { RootState } from "@/redux/store";
import { useState } from "react";
import { useToaster } from "@/app/(common)/(hooks)/(toaster)/useToaster";

function CreateNewFolder() {
    const [isInputVisible, setInputVisible] = useState(false);
    const [folderName, setFolderName] = useState("");
    const [createFolder, { isLoading, error }] = useCreateFolderMutation();
    const parentId = useAppSelector(
        (state: RootState) => state.items.activeDirectoryId
    );

    const { refetch: refetchFolderContent } = useFolderContentQuery({
        folderId: parentId,
    });
    const { refetch: refetchDirsTree } = useDirectoryTreeQuery(undefined);

    const toaster = useToaster();

    const handleCreateFolder = () => {
        setInputVisible(true);
    };

    const handleApprove = async () => {
        try {
            await createFolder({ folderName, parentId }).unwrap();
            // toaster(
            //     `folder \"${folderName}\" was created successfully`,
            //     "success"
            // );
            refetchFolderContent();
            refetchDirsTree();
            setInputVisible(false);
        } catch {
            toaster(`failed to create folder ${folderName}`, "error");
        }
    };

    const handleCancel = () => {
        setInputVisible(false);
        setFolderName("");
    };

    return (
        <ThemeProvider theme={theme}>
            <div className="items-center space-x-2 mx-8">
                {isInputVisible ? (
                    <div className="flex items-center space-x-2">
                        <TextField
                            size="small"
                            value={folderName}
                            onChange={(e) => setFolderName(e.target.value)}
                            placeholder="New Folder Name"
                        />
                        <IconButton size="small" onClick={handleApprove}>
                            <CheckIcon />
                        </IconButton>
                        <IconButton size="small" onClick={handleCancel}>
                            <CloseIcon />
                        </IconButton>
                    </div>
                ) : (
                    <Button
                        className="bg-paper hover:highlighted text-black flex flex-row justify-left h-[47.33px]"
                        component="label"
                        variant="outlined"
                        size="small"
                        sx={{ textTransform: "none" }}
                        onClick={handleCreateFolder}
                    >
                        <CreateNewFolderIcon />
                        <Typography>Create Folder</Typography>
                    </Button>
                )}
            </div>
        </ThemeProvider>
    );
}

export default CreateNewFolder;
