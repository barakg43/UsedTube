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
    const [identifier, setIdentifier] = useState(EMPTY_IDENTIFIER);
    const [phase, setPhase] = useState<DownloadPhase>("initiate download");

    useEffect(() => {
        if (identifier !== EMPTY_IDENTIFIER) {
            switch (phase) {
                case "initiate download":
                    // initiate download
                    break;
                case "poll download progress":
                    // poll download progress
                    break;
                case "download file":
                    setIdentifier(EMPTY_IDENTIFIER);
                    break;
            }
        }
    }, [identifier, phase]);

    return (nodeId: string) => {
        setIdentifier(nodeId);
        setPhase("initiate download");
    };
};

export default useHandleDownload;
