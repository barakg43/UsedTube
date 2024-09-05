import { httpClient } from "@/axios";
import {
  useDownloadProgressQuery,
  useInitiateDownloadQuery,
} from "@/redux/api/driveApi";
import { useEffect, useState } from "react";
import { useToaster } from "../(toaster)/useToaster";
import { axiosQueryReauth } from "@/redux/baseApi";

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
  const { data: jobIdWrapper } = useInitiateDownloadQuery(
    { nodeId },
    { skip: phase !== "initiate download" || nodeId === EMPTY_IDENTIFIER }
  );

  const { data: progress, error: progressError } = useDownloadProgressQuery(
    { jobId: jobIdWrapper?.job_id },
    {
      skip: phase !== "poll download progress" || nodeId === EMPTY_IDENTIFIER,
      pollingInterval: 200,
    }
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
          if (progress?.progress === 1.0) {
            setPhase("download file");
          } else if (progressError) {
            setNodeId(EMPTY_IDENTIFIER);
            setPhase("initiate download");
          } else {
            toaster.showProgress(
              nodeId,
              `${new Number(progress?.progress * 100).toFixed(
                2
              )}% Preparing download...`,
              progress?.progress || 0,
              () => {}
            );
          }

          break;
        case "download file":
          toaster.showProgress(nodeId, `100% Preparing done`, 100);
          setNodeId(EMPTY_IDENTIFIER);
          setPhase("initiate download");
          setJobId(EMPTY_IDENTIFIER);
          downloadFile(`/files/download/${_jobId}`);
          break;
      }
    }
  }, [nodeId, phase, jobIdWrapper, _jobId, progress, toaster, progressError]);

  return (nodeId: string) => {
    setNodeId(nodeId);
    setJobId(EMPTY_IDENTIFIER);
    setPhase("initiate download");
  };
};

export default useHandleDownload;
async function downloadFile(url: string) {
  const response = await axiosQueryReauth({
    url,
    method: "GET",
    responseType: "blob",
  });
  if (!response.headers) return;
  // create file link in browser's memory
  const href = window.URL.createObjectURL(
    new Blob([response.data], { type: response.headers?.["content-type"] })
  );
  const filename = response.headers?.["content-disposition"]
    .split("=")[1]
    .replace(/"/g, "");
  // create "a" HTML element with href to file & click
  const link = document.createElement("a");
  link.href = href;
  link.setAttribute("download", filename);
  document.body.appendChild(link);
  link.click();

  // clean up "a" element & remove ObjectURL
  document.body.removeChild(link);
  URL.revokeObjectURL(href);
}
