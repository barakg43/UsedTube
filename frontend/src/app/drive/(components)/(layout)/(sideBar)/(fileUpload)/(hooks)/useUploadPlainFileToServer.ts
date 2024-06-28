"use client";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { nextPhase } from "@/redux/slices/fileUploadSlice";
import { useUploadFileMutation } from "@/redux/api/driveApi";

const useUploadPlainFileToServer = () => {
    const dispatch = useAppDispatch();
    const selectedFile = useAppSelector(
        (state) => state.fileUpload.fileToUpload
    );
    const activeDirectoryId = useAppSelector(
        (state) => state.items.activeDirectoryId
    );
    const [uploadFile] = useUploadFileMutation();

    const uploadPlainFileToServer = async () => {
        if (!selectedFile) {
            alert("No file selected");
            return;
        }
        try {
            await uploadFile({
                file: selectedFile,
                folderId: activeDirectoryId,
            }).unwrap();
            dispatch(nextPhase());
        } catch (error) {
            console.log("Failed to upload file");
        }
    };

    return { uploadPlainFileToServer };
};

export default useUploadPlainFileToServer;
