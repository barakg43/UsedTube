import { useDispatch, useSelector } from "react-redux";
import { google } from "googleapis";
import { setProgress, nextPhase } from "@/redux/slices/fileUploadSlice";
import { RootState } from "@/redux/store";
import { useProviderAPITokenQuery } from "@/redux/api/authApi";
import { YOUTUBE } from "@/constants";

const useUploadToYoutube = (fileSize: number) => {
    const dispatch = useDispatch();

    const serializedVideo = useSelector(
        (state: RootState) => state.fileUpload.serializedVideoOfSelectedFile
    );

    const { data: providerAPIToken } = useProviderAPITokenQuery({
        provider: YOUTUBE,
    });

    const uploadToYoutube = async () => {
        if (!serializedVideo || !providerAPIToken) return;

        const oauth2Client = new google.auth.OAuth2();

        oauth2Client.setCredentials({
            access_token: providerAPIToken.key,
        });

        const youtube = google.youtube({ version: "v3", auth: oauth2Client });

        try {
            const response = await youtube.videos.insert(
                {
                    part: ["snippet", "status"],
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
                        body: serializedVideo.stream(),
                    },
                },
                {
                    onUploadProgress: (evt) => {
                        const progress = (evt.bytesRead / fileSize) * 100;
                        dispatch(setProgress(Math.round(progress)));
                    },
                }
            );

            console.log("Video uploaded:", response);
            dispatch(nextPhase());
        } catch (error) {
            console.error("Error uploading video to YouTube", error);
        }
    };

    return { uploadToYoutube };
};

export default useUploadToYoutube;
