import {
    useFolderContentQuery,
    useSharedItemsQuery,
} from "@/redux/api/driveApi";
import { useAppSelector } from "@/redux/hooks";
import { FileNode, FSNode } from "@/types";

const useDisplayItems = ({ folderId }: { folderId: string }) => {
    const isShowingSharedItems = useAppSelector(
        (state) => state.share.showSharedItems
    );
    const { data } = useFolderContentQuery(
        { folderId },
        { skip: folderId === "" }
    );

    const { data: shared } = useSharedItemsQuery(undefined, {
        skip: !isShowingSharedItems,
        pollingInterval: 2000,
    });

    if (isShowingSharedItems) {
        return shared?.files;
    }

    return aggregateFoldersAndFiles(data);
};

export default useDisplayItems;

interface AggregateItemsInterface {
    files: FileNode[];
    folders: FSNode[];
    parents: FSNode[];
}

function aggregateFoldersAndFiles(data: AggregateItemsInterface | undefined) {
    const { files, folders, parents } = data || {};
    const parent = parents && parents[1];

    const filesWithType: FSNode[] = files
        ? files.map((fileItem) => ({
              ...fileItem,
              type: "file",
          }))
        : [];
    const folderWithType: FSNode[] = folders
        ? folders.map((folderItem) => ({
              ...folderItem,
              type: "folder",
          }))
        : [];
    const myItems = [
        parent ? { name: "..", id: parent?.id || "", type: "folder" } : null,
        ...folderWithType,
        ...filesWithType,
    ].filter(Boolean);
    return myItems;
}
