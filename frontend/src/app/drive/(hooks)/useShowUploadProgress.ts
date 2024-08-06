import { useToaster } from "@/app/(common)/(hooks)/(toaster)/useToaster";
import { useAppSelector } from "@/redux/hooks";
import { useEffect } from "react";

const useShowUploadProgress = () => {
    const jobId = useAppSelector((state) => state.fileUpload.jobId);
    const isUploading = useAppSelector((state) => state.fileUpload.isUploading);
    const { showProgress } = useToaster();

    useEffect(() => {}, []);
};

export default useShowUploadProgress;
