import React, { useEffect, useState } from "react";
import CircularProgressWithLabel from "./CircularProgressWithLabel";
import { useAppSelector } from "@/redux/hooks";

const UploadProgressInfo = () => {
    const [step, setStep] = useState(1);
    const progress = useAppSelector((state) => state.fileUpload.progress);
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

    useEffect(() => {
        if (progress === 100) {
            setStep(2);
        }
    }, [progress]);

    return (
        <>
            <CircularProgressWithLabel className="my-2" label={progressLabel} />
        </>
    );
};

export default UploadProgressInfo;
