"use client";
import { useState, useEffect } from "react";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { useGetUploadProgressQuery } from "@/redux/api/driveApi";
import { nextPhase, setProgress } from "@/redux/slices/fileUploadSlice";
import { WAIT_FOR_SERVER_TO_SERIALIZE } from "@/constants";

const useWaitForServerToSerialize = () => {
    const dispatch = useAppDispatch();
    const jobId = useAppSelector((state) => state.fileUpload.jobId);
    const phase = useAppSelector((state) => state.fileUpload.uploadPhase);
    const [polling, setPolling] = useState(false);
    const { data: progress } = useGetUploadProgressQuery(
        { jobId },
        { pollingInterval: 500, skip: !polling }
    );

    useEffect(() => {
        if (progress === undefined && phase === WAIT_FOR_SERVER_TO_SERIALIZE) {
            setPolling(true);
        } else if (progress === 100) {
            dispatch(nextPhase());
            setPolling(false);
        } else if (progress !== undefined) {
            dispatch(setProgress(progress));
        }
    }, [progress, phase, dispatch]);

    return { waitForServerToSerialize: () => setPolling(true) };
};

export default useWaitForServerToSerialize;
