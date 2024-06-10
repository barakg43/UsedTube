import { useAppSelector } from "@/redux/hooks";
import { useProviderAPITokenQuery } from "@/redux/api/authApi";
import { YOUTUBE } from "@/constants";
import useUploadToYoutube from "./useUploadToYouTube";

const useUploadToSelectedProvider = () => {
    const { data: providerAPIToken } = useProviderAPITokenQuery({
        provider: YOUTUBE, // <-- should by dynamic; hard coded for now
    });

    const fileSize = useAppSelector(
        (state) => state.fileUpload.serializedVideoSize
    );

    const { uploadToYoutube } = useUploadToYoutube(fileSize);

    const uploadToSelectedProvider = () => {
        if (!providerAPIToken) throw new Error("No provider API token found");
        switch (providerAPIToken.provider) {
            case YOUTUBE:
                uploadToYoutube();
                console.log("Uploading to YouTube!!!!#@!#!@#!@#!@#!@#!");
                break;
            default:
                break;
        }
    };

    return { uploadToSelectedProvider };
};

export default useUploadToSelectedProvider;
