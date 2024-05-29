"use client";
import React, { FC, useState } from "react";
import CloseIcon from "@mui/icons-material/Close";
import CheckIcon from "@mui/icons-material/Check";
import { grey } from "@mui/material/colors";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { setFile } from "@/redux/slices/fileUploadSlice";
import { useUploadFileMutation } from "@/redux/api/driveApi";
import { RootState } from "@/redux/store";
import { CircularProgress } from "@mui/material";

const SelectedFile: FC<{
    file: File;
}> = ({ file }) => {
    const [isUploading, setIsUploading] = useState(false);
    const [uploadFile] = useUploadFileMutation();
    const dispatch = useAppDispatch();
    const activeDirectory = useAppSelector(
        (state: RootState) => state.items.activeDirectory
    );
    const progress = useAppSelector(
        (state: RootState) => state.fileUpload.progress
    );
    const setProgress = (progress: number) => {
        dispatch(setFile(progress));
    };
    const handleUploadClick = async () => {
        try {
            setIsUploading(true);
            await uploadFile({ file, folderId: activeDirectory.id }).unwrap();
        } catch (error) {
            // Handle error
            console.error("Failed to upload file", error);
            setIsUploading(false);
        }
    };

    // set a timer to poll the progress after upload starts
    // the timer will be cleared when the upload is complete
    // or when the component is unmounted
    // the server will reply with progress and when its done it will reply with the file itself
    // then the client will download the file and upload it to youtube

    return (
        <div className="flex flex-col justify-between items-center">
            <p>{file.name}</p>
            <p>{compactFileSize(file.size)}</p>
            {isUploading ? (
                <CircularProgress color="inherit" value={progress} />
            ) : (
                <div className="flex flex-row justify-center w-full">
                    <div className="items-center flex-grow">
                        <button>
                            <CheckIcon
                                sx={{
                                    color: "black",
                                    "&:hover": { color: grey },
                                }}
                                onClick={handleUploadClick}
                            />
                        </button>
                    </div>
                    <div className="items-center flex-grow">
                        <button>
                            <CloseIcon
                                sx={{
                                    color: "black",
                                    "&:hover": { color: grey },
                                }}
                                onClick={() => {
                                    dispatch(setFile(null));
                                }}
                            />
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default SelectedFile;

function compactFileSize(sizeInBytes: number): string {
    let size = sizeInBytes;
    const units = ["B", "KiB", "MiB", "GiB", "TiB"];
    let unitIndex = 0;
    while (size >= 1024 && unitIndex < units.length - 1) {
        size /= 1024;
        unitIndex++;
    }
    return `${size.toFixed(2)} ${units[unitIndex]}`;
}
