import { ItemsDisplayProp } from "@/types";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import { FC } from "react";

const ItemsDisplayRow: FC<ItemsDisplayProp> = ({ items, onEntryClick }) => {
  const columns: GridColDef[] = [
    { field: "icon", headerName: "", width: 30 },
    { field: "name", headerName: "Name", width: 200 },
    { field: "createdAt", headerName: "Created At", width: 200 },
    { field: "updatedAt", headerName: "Updated At", width: 200 },
  ];

  return (
    <div className='h-[100%] w-[100%] relative'>
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

export default ItemsDisplayRow;
