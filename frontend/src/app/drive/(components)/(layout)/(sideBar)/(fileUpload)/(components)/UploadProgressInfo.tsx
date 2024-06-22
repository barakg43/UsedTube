import React, { useEffect, useState } from "react";
import CircularProgressWithLabel from "./CircularProgressWithLabel";
import { useGetUploadProgressQuery } from "@/redux/api/driveApi";
import { useAppSelector } from "@/redux/hooks";

const UploadProgressInfo = () => {
    const jobId = useAppSelector((state) => state.fileUpload.jobId);
    const polling = useAppSelector((state) => state.fileUpload.polling);

    const {
        data: { phase, progress },
    } = useGetUploadProgressQuery(
        { jobId },
        { pollingInterval: 500, skip: !polling }
    );

    const phaseDisplay = `${phase} / 2`;

    const [progressLabel, setProgressLabel] = useState<number | string>(
        phaseDisplay
    );

    // interval to switch between progress and step display
    useEffect(() => {
        const interval = setInterval(() => {
            setProgressLabel((prevProgressLabel) =>
                prevProgressLabel === phaseDisplay ? progress : phaseDisplay
            );
        }, 1000);
        return () => {
            clearInterval(interval);
        };
    }, [phaseDisplay, progress]);

    return (
        <>
            <CircularProgressWithLabel className="my-2" label={progressLabel} />
        </>
    );
};

export default UploadProgressInfo;
