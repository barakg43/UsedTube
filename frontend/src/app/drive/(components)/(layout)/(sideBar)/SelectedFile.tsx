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
    const [progress, setProgress] = useState(0);
    const [uploadFile] = useUploadFileMutation();
    const dispatch = useAppDispatch();
    const activeDirectory = useAppSelector(
        (state: RootState) => state.items.activeDirectory
    );
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
    // const timer = setInterval(() => {
    //     setProgress((oldProgress) => {
    //         if (oldProgress === 100) {
    //             clearInterval(timer);
    //             setIsUploading(false);
    //             return 0;
    //         }
    //         const diff = Math.random() * 10;
    //         return Math.min(oldProgress + diff, 100);
    //     });
    // }, 500);

    return (
        <div className="flex flex-col justify-between items-center">
            <p>{file.name}</p>
            <p>{file.size} bytes</p>
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
