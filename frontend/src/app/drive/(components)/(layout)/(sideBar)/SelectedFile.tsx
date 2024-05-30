"use client";
import React, { FC, useState } from "react";
import CloseIcon from "@mui/icons-material/Close";
import CheckIcon from "@mui/icons-material/Check";
import { grey } from "@mui/material/colors";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import {
    setFile,
    setIsUploading,
    setJobId,
} from "@/redux/slices/fileUploadSlice";
import { useUploadFileMutation } from "@/redux/api/driveApi";
import { RootState } from "@/redux/store";
import UploadProgressInfo from "./UploadProgressInfo";
import { compactFileSize } from "@/redux/slices/utils";

const SelectedFile: FC<{
    file: File;
}> = ({ file }) => {
    const isUploading = useAppSelector((state) => state.fileUpload.isUploading);
    const [uploadFile] = useUploadFileMutation();
    const dispatch = useAppDispatch();
    const activeDirectory = useAppSelector(
        (state: RootState) => state.items.activeDirectory
    );

    const handleUploadClick = async () => {
        try {
            dispatch(setIsUploading(true));
            const jobIdPromise = await uploadFile({
                file,
                folderId: activeDirectory.id,
            }).unwrap();
            dispatch(setJobId(jobIdPromise.jobId));
            // intialize polling for progress
        } catch (error) {
            // Handle error
            console.error("Failed to upload file", error);
            dispatch(setIsUploading(false));
        }
    };

    return (
        <div className="flex flex-col justify-between items-center">
            <p>{file.name}</p>
            <p>{compactFileSize(file.size)}</p>
            {isUploading ? (
                <UploadProgressInfo />
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
