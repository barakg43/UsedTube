import { useUploadFileMutation } from "@/redux/api/driveApi";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { nextPhase } from "@/redux/slices/fileUploadSlice";
import React, { useEffect } from "react";

const FileUploader = () => {
    const [uploadFile] = useUploadFileMutation();
    const selectedFile = useAppSelector((state) => state.fileUpload.file);
    const activeDirectory = useAppSelector(
        (state) => state.items.activeDirectory
    );
    const dispatch = useAppDispatch();
    useEffect(() => {
        if (selectedFile) {
            try {
                uploadFile({
                    file: selectedFile,
                    folderId: activeDirectory.id,
                })
                    .unwrap()
                    .then(() => dispatch(nextPhase()));
            } catch (error) {
                console.log("Failed to upload file");
            }
        }
    }, []);

    return <></>;
};

export default FileUploader;
