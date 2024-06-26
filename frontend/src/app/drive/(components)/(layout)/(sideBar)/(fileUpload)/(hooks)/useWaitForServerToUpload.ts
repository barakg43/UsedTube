import { WAIT_FOR_SERVER_TO_UPLOAD } from "@/constants";
import { useGetUploadProgressQuery } from "@/redux/api/driveApi";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { nextPhase } from "@/redux/slices/fileUploadSlice";
import { useEffect, useState } from "react";

export function useWaitForServerToUpload() {
    const dispatch = useAppDispatch();
    const jobId = useAppSelector((state) => state.fileUpload.jobId);
    const phase = useAppSelector((state) => state.fileUpload.uploadPhase);
    const [polling, setPolling] = useState(false);
    const { data } = useGetUploadProgressQuery(
        { jobId },
        {
            pollingInterval: 500,
            skip: phase !== WAIT_FOR_SERVER_TO_UPLOAD && !polling,
        }
    );
    useEffect(() => {
        if (phase === WAIT_FOR_SERVER_TO_UPLOAD && data?.progress === 100) {
            dispatch(nextPhase());
        }
    }, [data, phase, dispatch]);

    return {
        waitForServerToUpload: () => {
            setPolling(true);
        },
        stopUploadPolling: () => {
            setPolling(false);
        },
    };
}
