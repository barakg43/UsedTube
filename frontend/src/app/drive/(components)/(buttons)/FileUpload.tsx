import api_root from "@/config";
import { Button, Typography } from "@mui/material";
import React from "react";
import UploadFileIcon from "@mui/icons-material/UploadFile";

const FileUpload = () => {
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const formData = new FormData();
      formData.append("file", file);
      fetch(`${api_root}/upload`, {
        method: "POST",
        body: formData,
      }).then((res) => {
        if (res.ok) {
          console.log("File uploaded successfully");
        } else {
          console.error("Failed to upload file");
        }
      });
    }
  };
  return (
    <Button
      className="hover:bg-transparent text-black flex flex-row justify-left"
      component="label"
      variant="text"
      size="small"
      sx={{ textTransform: "none", hoverBackgroundColor: "transparent" }}
    >
      <UploadFileIcon />
      <Typography>Upload File</Typography>
      <input type="file" hidden onChange={handleFileUpload} />
    </Button>
  );
};

export default FileUpload;
