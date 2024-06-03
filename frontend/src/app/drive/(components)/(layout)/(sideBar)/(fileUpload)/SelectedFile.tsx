"use client";
import React, { FC } from "react";
import CloseIcon from "@mui/icons-material/Close";
import CheckIcon from "@mui/icons-material/Check";
import { grey } from "@mui/material/colors";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { setFile, setIsUploading } from "@/redux/slices/fileUploadSlice";

import UploadProgressInfo from "./UploadProgressInfo";
import { compactFileSize } from "@/redux/slices/utils";
import FileUploadProcessor from "./FileUploadProcessor";

const SelectedFile: FC<{
    file: File;
}> = ({ file }) => {
    const dispatch = useAppDispatch();
    const isUploading = useAppSelector((state) => state.fileUpload.isUploading);

    return (
        <div className="flex flex-col justify-between items-center">
            <p className="truncate max-w-full">{file.name}</p>
            <p>{compactFileSize(file.size)}</p>
            {isUploading ? (
                <>
                    <UploadProgressInfo />
                    <FileUploadProcessor file={file} />
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

export default SelectedFile;
