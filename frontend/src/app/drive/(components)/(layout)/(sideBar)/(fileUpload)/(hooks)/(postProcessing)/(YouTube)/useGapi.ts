"use client";
import { useEffect, useState } from "react";

declare global {
    interface Window {
        gapi: any;
    }
}

const useGapi = () => {
    const [gapiLoaded, setGapiLoaded] = useState(false);

    useEffect(() => {
        const loadGapi = () => {
            window.gapi.load("client:auth2", async () => {
                await window.gapi.client.init({
                    apiKey: process.env.NEXT_PUBLIC_GOOGLE_API_KEY,
                    clientId: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID,
                    discoveryDocs: [
                        "https://www.googleapis.com/discovery/v1/apis/youtube/v3/rest",
                    ],
                    scope: "https://www.googleapis.com/auth/youtube.upload",
                });
                setGapiLoaded(true);
            });
        };

        if (!window.gapi) {
            const script = document.createElement("script");
            script.src = "https://apis.google.com/js/api.js";
            script.onload = loadGapi;
            document.body.appendChild(script);
        } else {
            loadGapi();
        }
    }, []);

    return gapiLoaded;
};

export default useGapi;
