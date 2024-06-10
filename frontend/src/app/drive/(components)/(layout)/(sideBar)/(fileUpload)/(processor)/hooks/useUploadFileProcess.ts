import { useEffect } from "react";
import {
    DOWNLOAD_SERIALIZED_VIDEO,
    UPLOAD_PLAIN_FILE_TO_SERVER,
    UPLOAD_TO_SELECTED_PROVIDER,
    WAIT_FOR_SERVER_TO_SERIALIZE,
} from "@/constants";
import { useAppSelector } from "@/redux/hooks";

import useUploadPlainFileToServer from "./useUploadPlainFileToServer";
import useWaitForServerToSerialize from "./useWaitForServerToSerialize";
import useUploadToSelectedProvider from "./useUploadToSelectedProvider";
import useDownloadSerializedVideo from "./useDownloadSerializedVideo";

export function useUploadFileProcess() {
    const jobId = useAppSelector((state) => state.fileUpload.jobId);
    const uploadPhase = useAppSelector((state) => state.fileUpload.uploadPhase);
    const isUploading = useAppSelector((state) => state.fileUpload.isUploading);
    const selectedFile = useAppSelector(
        (state) => state.fileUpload.fileToUpload
    );

    const { downloadSerializedVideo } = useDownloadSerializedVideo(jobId);
    const { uploadPlainFileToServer } = useUploadPlainFileToServer();
    const { waitForServerToSerialize } = useWaitForServerToSerialize();
    const { uploadToSelectedProvider } = useUploadToSelectedProvider();

    useEffect(() => {
        if (isUploading && selectedFile) {
            switch (uploadPhase) {
                case UPLOAD_PLAIN_FILE_TO_SERVER:
                    uploadPlainFileToServer();
                    break;
                case WAIT_FOR_SERVER_TO_SERIALIZE:
                    waitForServerToSerialize();
                    break;
                case DOWNLOAD_SERIALIZED_VIDEO:
                    downloadSerializedVideo();
                    break;
                case UPLOAD_TO_SELECTED_PROVIDER:
                    uploadToSelectedProvider();
                    break;
                default:
                    break;
            }
        }
    }, [
        uploadPhase,
        isUploading,
        selectedFile,
        uploadPlainFileToServer,
        waitForServerToSerialize,
        downloadSerializedVideo,
        uploadToSelectedProvider,
    ]);

    return null;
}
