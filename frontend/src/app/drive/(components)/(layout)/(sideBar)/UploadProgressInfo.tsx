import React, { useEffect, useState } from "react";
import CircularProgressWithLabel from "./CircularProgressWithLabel";

const UploadProgressInfo = () => {
    const [step, setStep] = useState(1);
    const [progress, setProgress] = useState(50);
    const stepDisplay = `${step}/2`;
    const [progressLabel, setProgressLabel] = useState<number | string>(
        stepDisplay
    );

    useEffect(() => {
        const interval = setInterval(() => {
            setProgressLabel((prevProgressLabel) =>
                prevProgressLabel === stepDisplay ? progress : stepDisplay
            );
        }, 2500);
        return () => {
            clearInterval(interval);
        };
    }, [stepDisplay, progress]);

    return (
        <>
            <CircularProgressWithLabel className="my-2" label={progressLabel} />
        </>
    );
};

export default UploadProgressInfo;
