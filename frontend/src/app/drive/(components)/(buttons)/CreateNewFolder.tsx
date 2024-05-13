import React from "react";
import CreateNewFolderIcon from "@mui/icons-material/CreateNewFolder";
import { Button, Typography } from "@mui/material";

function CreateNewFolder() {
  const handleCreateFolder = () => {};
  return (
    <Button
      className="hover:bg-dustyPaperDark text-black flex flex-row justify-left h-[47.33px]"
      component="label"
      variant="outlined"
      size="small"
      sx={{ textTransform: "none", hoverBackgroundColor: "transparent", hoverBorderColor: "#e5ebe7", border: "1px" }}
      onClick={handleCreateFolder}
    >
      <CreateNewFolderIcon />
      <Typography>Create Folder</Typography>
    </Button>
  );
}

export default CreateNewFolder;
