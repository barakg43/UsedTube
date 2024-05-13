import React, { FC } from "react";
import { file, grid } from "@/constants";
import { FSNode, ItemsDisplayProp } from "@/types";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import { setActiveDirectory } from "@/redux/slices/itemsSlice";

const ItemsDisplay: React.FC = () => {
  const items = useAppSelector((state) => state.items.activeDirectory.children);
  const displayType = useAppSelector((state) => state.items.displayType);
  const dispatch = useAppDispatch();
  const onEntryClick = (node: FSNode) => {
    // set active directory
    if (node.type === file) return;
    dispatch(setActiveDirectory(node));
  };

  return (
    <>
      <div className="bg-paper rounded-2xl px-4 py-4 flex flex-grow">
        {displayType === grid ? (
          <ItemsDisplayGrid onEntryClick={onEntryClick} items={items || []} />
        ) : (
          <ItemsDisplayRow onEntryClick={onEntryClick} items={items || []} />
        )}
      </div>
    </>
  );
};

const ItemsDisplayNode: FC<{ node: FSNode; onEntryClick: Function }> = ({ node, onEntryClick }) => {
  return <div onClick={() => onEntryClick(node)}>{node.name}</div>;
};

const ItemsDisplayGrid: FC<ItemsDisplayProp> = ({ items, onEntryClick }) => {
  return (
    <div className="mt-10 flex-grow grid grid-cols-4 overflow-y-scroll">
      {items?.map((node: FSNode, index: number) => {
        return <ItemsDisplayNode onEntryClick={onEntryClick} key={index} node={node} />;
      })}
    </div>
  );
};

const ItemsDisplayRow: FC<ItemsDisplayProp> = ({ items, onEntryClick }) => {
  const columns: GridColDef[] = [
    { field: "name", headerName: "Name", width: 200 },
    { field: "createdAt", headerName: "Created At", width: 200 },
    { field: "updatedAt", headerName: "Updated At", width: 200 },
  ];

  return (
    <div className="h-[60%] w-[82%] absolute">
      <DataGrid
        columns={columns}
        rows={items}
        onRowClick={(e) => {
          onEntryClick(e.row);
        }}
      />
    </div>
  );
};

export default ItemsDisplay;
