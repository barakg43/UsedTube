import { useAppDispatch } from "@/redux/hooks";
import { setActiveDirectory } from "@/redux/slices/itemsSlice";
import { FSNode } from "@/types";
import { useRouter } from "next/navigation";

export function useFolderClick() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const onClick = (folderId: string) => {
    // set active directory
    dispatch(setActiveDirectory(folderId));
    router.push(`/drive/${folderId}`);
  };

  return onClick;
}
