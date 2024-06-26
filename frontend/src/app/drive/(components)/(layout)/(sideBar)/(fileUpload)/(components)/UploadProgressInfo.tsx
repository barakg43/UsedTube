import React, { useEffect, useState } from "react";
import CircularProgressWithLabel from "./CircularProgressWithLabel";
import {
    useGetSerializationProgressQuery,
    useGetUploadProgressQuery,
} from "@/redux/api/driveApi";
import { useAppSelector } from "@/redux/hooks";

const UploadProgressInfo = () => {
    const jobId = useAppSelector((state) => state.fileUpload.jobId);

    const { data: ser_data } = useGetSerializationProgressQuery(
        {
            jobId,
        },
        { skip: true }
    );

    const { data: upload_data } = useGetUploadProgressQuery(
        { jobId },
        { skip: true }
    );

    let phase = 1;

    const phaseDisplay = `${phase} / 2`;

    const [progressLabel, setProgressLabel] = useState<number | string>(
        phaseDisplay
    );

    const relevant_progress = () => {
        if (ser_data?.progress && ser_data?.progress !== 100) {
            return ser_data.progress;
        } else if (upload_data?.progress) {
            return upload_data?.progress;
        }
        return 0;
    };

    // interval to switch between progress and step display
    useEffect(() => {
        const interval = setInterval(() => {
            setProgressLabel((prevProgressLabel) =>
                prevProgressLabel === phaseDisplay
                    ? relevant_progress()
                    : phaseDisplay
            );
        }, 1000);
        return () => {
            clearInterval(interval);
        };
    }, [phaseDisplay, ser_data, upload_data]);

    return (
        <>
            <CircularProgressWithLabel className="my-2" label={progressLabel} />
        </>
    );
};

export default UploadProgressInfo;
