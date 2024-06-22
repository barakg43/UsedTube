"use client";
import { useEffect } from "react";
import {
    UPLOAD_PLAIN_FILE_TO_SERVER,
    WAIT_FOR_SERVER_TO_UPLOAD,
    FETCH_FILE_METADATA,
} from "@/constants";
import { useAppSelector } from "@/redux/hooks";
import useUploadPlainFileToServer from "./useUploadPlainFileToServer";
import useWaitForServerToUpload from "./useWaitForServerToSerialize";
import { RootState } from "@/redux/store";
import { useFetchFileMetaData } from "./useFetchFileMetaData";

export function useUploadFileProcess() {
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
    const { waitForServerToUpload } = useWaitForServerToUpload();
    const { fetchFileMetaData } = useFetchFileMetaData();

    useEffect(() => {
        if (isUploading && selectedFile) {
            switch (uploadPhase) {
                case UPLOAD_PLAIN_FILE_TO_SERVER:
                    uploadPlainFileToServer();
                    break;
                case WAIT_FOR_SERVER_TO_UPLOAD:
                    waitForServerToUpload();
                    break;
                case FETCH_FILE_METADATA:
                    fetchFileMetaData();
                    break;
            }
        }
    }, [uploadPhase, isUploading, selectedFile]);

    return null;
}
