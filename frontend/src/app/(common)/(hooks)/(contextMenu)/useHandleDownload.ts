import {
    useDownloadFileQuery,
    useDownloadProgressQuery,
    useInitiateDownloadQuery,
} from "@/redux/api/driveApi";
import React, { useEffect, useState } from "react";
import { useToaster } from "../(toaster)/useToaster";

type DownloadPhase =
    | "initiate download"
    | "poll download progress"
    | "download file";

const EMPTY_IDENTIFIER = "";

const useHandleDownload = () => {
    /*
    returns a function that initiates download of a file
    the function will receive the node id as an argument
    the process of downloading is as follows:
    'initiate download': send GET request to /download/init/:nodeId and receive jobId.
    'download progress': send GET request to /download/progress/:nodeId to get the download progress. (polling) until reaches 100%.
    'download file': send GET request to /download/:nodeId to download the file.
    use useEffect to switch between the above steps.
    */

    const toaster = useToaster();

    const [nodeId, setNodeId] = useState(EMPTY_IDENTIFIER);
    const [phase, setPhase] = useState<DownloadPhase>("initiate download");
    const [_jobId, setJobId] = useState<string>(EMPTY_IDENTIFIER);
    const [anyErrors, setAnyErrors] = useState(false);
    const { data: jobIdWrapper } = useInitiateDownloadQuery(
        { nodeId },
        { skip: phase !== "initiate download" || nodeId === EMPTY_IDENTIFIER }
    );

    const { data: progress, error: progressError } = useDownloadProgressQuery(
        { jobId: jobIdWrapper?.job_id },
        {
            skip:
                phase !== "poll download progress" ||
                nodeId === EMPTY_IDENTIFIER ||
                anyErrors,
            pollingInterval: 200,
        }
    );

    const { data: file } = useDownloadFileQuery(
        { jobId: _jobId },
        { skip: phase !== "download file" || _jobId === EMPTY_IDENTIFIER }
    );

    useEffect(() => {
        if (nodeId !== EMPTY_IDENTIFIER) {
            switch (phase) {
                case "initiate download":
                    if (jobIdWrapper?.job_id) {
                        setPhase("poll download progress");
                        setJobId(jobIdWrapper.job_id);
                    }
                    break;
                case "poll download progress":
                    if (progress?.progress === 100) {
                        setPhase("download file");
                    } else if (progressError) {
                        setAnyErrors(true);
                        setNodeId(EMPTY_IDENTIFIER);
                        setPhase("initiate download");
                    } else {
                        toaster.showProgress(
                            nodeId,
                            "Deserializing...",
                            progress?.progress || 0,
                            () => {}
                        );
                    }

                    break;
                case "download file":
                    if (file) {
                        const url = window.URL.createObjectURL(file);
                        const a = document.createElement("a");
                        a.href = url;
                        a.download = file.name;
                        a.click();
                        window.URL.revokeObjectURL(url);
                        setNodeId(EMPTY_IDENTIFIER);
                        setPhase("initiate download");
                    }
                    break;
            }
        }
    }, [nodeId, phase, jobIdWrapper, _jobId, progress, file]);

    return (nodeId: string) => {
        setNodeId(nodeId);
        setPhase("initiate download");
    };
};

export default useHandleDownload;
