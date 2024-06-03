import {
    useGetUploadProgressQuery,
    useUploadFileMutation,
    useGetSerializedVideoQuery,
} from "@/redux/api/driveApi";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { setIsUploading, setProgress } from "@/redux/slices/fileUploadSlice";
import { RootState } from "@/redux/store";
import React, { FC, useEffect, useState } from "react";

const FileUploadProcessor: FC<{
    file: File;
}> = ({ file }) => {
    const [timer, setTimer] = useState<NodeJS.Timeout | null>(null);
    const dispatch = useAppDispatch();
    const activeDirectory = useAppSelector(
        (state: RootState) => state.items.activeDirectory
    );
    const jobId = useAppSelector((state: RootState) => state.fileUpload.jobId);
    //@ts-ignore
    const [uploadFile] = useUploadFileMutation();
    const {
        data: progress,
        isUninitialized,
        refetch,
    } = useGetUploadProgressQuery({ jobId }, { skip: !jobId });

    const { data: video } = useGetSerializedVideoQuery(
        { jobId },
        { skip: progress === undefined || progress < 100 || jobId === null }
    );

    useEffect(() => {
        try {
            uploadFile({
                file,
                folderId: activeDirectory.id,
            }).unwrap();
        } catch (error) {
            dispatch(setIsUploading(false));
        }
    }, []);

    useEffect(() => {
        const timer = setInterval(() => {
            if (!isUninitialized) {
                refetch();
            }
            if (progress) {
                dispatch(setProgress(progress));
            }
        }, 1000);
        setTimer(timer);
    }, [jobId]);

    useEffect(() => {
        if (progress === 100) {
            if (timer) {
                clearInterval(timer);
                setTimer(null);
            }
            alert(video);
        }
    }, [progress]);

    return <></>;
};

export default FileUploadProcessor;
