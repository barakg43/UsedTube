import { useAppSelector } from "@/redux/hooks";
import { useProviderAPITokenQuery } from "@/redux/api/authApi";
import { YOUTUBE } from "@/constants";
import useUploadToYoutube from "./useUploadToYouTube";

const useUploadToSelectedProvider = () => {
    const selectedFile = useAppSelector((state) => state.fileUpload.file);
    //TODO: update state.fileUpload.file to state.fileUpload.originalFile
    //  and create state.fileUpload.fileToUploadToProvider
    const { data: providerAPIToken } = useProviderAPITokenQuery({
        provider: YOUTUBE, // <-- should by dynamic; hard coded for now
    });

    const FILE_SIZE = 1000000;

    // needs file size from server
    const { uploadToYoutube } = useUploadToYoutube(FILE_SIZE);

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
