import { useAppSelector } from "@/redux/hooks";
import { RootState } from "@/redux/store";
import React from "react";
import FileUploader from "./FileUploader";
import ProgressPoller from "./ProgressPoller";
import DeserializedVideoDownloader from "./DeserializedVideoDownloader";

const FileUploadProcessor = () => {
    const uploadPhase = useAppSelector(
        (state: RootState) => state.fileUpload.uploadPhase
    );
    const jobId = useAppSelector((state: RootState) => state.fileUpload.jobId);
    //@ts-ignore

    return (
        <>
            {uploadPhase === 0 ? (
                <FileUploader />
            ) : uploadPhase === 1 ? (
                <ProgressPoller />
            ) : uploadPhase === 2 ? (
                <DeserializedVideoDownloader />
            ) : null}
        </>
    );
};

export default FileUploadProcessor;
