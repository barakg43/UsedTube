"use client";
import React, { FC, useEffect, useState } from "react";
import CloseIcon from "@mui/icons-material/Close";
import CheckIcon from "@mui/icons-material/Check";
import { grey } from "@mui/material/colors";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import {
    setFile,
    setIsUploading,
    setProgress,
    setTimer,
} from "@/redux/slices/fileUploadSlice";
import {
    useGetUploadProgressQuery,
    useUploadFileMutation,
} from "@/redux/api/driveApi";
import { RootState } from "@/redux/store";
import UploadProgressInfo from "./UploadProgressInfo";
import { compactFileSize } from "@/redux/slices/utils";

const SelectedFile: FC<{
    file: File;
}> = ({ file }) => {
    const dispatch = useAppDispatch();
    const isUploading = useAppSelector((state) => state.fileUpload.isUploading);
    const jobId = useAppSelector((state) => state.fileUpload.jobId);
    const timer = useAppSelector((state) => state.fileUpload.timer);
    const activeDirectory = useAppSelector(
        (state: RootState) => state.items.activeDirectory
    );

    const [uploadFile] = useUploadFileMutation();
    const {
        data: progress,
        isUninitialized,
        refetch,
    } = useGetUploadProgressQuery({ jobId }, { skip: !jobId });

    // useGetSerializedVideoQuery({ jobId }, { skip: !jobId && progress !== 100});

    // REPLACE WITH WEBSOCKET
    useEffect(() => {
        if (progress === 100 && timer) {
            clearInterval(timer);
            dispatch(setTimer(null));
            dispatch(setProgress(0));
            // request the video from server
        }
    }, [progress]);

    useEffect(() => {
        const timer = setInterval(() => {
            if (!isUninitialized) refetch();
        }, 1000);
        dispatch(setTimer(timer));
    }, [jobId]);
    // REPLACE WITH WEBSOCKET

    const handleUploadClick = async () => {
        try {
            dispatch(setIsUploading(true));
            await uploadFile({
                file,
                folderId: activeDirectory.id,
            }).unwrap();
        } catch (error) {
            // Handle error
            console.error("Failed to upload file", error);
            dispatch(setIsUploading(false));
        }
    };

    return (
        <div className="flex flex-col justify-between items-center">
            <p className="truncate max-w-full">{file.name}</p>
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
