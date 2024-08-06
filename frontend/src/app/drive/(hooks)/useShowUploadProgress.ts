import { useToaster } from "@/app/(common)/(hooks)/(toaster)/useToaster";
import { useGetUploadProgressQuery } from "@/redux/api/driveApi";
import { useAppSelector } from "@/redux/hooks";
import { useEffect } from "react";

const useShowUploadProgress = () => {
    const jobId = useAppSelector((state) => state.fileUpload.jobId);
    const isUploading = useAppSelector((state) => state.fileUpload.isUploading);
    const { showProgress } = useToaster();
    // query server for progress
    const { data } = useGetUploadProgressQuery(
        { jobId },
        { skip: !isUploading, pollingInterval: 500 }
    );

    // const cancelUpload = useCancelUploadMutation();
    alert(data);
    useEffect(() => {
        if (isUploading && data) {
            showProgress(jobId, "", data, cancelUpload);
        }
    }, [data]);
};

export default useShowUploadProgress;
