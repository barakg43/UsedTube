import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { nextPhase, setIsUploading } from "@/redux/slices/fileUploadSlice";

export function useFetchFileMetaData() {
    // bring the file metadata from the server
    // nextphase()
    // isUploading = false
    const jobId = useAppSelector((state) => state.fileUpload.jobId);
    const dispatch = useAppDispatch();

    const fetchFileMetaData = () => {
        // fetch file metadata
        // set the file in the tree
        dispatch(nextPhase());
        dispatch(setIsUploading(false));
    };

    return { fetchFileMetaData };
}
