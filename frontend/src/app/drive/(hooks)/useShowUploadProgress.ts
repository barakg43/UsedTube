"use client";
import { useToaster } from "@/app/(common)/(hooks)/(toaster)/useToaster";
import {
  useCancelUploadMutation,
  useFolderContentQuery,
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

  const { refetch } = useFolderContentQuery({
    folderId: useAppSelector((state) => state.items.activeDirectoryId),
  });

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
      showProgress(
        jobId,
        `${new Number(data.progress * 100).toFixed(2)}% Uploading file...`,
        data.progress,
        onCancel
      );
      if (data.progress === 1) {
        toaster("Upload complete", "success");
        dispatch(setIsUploading(false));
        refetch();
      }
    }
  }, [data, isUploading, jobId]);

  const startUploadProgress = () => {
    dispatch(setIsUploading(true));
  };

  return { startUploadProgress };
};

export default useShowUploadProgress;
