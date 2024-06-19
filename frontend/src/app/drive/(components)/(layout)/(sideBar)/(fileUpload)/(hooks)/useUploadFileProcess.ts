"use client";
import { useEffect } from "react";
import {
    DOWNLOAD_SERIALIZED_VIDEO as WAIT_FOR_SERVER_TO_UPLOAD,
    UPLOAD_PLAIN_FILE_TO_SERVER,
    UPLOAD_TO_SELECTED_PROVIDER as FETCH_FILE_METADATA,
    WAIT_FOR_SERVER_TO_SERIALIZE,
} from "@/constants";
import { useAppSelector } from "@/redux/hooks";
import useUploadPlainFileToServer from "./useUploadPlainFileToServer";
import useWaitForServerToSerialize from "./useWaitForServerToSerialize";
import { RootState } from "@/redux/store";

export function useUploadFileProcess() {
    const jobId = useAppSelector((state: RootState) => state.fileUpload.jobId);

    const uploadPhase = useAppSelector(
        (state: RootState) => state.fileUpload.uploadPhase
    );
    const isUploading = useAppSelector(
        (state: RootState) => state.fileUpload.isUploading
    );
    const selectedFile = useAppSelector(
        (state: RootState) => state.fileUpload.fileToUpload
    );

    const { uploadPlainFileToServer } = useUploadPlainFileToServer();
    const { waitForServerToSerialize } = useWaitForServerToSerialize();

    useEffect(() => {
        if (isUploading && selectedFile) {
            switch (uploadPhase) {
                case UPLOAD_PLAIN_FILE_TO_SERVER:
                    uploadPlainFileToServer();
                    break;
                case WAIT_FOR_SERVER_TO_SERIALIZE:
                    waitForServerToSerialize();
                    break;
                case WAIT_FOR_SERVER_TO_UPLOAD:
                    throw new Error("reimplemented");
                    break;
                case FETCH_FILE_METADATA:
                    throw new Error("reimplemented");
                    break;
            }
        }
    }, [uploadPhase, isUploading, selectedFile]);

    return null;
}
