import { FSNode } from "@/types";
import { DataGrid, GridColDef, GridColTypeDef } from "@mui/x-data-grid";
import { FC } from "react";
import ItemIcon from "./ItemIcon";
import useContextMenu from "@/app/(common)/(hooks)/(contextMenu)/useContextMenu";
import { useFolderClick } from "../../../../(hooks)/useFolderClick";

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
const ItemsDisplayRow: FC<{ items: FSNode[] }> = ({ items }) => {
    const columns: GridColDef[] = [
        { field: "icon", headerName: "", width: 30, ...NodeIconType },
        { field: "name", headerName: "Name", width: 200 },
        { field: "created_at", headerName: "Created At", width: 200 },
        { field: "updated_at", headerName: "Updated At", width: 200 },
        { field: "type", headerName: "Type", width: 100 },
        { field: "size", headerName: "Size", width: 100 },
        { field: "owner", headerName: "Owner", width: 200 },
    ];

    const { openContextMenu, renderContextMenu } = useContextMenu();

    const folderClick = useFolderClick();

    return (
        <div className="h-[100%] w-[100%] overflow-auto">
            <DataGrid
                columns={columns}
                rows={items}
                slotProps={{
                    row: {
                        // @ts-ignore
                        onContextMenu: (event) => {
                            event.preventDefault();
                            const rowId = String(
                                (
                                    event.currentTarget as HTMLDivElement
                                ).getAttribute("data-id")
                            );
                            const record = items.find(
                                (item) => item.id === rowId
                            );
                            if (record) openContextMenu(event, record);
                        },
                    },
                }}
                onRowClick={(params, event) => {
                    if (params.row.type === "folder") {
                        folderClick(params.row.id);
                    } else {
                        const rowId = String(
                            (
                                event.currentTarget as HTMLDivElement
                            ).getAttribute("data-id")
                        );
                        const record = items.find((item) => item.id === rowId);
                        if (record) openContextMenu(event, record);
                    }
                }}
            />
            {renderContextMenu()}
        </div>
    );
};

export default ItemsDisplayRow;
