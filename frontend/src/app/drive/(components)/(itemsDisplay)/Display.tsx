import { GRID } from "@/constants";
import { useAppSelector } from "@/redux/hooks";
import { FSNode, FileNode } from "@/types";
import { useFolderClick } from "../useFolderClick";
import ItemsDisplayGrid from "./GridDisplay";
import ItemsDisplayRow from "./RowDisplay";
// import { useRouter } from "next/navigation";

type ItemsDisplayProp = {
    folders: FSNode[];
    files: FileNode[];
    parent: FSNode;
};
function ItemsDisplay({ files, folders, parent }: ItemsDisplayProp) {
    const onFolderClick = useFolderClick();

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
    const items = [
        parent ? { name: "..", id: parent?.id || "", type: "folder" } : null,
        ...folderWithType,
        ...filesWithType,
    ].filter(Boolean);
    const displayType = useAppSelector((state) => state.items.displayType);
    const onEntryClick = (node: FSNode) => {
        // set active directory
        if (node.type === "folder") {
            onFolderClick(node.id);
            return true;
        }
        return false;
    };

    return (
        <div className="bg-paper rounded-2xl px-4 py-4 flex flex-grow w-full h-full">
            {displayType === GRID ? (
                <ItemsDisplayGrid
                    onEntryClick={onEntryClick}
                    //@ts-ignore
                    items={items || []}
                />
            ) : (
                <ItemsDisplayRow
                    onEntryClick={onEntryClick}
                    //@ts-ignore
                    items={items || []}
                />
            )}
        </div>
    );
}

export default ItemsDisplay;
