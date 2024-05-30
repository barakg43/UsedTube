import React from "react";
import { FSNode, FileNode } from "@/types";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { setActiveDirectory } from "@/redux/slices/itemsSlice";
import ItemsDisplayGrid from "./GridDisplay";
import ItemsDisplayRow from "./RowDisplay";
import { file, folder, grid } from "@/constants";
import FolderIcon from "@mui/icons-material/Folder";
import DescriptionIcon from "@mui/icons-material/Description";
import { useRouter } from "next/navigation";

type ItemsDisplayProp = {
  folders: FSNode[];
  files: FileNode[];
};
function ItemsDisplay({ files, folders }: ItemsDisplayProp) {
  const items = [...folders, ...files];
  console.log("items:", items);
  const displayType = useAppSelector((state) => state.items.displayType);
  const dispatch = useAppDispatch();
  const router = useRouter();
  const onEntryClick = (node: FSNode) => {
    // set active directory
    if (node.type === file) {
      return;
    }
    dispatch(setActiveDirectory(node));
    router.push(`/drive/${node.id}`);
  };

  const itemsWithIcon =
    items?.map((item) =>
      item.type === folder
        ? { ...item, icon: <FolderIcon className='mr-5' /> }
        : { ...item, icon: <DescriptionIcon className='mr-5' /> }
    ) || [];
  return (
    <div className='bg-paper rounded-2xl px-4 py-4 flex flex-grow w-full h-full'>
      {displayType === grid ? (
        <ItemsDisplayGrid onEntryClick={onEntryClick} items={items || []} />
      ) : (
        <ItemsDisplayRow
          onEntryClick={onEntryClick}
          items={itemsWithIcon || []}
        />
      )}
    </div>
  );
}

export default ItemsDisplay;
