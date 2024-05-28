"use client";
import { Button, Typography } from "@mui/material";
import React from "react";
import UploadFileIcon from "@mui/icons-material/UploadFile";
import { ThemeProvider } from "@emotion/react";
import { theme } from "./theme";
import { useAppDispatch } from "@/redux/hooks";
import { setFile } from "@/redux/slices/fileUploadSlice";

const FileUpload = () => {
    const dispatch = useAppDispatch();
    const onFileBrowserClick = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            dispatch(setFile(file));
        }
    };
    return (
        <ThemeProvider theme={theme}>
            <Button
                className="hover:bg-transparent text-black flex flex-row justify-left"
                component="label"
                variant="text"
                size="small"
                sx={{
                    textTransform: "none",
                    hoverBackgroundColor: "transparent",
                }}
            >
                <UploadFileIcon />
                <Typography>Upload File</Typography>
                <input type="file" hidden onChange={onFileBrowserClick} />
            </Button>
        </ThemeProvider>
    );
};

export default FileUpload;
