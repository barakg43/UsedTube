"use client";
import { useToaster } from "@/app/(common)/(hooks)/(toaster)/useToaster";
import {
    useCancelUploadMutation,
    useGetUploadProgressQuery,
} from "@/redux/api/driveApi";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { setIsUploading } from "@/redux/slices/fileUploadSlice";
import { useEffect } from "react";

const useShowUploadProgress = () => {
    const dispatch = useAppDispatch();
    const jobId = useAppSelector((state) => state.fileUpload.jobId);
    const isUploading = useAppSelector((state) => state.fileUpload.isUploading);

    const { toaster, showProgress } = useToaster();

    // Mutation to cancel the upload
    const [cancelUpload] = useCancelUploadMutation();

    const { data } = useGetUploadProgressQuery(
        { jobId },
        { skip: !isUploading, pollingInterval: 500 }
    );

    const onCancel = () => {
        cancelUpload({ jobId });
        toaster("Upload cancelled", "info");
        dispatch(setIsUploading(false));
    };

    useEffect(() => {
        if (isUploading && data) {
            console.log("Uploading:", data);
            showProgress(jobId, "Uploading file...", data.progress, onCancel);
        }
    }, [data, isUploading, jobId]);

    const startUploadProgress = () => {
        dispatch(setIsUploading(true));
    };

    return { startUploadProgress };
};

export default useShowUploadProgress;
