import { useGetUploadProgressQuery } from "@/redux/api/driveApi";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import React, { useEffect } from "react";

const ProgressPoller = () => {
    const jobId = useAppSelector((state) => state.fileUpload.jobId);
    const progress = useAppSelector((state) => state.fileUpload.progress);
    const { isUninitialized, refetch } = useGetUploadProgressQuery({
        jobId,
    });
    const pollingAction = () => {
        if (!isUninitialized) {
            refetch();
        }
        if (progress) {
            if (progress < 100) setTimeout(pollingAction, 500);
        }
    };
    useEffect(() => {
        setTimeout(() => {
            pollingAction();
        }, 500);
    }, []);

    return <></>;
};

export default ProgressPoller;
