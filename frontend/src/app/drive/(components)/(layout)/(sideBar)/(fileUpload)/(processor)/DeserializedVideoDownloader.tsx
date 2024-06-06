import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { setProgress } from "@/redux/slices/fileUploadSlice";
import React, { useEffect, useState } from "react";

const DeserializedVideoDownloader = () => {
    const [rerun, initiateRerun] = useState(false);
    const dispatch = useAppDispatch();
    const jobId = useAppSelector((state) => state.fileUpload.jobId);
    dispatch(setProgress(0));

    // use axios/fetch to download the video

    return <></>;
};

export default DeserializedVideoDownloader;
