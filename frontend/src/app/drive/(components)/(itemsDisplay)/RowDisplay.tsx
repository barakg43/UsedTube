import { FSNode, ItemsDisplayProp, NodeType } from "@/types";
import { DataGrid, GridColDef, GridColTypeDef } from "@mui/x-data-grid";
import { FC } from "react";
import ItemIcon from "./ItemIcon";

const NodeIconType: GridColTypeDef<FSNode> = {
  type: "custom",
  resizable: false,
  filterable: false,
  sortable: false,
  editable: false,
  groupable: false,
  display: "flex",
  valueGetter: (value, row) => row,
  renderCell: (params) => <ItemIcon type={params.value?.type} />,
};
const ItemsDisplayRow: FC<ItemsDisplayProp> = ({ items, onEntryClick }) => {
  const columns: GridColDef[] = [
    { field: "icon", headerName: "", width: 30, ...NodeIconType },
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
