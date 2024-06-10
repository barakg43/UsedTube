"use client";
import React from "react";
import CloseIcon from "@mui/icons-material/Close";
import CheckIcon from "@mui/icons-material/Check";
import { grey } from "@mui/material/colors";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { setFile, setIsUploading } from "@/redux/slices/fileUploadSlice";
import UploadProgressInfo from "./UploadProgressInfo";
import { compactFileSize } from "@/redux/slices/utils";
import { useUploadFileProcess } from "./(processor)/hooks/hooks";
import { UPLOAD_TO_SELECTED_PROVIDER } from "@/constants";

const SelectedFileCard = () => {
    const dispatch = useAppDispatch();
    const isUploading = useAppSelector((state) => state.fileUpload.isUploading);
    const selectedFile = useAppSelector((state) => state.fileUpload.file);
    const uploadPhase = useAppSelector((state) => state.fileUpload.uploadPhase);
    useUploadFileProcess();
    if (!selectedFile) return null;

    return (
        <div className="flex flex-col justify-between items-center">
            <p className="truncate max-w-full">{selectedFile.name}</p>
            <p>{compactFileSize(selectedFile.size)}</p>
            {isUploading ? (
                <>
                    <UploadProgressInfo />
                    {/* {uploadPhase === UPLOAD_TO_SELECTED_PROVIDER && (
                        <SelectProvider />
                    )} */}
                </>
            ) : (
                <div className="flex flex-row justify-center w-full">
                    <div className="items-center flex-grow">
                        <button>
                            <CheckIcon
                                sx={{
                                    color: "black",
                                    "&:hover": { color: grey },
                                }}
                                onClick={() => dispatch(setIsUploading(true))}
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

export default SelectedFileCard;
