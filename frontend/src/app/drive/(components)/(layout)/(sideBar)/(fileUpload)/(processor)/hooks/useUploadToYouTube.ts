import { useDispatch, useSelector } from "react-redux";
import { google } from "googleapis";
import fs from "fs";
import { setProgress, nextPhase } from "@/redux/slices/fileUploadSlice";
import { RootState } from "@/redux/store";

const useUploadToYoutube = (fileSize: number) => {
    const dispatch = useDispatch();
    const selectedFile = useSelector(
        (state: RootState) => state.fileUpload.file
    );

    const uploadToYoutube = async () => {
        if (!selectedFile || !providerAPIToken?) return;

        const oauth2Client = new google.auth.OAuth2();
        oauth2Client.setCredentials({
            access_token: providerAPIToken.access_token,
        });

        const youtube = google.youtube({ version: "v3", auth: oauth2Client });

        try {
            const res = await youtube.videos.insert(
                {
                    part: "snippet,status",
                    requestBody: {
                        snippet: {
                            title: "Uploaded Video",
                            description: "Uploaded via API",
                            tags: ["tag1", "tag2"],
                        },
                        status: {
                            privacyStatus: "private",
                        },
                    },
                    media: {
                        body: selectedFile.stream(),
                    },
                },
                {
                    onUploadProgress: (evt) => {
                        const progress = (evt.bytesRead / fileSize) * 100;
                        dispatch(setProgress(Math.round(progress)));
                    },
                }
            );

            console.log("Video uploaded:", res.data);
            dispatch(nextPhase());
        } catch (error) {
            console.error("Error uploading video to YouTube", error);
        }
    };

    return { uploadToYoutube };
};

export default useUploadToYoutube;
