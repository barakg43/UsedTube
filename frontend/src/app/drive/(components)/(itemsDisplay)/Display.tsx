import React from "react";
import { FILE, GRID } from "@/constants";
import { FSNode, FileNode } from "@/types";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { setActiveDirectory } from "@/redux/slices/itemsSlice";
import ItemsDisplayGrid from "./GridDisplay";
import ItemsDisplayRow from "./RowDisplay";

type ItemsDisplayProp = {
    folders: FSNode[];
    files: FileNode[];
};
function ItemsDisplay({ files, folders }: ItemsDisplayProp) {
    const items = useAppSelector(
        (state) => state.items.activeDirectory.children
    );
    const displayType = useAppSelector((state) => state.items.displayType);
    const dispatch = useAppDispatch();
    const onEntryClick = (node: FSNode) => {
        // set active directory
        if (node.type === FILE) {
            return;
        }
        dispatch(setActiveDirectory(node));
    };

    return (
        <div className="bg-paper rounded-2xl px-4 py-4 flex flex-grow w-full h-full">
            {displayType === GRID ? (
                <ItemsDisplayGrid
                    onEntryClick={onEntryClick}
                    items={items || []}
                />
            ) : (
                <ItemsDisplayRow
                    onEntryClick={onEntryClick}
                    items={items || []}
                />
            )}
        </div>
    );
}

export default ItemsDisplay;

