import { useAppSelector } from "@/redux/hooks";
import { RootState } from "@/redux/store";
import React from "react";
import FileUploader from "./FileUploader";
import ProgressPoller from "./ProgressPoller";
import DeserializedVideoDownloader from "./DeserializedVideoDownloader";
import {
    DOWNLOAD_SERIALIZED_VIDEO,
    UPLOAD_PLAIN_FILE_TO_SERVER,
    UPLOAD_TO_SELECTED_PROVIDER,
    WAIT_FOR_SERVER_TO_SERIALIZE,
} from "@/constants";

const FileUploadProcessor = () => {
    const uploadPhase = useAppSelector(
        (state: RootState) => state.fileUpload.uploadPhase
    );
    const jobId = useAppSelector((state: RootState) => state.fileUpload.jobId);
    //@ts-ignore

    return (
        <>
            {uploadPhase === UPLOAD_PLAIN_FILE_TO_SERVER ? (
                <FileUploader />
            ) : uploadPhase === WAIT_FOR_SERVER_TO_SERIALIZE ? (
                <ProgressPoller />
            ) : uploadPhase === DOWNLOAD_SERIALIZED_VIDEO ? (
                <DeserializedVideoDownloader />
            ) : uploadPhase === UPLOAD_TO_SELECTED_PROVIDER ? null : null}
        </>
    );
};

export default FileUploadProcessor;
