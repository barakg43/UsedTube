import React, { useState } from "react";
import CreateNewFolderIcon from "@mui/icons-material/CreateNewFolder";
import { Button, TextField, Typography, IconButton } from '@mui/material';
import CheckIcon from '@mui/icons-material/Check';
import CloseIcon from '@mui/icons-material/Close';
import { ThemeProvider } from "@emotion/react";
import { theme } from "./theme";

function CreateNewFolder() {
  const [isInputVisible, setInputVisible] = useState(false);
  const [folderName, setFolderName] = useState('');

  const handleCreateFolder = () => {
    setInputVisible(true);
  };

  const handleApprove = () => {
    // TODO: Handle the logic for creating a new folder here
    console.log(`Creating folder: ${folderName}`);
    setInputVisible(false);
    setFolderName('');
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
