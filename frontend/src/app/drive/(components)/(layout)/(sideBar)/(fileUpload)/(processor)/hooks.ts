import { useEffect, useState } from "react";
import {
    DOWNLOAD_SERIALIZED_VIDEO,
    UPLOAD_PLAIN_FILE_TO_SERVER,
    UPLOAD_TO_SELECTED_PROVIDER,
    WAIT_FOR_SERVER_TO_SERIALIZE,
} from "@/constants";
import {
    useGetUploadProgressQuery,
    useUploadFileMutation,
} from "@/redux/api/driveApi";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import {
    nextPhase,
    setFile,
    setIsUploading,
    setProgress,
} from "@/redux/slices/fileUploadSlice";
import { httpClient } from "@/axios";

export function useUploadFileProcess() {
    const dispatch = useAppDispatch();
    const selectedFile = useAppSelector((state) => state.fileUpload.file);
    const uploadPhase = useAppSelector((state) => state.fileUpload.uploadPhase);
    const isUploading = useAppSelector((state) => state.fileUpload.isUploading);
    const activeDirectoryId = useAppSelector(
        (state) => state.items.activeDirectoryId
    );
    const jobId = useAppSelector((state) => state.fileUpload.jobId);
    const [uploadFile] = useUploadFileMutation();
    const [polling, setPolling] = useState(false);
    const { data: progress } = useGetUploadProgressQuery(
        {
            jobId,
        },
        {
            pollingInterval: 500,
            skip: !polling,
        }
    );

    const uploadPlainFile = () => {
        if (!selectedFile) {
            alert("No file selected");
            return;
        }
        try {
            uploadFile({
                file: selectedFile,
                folderId: activeDirectoryId,
            })
                .unwrap()
                .then(() => dispatch(nextPhase()));
        } catch (error) {
            console.log("Failed to upload file");
        }
    };

    const updateProgress = () => {
        if (progress && progress === 100) {
            dispatch(nextPhase());
            setPolling(false);
        } else if (progress === undefined) {
            setPolling(true);
        } else if (progress) {
            dispatch(setProgress(progress));
        }
    };

    const downloadFile = async () => {
        dispatch(setProgress(0));
        try {
            const response = await httpClient.get(
                `${process.env.NEXT_PUBLIC_HOST}/files/retrieve/${jobId}`,
                {
                    responseType: "blob",
                    onDownloadProgress: (progressEvent) => {
                        if (!progressEvent.total) return;
                        const progress = Math.round(
                            (progressEvent.loaded * 100) / progressEvent.total
                        );
                        dispatch(setProgress(progress));
                    },
                }
            );

            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement("a");
            link.href = url;
            link.setAttribute("download", "video.mp4");
            document.body.appendChild(link);
            link.click();
            dispatch(nextPhase());
        } catch (error) {
            console.log("Failed to download file");
        }
    };

    useEffect(() => {
        if (isUploading && selectedFile) {
            switch (uploadPhase) {
                case UPLOAD_PLAIN_FILE_TO_SERVER:
                    uploadPlainFile();
                    break;

                case WAIT_FOR_SERVER_TO_SERIALIZE:
                    updateProgress();
                    break;

                case DOWNLOAD_SERIALIZED_VIDEO:
                    downloadFile();
                    break;

                case UPLOAD_TO_SELECTED_PROVIDER:
                    alert("UPLOAD TO SELECTED PROVIDER");
                    break;
            }
        }
    }, [uploadPhase, isUploading, progress]);
}
