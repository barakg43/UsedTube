"use client";
import { Button } from "@mui/material";
import React, { useRef } from "react";
import UploadFileIcon from "@mui/icons-material/UploadFile";
import { ThemeProvider } from "@emotion/react";
import { useAppSelector } from "@/redux/hooks";
import { theme } from "../theme";
import { useUploadFileMutation } from "@/redux/api/driveApi";
import useShowUploadProgress from "@/app/drive/(hooks)/useShowUploadProgress";

const MAX_FILE_SIZE = 100;
const MiB = 1024 * 1024;

const FileUploadButton = () => {
    const fileInputRef = useRef(null);
    const activeDirectoryId = useAppSelector(
        (state) => state.items.activeDirectoryId
    );
    const [uploadFile] = useUploadFileMutation();
    const { startUploadProgress } = useShowUploadProgress();
    //@ts-ignore
    const onFileBrowserClick = (e) => {
        const _file = e.target.files?.[0];
        if (_file.size <= 0) {
            alert("File is empty, please select a non empty file");
        } else if (_file.size < MAX_FILE_SIZE * MiB) {
            uploadFile({ file: _file, folderId: activeDirectoryId });
            startUploadProgress();
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
                className="hover:bg-highlighted_2 normal-case text-black flex justify-start"
                component="label"
                variant="text"
                size="small"
                sx={{
                    "&:disabled": {
                        background: "transparent !important",
                        cursor: "default !important",
                    },
                }}
            >
                <UploadFileIcon className="mr-2 ml-5" fontSize="small" />
                Upload file
                <input
                    ref={fileInputRef}
                    type="file"
                    accept=".doc, .docx, .pdf, .txt, .ppt, .pptx, .xls, .xlsx, .jpg, .jpeg, .png, .gif, .mp4, .mp3, .zip, .rar, .7z"
                    hidden
                    onChange={onFileBrowserClick}
                />
            </Button>
        </ThemeProvider>
    );
};

export default FileUploadButton;
