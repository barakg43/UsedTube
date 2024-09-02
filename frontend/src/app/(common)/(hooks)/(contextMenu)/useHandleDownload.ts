import {
    useDownloadFileQuery,
    useDownloadProgressQuery,
    useInitiateDownloadQuery,
} from "@/redux/api/driveApi";
import React, { useEffect, useState } from "react";

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
    const [nodeId, setNodeId] = useState(EMPTY_IDENTIFIER);
    const [phase, setPhase] = useState<DownloadPhase>("initiate download");

    const { data: jobId } = useInitiateDownloadQuery(
        { nodeId },
        { skip: phase !== "initiate download" || nodeId === EMPTY_IDENTIFIER }
    );

    const { data: progress } = useDownloadProgressQuery(
        { jobId },
        { skip: phase !== "poll download progress", pollingInterval: 200 }
    );

    const { data: file } = useDownloadFileQuery({ jobId });

    useEffect(() => {
        if (nodeId !== EMPTY_IDENTIFIER) {
            switch (phase) {
                case "initiate download":
                    if (jobId) {
                        setPhase("poll download progress");
                    }
                    break;
                case "poll download progress":
                    if (progress?.progress === 100) {
                        setPhase("download file");
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
    }, [nodeId, phase]);

    return (nodeId: string) => {
        setNodeId(nodeId);
        setPhase("initiate download");
    };
};

export default useHandleDownload;
