"use client";
import { Button, Typography } from "@mui/material";
import React, { useRef } from "react";
import UploadFileIcon from "@mui/icons-material/UploadFile";
import { ThemeProvider } from "@emotion/react";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { setSelectedFileToUpload } from "@/redux/slices/fileUploadSlice";
import { theme } from "../../theme";

const MAX_FILE_SIZE = 100;
const MiB = 1024 * 1024;

const FileUploadButton = () => {
    const dispatch = useAppDispatch();
    const fileInputRef = useRef(null);
    const isUploading = useAppSelector((state) => state.fileUpload.isUploading);
    //@ts-ignore
    const onFileBrowserClick = (e) => {
        const _file = e.target.files?.[0];
        if (_file.size <= 0) {
            alert("File is empty, please select a non empty file");
        } else if (_file.size < MAX_FILE_SIZE * MiB) {
            dispatch(setSelectedFileToUpload(_file));
        } else {
            alert(
                `Currently We only support files with size less than ${MAX_FILE_SIZE}MB`
            );
        }
        if (fileInputRef.current) {
            //@ts-ignore
            fileInputRef.current.value = "";
        }
    };
    return (
        <ThemeProvider theme={theme}>
            <Button
                className="hover:bg-transparent normal-case text-black flex flex-row justify-left"
                component="label"
                variant="text"
                size="small"
                disabled={isUploading}
                sx={{
                    "&:disabled": {
                        background: "transparent !important",
                        cursor: "default !important",
                    },
                }}
            >
                <UploadFileIcon />
                <Typography>Upload File</Typography>
                <input
                    type="file"
                    ref={fileInputRef}
                    hidden
                    onChange={onFileBrowserClick}
                />
            </Button>
        </ThemeProvider>
    );
};

export default FileUploadButton;
