"use client";
import { useSelector, useDispatch } from "react-redux";
import { nextPhase, setProgress } from "@/redux/slices/fileUploadSlice";
import { RootState } from "@/redux/store";
import useGapi from "./useGapi";
import { httpClient } from "@/axios";
import { randomUUID } from "crypto";

type MetaData = {
    snippet: { title: string; description: string };
    status: { privacyStatus: string };
};

const useUploadToYoutube = (fileSize: number) => {
    const dispatch = useDispatch();
    const serializedVideo = useSelector(
        (state: RootState) => state.fileUpload.serializedVideoOfSelectedFile
    );
    const gapiLoaded = useGapi();

    const signIn = async () => {
        if (!gapiLoaded) return;

        const authInstance = window.gapi.auth2.getAuthInstance();
        await authInstance.signIn();
    };

    const uploadToYoutube = async () => {
        if (!serializedVideo || !gapiLoaded) return;

        const authInstance = window.gapi.auth2.getAuthInstance();

        const user = authInstance.currentUser.get();
        const accessToken = user.getAuthResponse().access_token;

        const metadata = createMetaData(fileSize);
        const form = createForm(metadata, serializedVideo);

        try {
            const response = await httpClient.post(
                "https://www.googleapis.com/upload/youtube/v3/videos?part=snippet,status",
                form,
                {
                    headers: {
                        Authorization: `Bearer ${accessToken}`,
                        "Content-Type": "multipart/form-data",
                    },
                    onUploadProgress: (evt) => {
                        if (evt.total) {
                            const progress = (evt.loaded / evt.total) * 100;
                            dispatch(setProgress(Math.round(progress)));
                        }
                    },
                }
            );

            if (response.status === 200) {
                console.log("Video uploaded successfully");
                dispatch(nextPhase());
            } else {
                console.error("Error uploading video", response.data);
            }
        } catch (error) {
            console.error("Error uploading video to YouTube", error);
        }
    };

    return { uploadToYoutube, signIn };
};

export default useUploadToYoutube;

function createForm(metadata: MetaData, serializedVideo: File) {
    const form = new FormData();
    form.append(
        "snippet",
        new Blob([JSON.stringify(metadata)], { type: "application/json" })
    );
    form.append("video", serializedVideo);
    return form;
}

function createMetaData(fileSize: number) {
    return {
        snippet: {
            title: `UsedTube - ${randomUUID()} - UsedTube - ${fileSize}MiB`,
            description: "Uploaded via API",
        },
        status: {
            privacyStatus: "unlisted",
        },
    };
}
