"use client";
import React from "react";
import CreateNewFolderIcon from "@mui/icons-material/CreateNewFolder";
import { Button, TextField, Typography, IconButton } from "@mui/material";
import CheckIcon from "@mui/icons-material/Check";
import CloseIcon from "@mui/icons-material/Close";
import { useAppDispatch } from "@/redux/hooks";
import { setAuth } from "@/redux/slices/authSlice";
import { ThemeProvider } from "@emotion/react";
import { theme } from "./theme";
import { useAppSelector } from "@/redux/hooks";
import { useToaster } from "@/app/(common)/useToaster";
import { RootState } from "@/redux/store";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useCreateFolderMutation } from "@/redux/api/driveApi";

function CreateNewFolder() {
  const [isInputVisible, setInputVisible] = useState(false);
  const [folderName, setFolderName] = useState("");
  const dispatch = useAppDispatch();
  const parentId = useAppSelector(
    (state: RootState) => state.items.activeDirectoryId
  );
  const router = useRouter();
  const handleCreateFolder = () => {
    setInputVisible(true);
  };

  const handleApprove = async () => {
    try {
      await createFolder({
        folderName,
        parentId: "aeb13b3a-3552-4af9-ab5d-bceb01ef8d59",
      }).unwrap();
      console.log(`Folder ${folderName} was created successfully`);
      // TODO: impliment front added folder
    } catch {
      console.error(`Failed to create folder ${folderName}`);
    }
  };

  const handleCancel = () => {
    setInputVisible(false);
    setFolderName("");
  };

  return (
    <ThemeProvider theme={theme}>
      <div className='flex items-center space-x-2 mx-8'>
        {isInputVisible ? (
          <div className='flex items-center space-x-2'>
            <TextField
              size='small'
              value={folderName}
              onChange={(e) => setFolderName(e.target.value)}
              placeholder='New Folder Name'
            />
            <IconButton size='small' onClick={handleApprove}>
              <CheckIcon />
            </IconButton>
            <IconButton size='small' onClick={handleCancel}>
              <CloseIcon />
            </IconButton>
          </div>
        ) : (
          <Button
            className='hover:bg-dustyPaperDark text-black flex flex-row justify-left h-[47.33px]'
            component='label'
            variant='outlined'
            size='small'
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
