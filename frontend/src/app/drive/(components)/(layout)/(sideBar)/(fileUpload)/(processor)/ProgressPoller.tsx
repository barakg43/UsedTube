import { useGetUploadProgressQuery } from "@/redux/api/driveApi";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import React, { useEffect } from "react";

const ProgressPoller = () => {
    const dispatch = useAppDispatch();
    const jobId = useAppSelector((state) => state.fileUpload.jobId);
    const progress = useAppSelector((state) => state.fileUpload.progress);
    const { data, isUninitialized, refetch } = useGetUploadProgressQuery({
        jobId,
    });

    // this component will poll server for the progress of file upload
    // by using timeout, it will refetch the progress every 0.5 second
    // if the progress is not 100, it will keep polling
    // if the progress is 100, it will stop polling, and dispatch nextPhase
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
