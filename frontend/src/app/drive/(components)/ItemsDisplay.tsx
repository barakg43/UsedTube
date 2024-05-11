import React, { FC } from "react";
import { grid, row } from "@/constants";
import { FSNode } from "@/types";
import { useAppSelector } from "@/redux/hooks";
import { DataGrid, GridColDef } from "@mui/x-data-grid";

const ItemsDisplayNode: FC<{ node: FSNode }> = ({ node }) => {
  return <div>{node.name}</div>;
};

const ItemsDisplayGrid: FC<{ items: FSNode[] | undefined }> = ({ items }) => {
  return (
    <div className="mt-10 flex-grow bg-paper rounded-2xl px-4 py-4 overflow-y-scroll">
      {items?.map((node: FSNode, index: number) => {
        return <ItemsDisplayNode key={index} node={node} />;
      })}
    </div>
  );
};

const ItemsDisplay: React.FC = () => {
  const items = useAppSelector((state) => state.items.activeDirectory.children);
  const displayType = useAppSelector((state) => state.items.displayType);
  return (
    <>
      {displayType === grid ? (
        <ItemsDisplayGrid items={items} />
      ) : (
        <DataGrid className="rounded-2xl" columns={columns} rows={items} />
      )}
    </>
  );
};

export default ItemsDisplay;

const columns: GridColDef[] = [
  { field: "name", headerName: "Name", width: 200 },
  { field: "createdAt", headerName: "Created At", width: 200 },
  { field: "updatedAt", headerName: "Updated At", width: 200 },
];
