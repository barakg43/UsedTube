"use client";
import React from "react";
import CreateNewFolderIcon from "@mui/icons-material/CreateNewFolder";
import { Button, Typography } from "@mui/material";
import { ThemeProvider } from "@emotion/react";
import { theme } from "./theme";

function CreateNewFolder() {
  const handleCreateFolder = () => {};
  return (
    <ThemeProvider theme={theme}>
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
    </ThemeProvider>
  );
}

export default CreateNewFolder;
