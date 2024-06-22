"use client";
import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { useGetUploadProgressQuery } from "@/redux/api/driveApi";
import { nextPhase, setPolling } from "@/redux/slices/fileUploadSlice";
import { WAIT_FOR_SERVER_TO_UPLOAD } from "@/constants";

const useWaitForServerToUpload = () => {
    const dispatch = useAppDispatch();
    const jobId = useAppSelector((state) => state.fileUpload.jobId);
    const phase = useAppSelector((state) => state.fileUpload.uploadPhase);
    const polling = useAppSelector((state) => state.fileUpload.polling);

    const {
        data: { progress },
    } = useGetUploadProgressQuery(
        { jobId },
        { pollingInterval: 500, skip: !polling }
    );

    useEffect(() => {
        if (phase === WAIT_FOR_SERVER_TO_UPLOAD && progress === 100) {
            dispatch(nextPhase());
            dispatch(setPolling(false));
        }
    }, [progress, phase, dispatch]);

    return { waitForServerToUpload: () => dispatch(setPolling(true)) };
};

export default useWaitForServerToUpload;
