import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { setProgress } from "@/redux/slices/fileUploadSlice";
import React, { useEffect, useState } from "react";
import axios from "axios";
import api_root from "@/config";

const DeserializedVideoDownloader = () => {
    const dispatch = useAppDispatch();
    const jobId = useAppSelector((state) => state.fileUpload.jobId);
    dispatch(setProgress(0));

    useEffect(() => {
        const downloadFile = async () => {
            try {
                const response = await axios.get(
                    `${api_root}/files/retrieve/${jobId}`,
                    {
                        responseType: "blob",
                        onDownloadProgress: (progressEvent) => {
                            if (!progressEvent.total) return;
                            const progress = Math.round(
                                (progressEvent.loaded * 100) /
                                    progressEvent.total
                            );
                            dispatch(setProgress(progress));
                        },
                    }
                );
                const url = window.URL.createObjectURL(
                    new Blob([response.data])
                );
                const link = document.createElement("a");
                link.href = url;
                link.setAttribute("download", "video.mp4");
                document.body.appendChild(link);
                link.click();
            } catch (error) {
                console.log("Failed to download file");
            }
        };
        downloadFile();
    }, []);

    return <></>;
};

export default DeserializedVideoDownloader;
