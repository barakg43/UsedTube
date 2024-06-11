import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { setProgress, nextPhase } from "@/redux/slices/fileUploadSlice";

const useUploadToYoutube = (fileSize: number) => {
    const dispatch = useDispatch();
    const [gapiLoaded, setGapiLoaded] = useState(false);
    const [authInstance, setAuthInstance] = useState<any>(null);

    useEffect(() => {
        const loadGapi = () => {
            gapi.load("client:auth2", () => {
                gapi.client
                    .init({
                        apiKey: process.env.NEXT_PUBLIC_GOOGLE_API_KEY,
                        clientId: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID,
                        discoveryDocs: [
                            "https://www.googleapis.com/discovery/v1/apis/youtube/v3/rest",
                        ],
                        scope: "https://www.googleapis.com/auth/youtube.upload",
                    })
                    .then(() => {
                        const authInstance = gapi.auth2.getAuthInstance();
                        setAuthInstance(authInstance);
                        setGapiLoaded(true);
                    });
            });
        };

        loadGapi();
    }, []);

    const signIn = () => {
        if (authInstance) {
            authInstance.signIn().then((user: any) => {
                console.log("Signed in:", user);
            });
        }
    };

    const uploadToYoutube = async (file: File) => {
        if (!authInstance || !gapiLoaded) return;

        const accessToken = authInstance.currentUser
            .get()
            .getAuthResponse().access_token;

        const metadata = {
            snippet: {
                title: "Uploaded Video",
                description: "Uploaded via API",
                tags: ["tag1", "tag2"],
            },
            status: {
                privacyStatus: "private",
            },
        };

        const form = new FormData();
        form.append(
            "snippet",
            new Blob([JSON.stringify(metadata)], { type: "application/json" })
        );
        form.append("video", file);

        const response = await fetch(
            "https://www.googleapis.com/upload/youtube/v3/videos?part=snippet,status",
            {
                method: "POST",
                headers: new Headers({
                    Authorization: `Bearer ${accessToken}`,
                }),
                body: form,
            }
        );

        if (response.ok) {
            console.log("Video uploaded successfully");
            dispatch(nextPhase());
        } else {
            console.error("Error uploading video");
        }
    };

    return { uploadToYoutube, signIn };
};

export default useUploadToYoutube;
