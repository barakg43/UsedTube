import { httpClient } from "@/axios";
import {
  useDownloadProgressQuery,
  useInitiateDownloadMutation,
} from "@/redux/api/driveApi";
import { useCallback, useEffect, useState } from "react";
import { useToaster } from "../(toaster)/useToaster";
import { axiosQueryReauth } from "@/redux/baseApi";

type DownloadPhase = "waiting_download" | "on_progress";
//   | "download file";

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

  //   const [nodeId, setNodeId] = useState(EMPTY_IDENTIFIER);
  const [phase, setPhase] = useState<DownloadPhase>("waiting_download");
  const [jobId, setJobId] = useState<string>(EMPTY_IDENTIFIER);
  const [initDownload] = useInitiateDownloadMutation();

  const { data: progress, error: progressError } = useDownloadProgressQuery(
    { jobId: jobId },
    {
      skip: phase !== "on_progress" || jobId === EMPTY_IDENTIFIER,
      pollingInterval: 500,
    }
  );

  //   useEffect(() => {
  //     if (jobId !== EMPTY_IDENTIFIER && phase === "initiate download") {
  //       if (jobId.length > 0) {
  //         setPhase("poll download progress");
  //         // console.log("new job id", jobIdWrapper.job_id);
  //         // setJobId(jobIdWrapper.job_id);
  //       }
  //     }
  //   }, [nodeId]);
  useEffect(() => {
    // if(phase=="on_progress" && jobId===EMPTY_IDENTIFIER )
    console.log(
      "phase:",
      phase,
      "length:",
      jobId.length,
      "job_id",
      jobId,
      "progress",
      progress?.progress
    );
    if (jobId.length === 0) return;
    if (progress?.progress === 1.0) {
      toaster.showProgress(jobId, "100% Preparing done", 100);
      setPhase("waiting_download");
      // setNodeId(EMPTY_IDENTIFIER);
      setJobId(EMPTY_IDENTIFIER);
      downloadFile(`/files/download/${jobId}`);
    } else if (progressError) {
      // setNodeId(EMPTY_IDENTIFIER);
      setPhase("waiting_download");
      setJobId(EMPTY_IDENTIFIER);
    } else if (phase == "on_progress") {
      toaster.showProgress(
        jobId,
        `${new Number(progress?.progress * 100).toFixed(
          2
        )}% Preparing download...`,
        progress?.progress || 0,
        () => {}
      );
    }
  }, [jobId, progress, phase, progressError, toaster]);

  const onDownloadInit = useCallback(
    (nodeId: string) => {
      initDownload({ nodeId })
        .unwrap()
        .then(({ job_id }) => {
          setJobId(job_id);
          setPhase("on_progress");
        })
        .catch(() => {
          toaster.toaster("Failed to initiate download", "error");
        });
    },
    [initDownload, setJobId, setPhase, toaster]
  );
  //   .unwrap()
  //   .then((_) => {
  //       if (type === FOLDER) {
  //           refetchDirsTree();
  //       }
  //       refetchDirContent();
  //       message = `successfully deleted ${name}`;
  //       variant = "success";
  //   })
  //   .catch((_) => {
  //       message = `failed to delete ${name}`;
  //       variant = "error";
  //   })
  //   .finally(() => {
  //       toaster(message, variant);
  //   });
  // console.log("result id ", result);
  // setJobId(EMPTY_IDENTIFIER);
  // setPhase("waiting_download");

  //   useEffect(() => {
  //     console.log(
  //       "phase:",
  //       phase,
  //       "nodeId:",
  //       jobId,
  //       "job_id",
  //       jobId,
  //       "progress",
  //       progress?.progress
  //     );
  //     if (jobId !== EMPTY_IDENTIFIER) {
  //       switch (phase) {
  //         case "initiate download":
  //           if (jobId.length > 0) {
  //             setPhase("poll download progress");
  //             // console.log("new job id", jobIdWrapper.job_id);
  //             // setJobId(jobIdWrapper.job_id);
  //           }
  //           break;
  //         case "poll download progress":
  //           break;
  //         case "download file":
  //           if (jobId.length > 0) {
  //             toaster.showProgress(jobId, "100% Preparing done", 100);
  //             setPhase("initiate download");
  //             // setNodeId(EMPTY_IDENTIFIER);
  //             setJobId(EMPTY_IDENTIFIER);
  //             downloadFile(`/files/download/${jobId}`);
  //           }

  //           break;
  //       }
  //     }
  //   }, [
  //     // nodeId,
  //     phase,
  //     // jobIdWrapper,
  //     jobId,
  //     progress,
  //     toaster,
  //     progressError,
  //     setPhase,
  //     // setNodeId,
  //     setJobId,
  //   ]);

  return onDownloadInit;
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
