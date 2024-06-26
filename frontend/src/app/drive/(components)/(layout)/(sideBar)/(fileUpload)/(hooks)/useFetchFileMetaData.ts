import { useAppDispatch } from "@/redux/hooks";
import { nextPhase, setIsUploading } from "@/redux/slices/fileUploadSlice";

export function useFetchFileMetaData() {
    const dispatch = useAppDispatch();

    const fetchFileMetaData = () => {
        // fetch file metadata
        // set the file in the tree
        alert("File metadata fetched successfully! Need To Implement fetch");
        dispatch(nextPhase());
        dispatch(setIsUploading(false));
    };

    return { fetchFileMetaData };
}
