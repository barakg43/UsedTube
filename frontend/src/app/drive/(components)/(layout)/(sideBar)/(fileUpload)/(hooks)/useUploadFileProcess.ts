"use client";
import { useEffect } from "react";
import {
    UPLOAD_PLAIN_FILE_TO_SERVER,
    WAIT_FOR_SERVER_TO_SERIALIZE,
    FETCH_FILE_METADATA,
    WAIT_FOR_SERVER_TO_UPLOAD,
} from "@/constants";
import { useAppSelector } from "@/redux/hooks";
import useUploadPlainFileToServer from "./useUploadPlainFileToServer";
import useWaitForServerToSerialize from "./useWaitForServerToSerialize";
import { RootState } from "@/redux/store";
import { useFetchFileMetaData } from "./useFetchFileMetaData";
import { useWaitForServerToUpload } from "./useWaitForServerToUpload";

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

    const { waitForServerToSerialize, stopSerializationPolling } =
        useWaitForServerToSerialize();

    const { waitForServerToUpload, stopUploadPolling } =
        useWaitForServerToUpload();

    const { fetchFileMetaData } = useFetchFileMetaData();

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
                    stopSerializationPolling();
                    waitForServerToUpload();
                    break;
                case FETCH_FILE_METADATA:
                    stopUploadPolling();
                    fetchFileMetaData();
                    break;
            }
        }
    }, [uploadPhase, isUploading, selectedFile]);

    return null;
}
