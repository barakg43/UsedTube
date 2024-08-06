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
    // query server for progress
    const { data } = useGetUploadProgressQuery(
        { jobId },
        { skip: !isUploading, pollingInterval: 500 }
    );

    const [cancelUpload] = useCancelUploadMutation();

    const onCancel = () => {
        cancelUpload({ jobId });
        toaster("Upload cancelled", "info");
        dispatch(setIsUploading(false));
    };

    alert(data);
    useEffect(() => {
        if (isUploading && data) {
            showProgress(jobId, "", data, onCancel);
        }
    }, [data]);
};

export default useShowUploadProgress;
