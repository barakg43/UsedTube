import { grid } from "@/constants";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { setActiveDirectory } from "@/redux/slices/itemsSlice";
import { FSNode, FileNode } from "@/types";
import { useRouter } from "next/navigation";
import ItemsDisplayGrid from "./GridDisplay";
import ItemsDisplayRow from "./RowDisplay";
// import { useRouter } from "next/navigation";

type ItemsDisplayProp = {
  folders: FSNode[];
  files: FileNode[];
  parent: FSNode;
};
function ItemsDisplay({ files, folders, parent }: ItemsDisplayProp) {
  const router = useRouter();
  const filesWithType: FSNode[] = files.map((fileItem) => ({
    ...fileItem,
    type: "file",
  }));
  const folderWithType: FSNode[] = folders.map((folderItem) => ({
    ...folderItem,
    type: "folder",
  }));
  const items = [
    parent ? { name: "..", id: parent?.id || "", type: "folder" } : null,
    ...folderWithType,
    ...filesWithType,
  ].filter(Boolean);
  const displayType = useAppSelector((state) => state.items.displayType);
  const dispatch = useAppDispatch();
  // const router = useRouter();
  const onEntryClick = (node: FSNode) => {
    // set active directory
    if (node.type === "folder") {
      dispatch(setActiveDirectory(node));
      router.push(`/drive/${node.id}`);
    }
  };

  return (
    <div className='bg-paper rounded-2xl px-4 py-4 flex flex-grow w-full h-full'>
      {displayType === grid ? (
        <ItemsDisplayGrid onEntryClick={onEntryClick} items={items || []} />
      ) : (
        <ItemsDisplayRow onEntryClick={onEntryClick} items={items || []} />
      )}
    </div>
  );
}

export default ItemsDisplay;
