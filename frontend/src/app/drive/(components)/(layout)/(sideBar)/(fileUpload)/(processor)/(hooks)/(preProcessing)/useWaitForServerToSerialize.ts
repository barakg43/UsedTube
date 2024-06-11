import { useState, useEffect } from "react";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { useGetUploadProgressQuery } from "@/redux/api/driveApi";
import { nextPhase, setProgress } from "@/redux/slices/fileUploadSlice";

const useWaitForServerToSerialize = () => {
    const dispatch = useAppDispatch();
    const jobId = useAppSelector((state) => state.fileUpload.jobId);
    const [polling, setPolling] = useState(false);
    const { data: progress } = useGetUploadProgressQuery(
        { jobId },
        { pollingInterval: 500, skip: !polling }
    );

    useEffect(() => {
        if (progress === undefined) {
            setPolling(true);
        } else if (progress === 100) {
            dispatch(nextPhase());
            setPolling(false);
        } else if (progress !== undefined) {
            dispatch(setProgress(progress));
        }
    }, [progress, dispatch]);

    return { waitForServerToSerialize: () => setPolling(true) };
};

export default useWaitForServerToSerialize;
