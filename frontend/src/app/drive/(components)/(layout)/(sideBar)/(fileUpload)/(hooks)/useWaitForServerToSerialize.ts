"use client";
import { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import {
    useGetSerializationProgressQuery,
    useGetUploadProgressQuery,
} from "@/redux/api/driveApi";
import { nextPhase } from "@/redux/slices/fileUploadSlice";
import { WAIT_FOR_SERVER_TO_SERIALIZE } from "@/constants";

const useWaitForServerToSerialize = () => {
    const dispatch = useAppDispatch();
    const jobId = useAppSelector((state) => state.fileUpload.jobId);
    const phase = useAppSelector((state) => state.fileUpload.uploadPhase);
    const [polling, setPolling] = useState(false);
    const { data } = useGetSerializationProgressQuery(
        { jobId },
        {
            pollingInterval: 500,
            skip: phase !== WAIT_FOR_SERVER_TO_SERIALIZE && !polling,
        }
    );

    useEffect(() => {
        if (phase === WAIT_FOR_SERVER_TO_SERIALIZE && data?.progress === 100) {
            dispatch(nextPhase());
        }
    }, [data, phase, dispatch, polling]);

    return {
        waitForServerToSerialize: () => setPolling(true),
        stopSerializationPolling: () => setPolling(false),
    };
};

export default useWaitForServerToSerialize;
