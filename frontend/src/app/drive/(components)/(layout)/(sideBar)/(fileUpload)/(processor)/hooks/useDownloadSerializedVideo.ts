import { useDispatch } from "react-redux";
import {
    setProgress,
    nextPhase,
    setSerializedVideoSize,
    setSerializedVideoOfSelectedFile,
} from "@/redux/slices/fileUploadSlice";
import { httpClient } from "@/axios";
import { AxiosResponse, AxiosProgressEvent } from "axios";

const useDownloadSerializedVideo = (jobId: string) => {
    const dispatch = useDispatch();

    const resetProgress = () => {
        dispatch(setProgress(0));
    };

    const handleDownloadProgress = (progressEvent: AxiosProgressEvent) => {
        if (!progressEvent.total) return;
        const progress = Math.round(
            (progressEvent.loaded * 100) / progressEvent.total
        );
        dispatch(setProgress(progress));
    };

    const fetchSerializedVideo = async (
        url: string
    ): Promise<AxiosResponse<Blob>> => {
        const response = await httpClient.get(url, {
            responseType: "blob",
            onDownloadProgress: handleDownloadProgress,
        });
        dispatch(setSerializedVideoSize(response.data.size));
        return response;
    };

    const createDownloadLink = (blob: Blob): HTMLAnchorElement => {
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.setAttribute("download", "video.mp4");
        document.body.appendChild(link);
        return link;
    };

    const triggerDownload = (
        link: HTMLAnchorElement,
        callback: (file: File) => void
    ) => {
        link.click();
        document.body.removeChild(link);
        link.addEventListener("click", () => {
            const url = link.href;
            const fileName = link.getAttribute("download");
            const xhr = new XMLHttpRequest();
            xhr.open("GET", url, true);
            xhr.responseType = "blob";
            xhr.onload = () => {
                const blob = xhr.response;
                const file = new File(
                    [blob],
                    fileName ? fileName : "video.mp4"
                );
                // Invoke the callback with the file object
                callback(file);
            };
            xhr.send();
        });
    };

    const handleDownloadError = (error: unknown) => {
        console.log("Failed to download file", error);
    };

    const downloadSerializedVideo = async () => {
        resetProgress();
        try {
            const url = `${process.env.NEXT_PUBLIC_HOST}/files/retrieve/${jobId}`;
            const response = await fetchSerializedVideo(url);
            const link = createDownloadLink(new Blob([response.data]));
            triggerDownload(link, (file) => {
                dispatch(setSerializedVideoOfSelectedFile(file));
                dispatch(nextPhase());
            });
        } catch (error) {
            handleDownloadError(error);
        }
    };

    return { downloadSerializedVideo };
};

export default useDownloadSerializedVideo;
