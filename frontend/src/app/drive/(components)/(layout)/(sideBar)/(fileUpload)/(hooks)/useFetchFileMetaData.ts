import { useFolderContentQuery } from "@/redux/api/driveApi";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { nextPhase, setIsUploading } from "@/redux/slices/fileUploadSlice";

export function useFetchFileMetaData() {
    const dispatch = useAppDispatch();
    const activeDirectoryId = useAppSelector(
        (state) => state.items.activeDirectoryId
    );
    const { refetch } = useFolderContentQuery({ folderId: activeDirectoryId });
    const fetchFileMetaData = () => {
        refetch();
        dispatch(nextPhase());
        dispatch(setIsUploading(false));
    };

    return { fetchFileMetaData };
}
