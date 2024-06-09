import { useEffect } from "react";
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
    const progress = useAppSelector((state) => state.fileUpload.progress);
    const [uploadFile] = useUploadFileMutation();
    const { isUninitialized, refetch } = useGetUploadProgressQuery({
        jobId,
    });

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

    const pollingAction = () => {
        setTimeout(() => {
            if (!isUninitialized) {
                refetch();
            }
            if (progress) {
                if (progress < 100) setTimeout(pollingAction, 500);
                else dispatch(nextPhase());
            }
        }, 500);
    };

    const downloadFile = async () => {
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
                    pollingAction();
                    break;

                case DOWNLOAD_SERIALIZED_VIDEO:
                    dispatch(setProgress(0));
                    downloadFile();
                    dispatch(nextPhase());
                    break;

                case UPLOAD_TO_SELECTED_PROVIDER:
                    dispatch(setIsUploading(false));
                    dispatch(setFile(null));
                    dispatch(nextPhase());
                    break;
            }
        }
    }, [uploadPhase, isUploading]);
}
