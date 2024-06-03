import React, { useState } from "react";
import CreateNewFolderIcon from "@mui/icons-material/CreateNewFolder";
import axios from 'axios';
import { Button, TextField, Typography, IconButton } from '@mui/material';
import CheckIcon from '@mui/icons-material/Check';
import CloseIcon from '@mui/icons-material/Close';
import { ThemeProvider } from "@emotion/react";
import { theme } from "./theme";
import { useAppSelector } from "@/redux/hooks";
import { RootState } from "@/redux/store";

function CreateNewFolder() {
  const [isInputVisible, setInputVisible] = useState(false);
  const [folderName, setFolderName] = useState('');
  const activeDirectory = useAppSelector((state:RootState)=>  state.items.activeDirectory)
  const handleCreateFolder = () => {
    setInputVisible(true);
  };

  const handleApprove = async () => {
    // TODO: update valid server endpoint when ready
    try {
      // Make the HTTP request to the server
      const response = await axios.post('/api/create-folder', {
        folderName,
        activeDirectory,
      });

      // Handle the response as needed
      console.log('Folder created:', response.data);

      // Reset the state
      setInputVisible(false);
      setFolderName('');
    } catch (error) {
      console.error('Error creating folder:', error);
    }
  };

  const handleCancel = () => {
    setInputVisible(false);
    setFolderName('');
  };

  return (
    <ThemeProvider theme={theme}>
      <div className="flex items-center space-x-2 px-8">
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
