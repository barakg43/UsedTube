import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { setActiveDirectory } from "@/redux/slices/itemsSlice";
import { setShowSharedItems } from "@/redux/slices/shareSlice";
import { useRouter } from "next/navigation";

export function useFolderClick() {
    const router = useRouter();
    const dispatch = useAppDispatch();
    const showSharedItems = useAppSelector(
        (state) => state.share.showSharedItems
    );
    const onClick = (folderId: string) => {
        // set active directory
        dispatch(setActiveDirectory(folderId));
        if (showSharedItems) {
            dispatch(setShowSharedItems(false));
        }

        router.push(`/drive/${folderId}`);
    };

    return onClick;
}
