import React, { useState } from "react";
import CreateNewFolderIcon from "@mui/icons-material/CreateNewFolder";
import { useCreateFolderMutation } from "@/redux/api/driveApi";
import { Button, TextField, Typography, IconButton } from '@mui/material';
import CheckIcon from '@mui/icons-material/Check';
import CloseIcon from '@mui/icons-material/Close';
import { useAppDispatch } from "@/redux/hooks";
import { setAuth } from "@/redux/slices/authSlice";
import { ThemeProvider } from "@emotion/react";
import { theme } from "./theme";
import { useAppSelector } from "@/redux/hooks";
import { useToaster } from "@/app/(common)/useToaster";
import { RootState } from "@/redux/store";
import { useRouter } from "next/navigation";


function CreateNewFolder() {
  const [isInputVisible, setInputVisible] = useState(false);
  const [folderName, setFolderName] = useState('');
  const dispatch = useAppDispatch();
  const toaster = useToaster();
  const parentId = useAppSelector((state:RootState)=>  state.items.activeDirectory.id)
  const [createFolder, { isLoading, error }] = useCreateFolderMutation();
  const router = useRouter();
  const handleCreateFolder = () => {
    setInputVisible(true);
  };

  const handleApprove = async () => {
    try {
      await createFolder({ folderName, parentId }).unwrap();
      dispatch(setAuth());
      toaster("Folder was created successfully", "success");
      // TODO: refetch folder contents
      router.push("/drive/");
    } catch (error) {
      toaster("Failed to create folder", "error");
    }
  };
  
  
  const handleCancel = () => {
    setInputVisible(false);
    setFolderName('');
  };

  return (
    <ThemeProvider theme={theme}>
      <div className="flex items-center space-x-2 mx-8">
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
            className="hover:bg-dustyPaperDark text-black flex flex-row justify-left h-[47.33px]"
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
