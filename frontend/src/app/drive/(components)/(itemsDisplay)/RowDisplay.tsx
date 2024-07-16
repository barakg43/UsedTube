import { FSNode, FileNode, ItemsDisplayProp, NodeType } from "@/types";
import { DataGrid, GridColDef, GridColTypeDef } from "@mui/x-data-grid";
import { FC, useState } from "react";
import ItemIcon from "./ItemIcon";
import { Menu, MenuItem } from "@mui/material";
import { useHandleMenuItemClick } from "./useHandleMenuItemClick";

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
const ItemsDisplayRow: FC<ItemsDisplayProp<FSNode | FileNode>> = ({
    items,
    onEntryClick,
}) => {
    const handleMenuItemClick = useHandleMenuItemClick();

    const columns: GridColDef[] = [
        { field: "icon", headerName: "", width: 30, ...NodeIconType },
        { field: "name", headerName: "Name", width: 200 },
        { field: "createdAt", headerName: "Created At", width: 200 },
        { field: "updatedAt", headerName: "Updated At", width: 200 },
        { field: "type", headerName: "Type", width: 100 },
        { field: "size", headerName: "Size", width: 100 },
    ];

    const [anchorPosition, setAnchorPosition] = useState({ top: 0, left: 0 });
    const [selectedNode, setSelectedNode] = useState<FSNode>({} as FSNode);
    const closeContextMenu = () => {
        setAnchorPosition({ top: 0, left: 0 });
    };
    return (
        <div className="h-[100%] w-[100%] relative">
            <DataGrid
                columns={columns}
                rows={items}
                onRowClick={(params, event) => {
                    if (onEntryClick(params.row)) return;
                    console.log("Row clicked", params.row);
                    setAnchorPosition({
                        top: event.clientY,
                        left: event.clientX,
                    });
                    setSelectedNode(params.row);
                }}
            />
            {
                <Menu
                    anchorReference="anchorPosition"
                    anchorPosition={anchorPosition}
                    open={Boolean(
                        anchorPosition.top > 0 && anchorPosition.left > 0
                    )}
                    onClose={closeContextMenu}
                >
                    <MenuItem
                        onClick={() => {
                            handleMenuItemClick(selectedNode, "download");
                            closeContextMenu();
                        }}
                    >
                        Download
                    </MenuItem>
                    <MenuItem
                        onClick={() => {
                            handleMenuItemClick(selectedNode, "share");
                            closeContextMenu();
                        }}
                    >
                        Share
                    </MenuItem>
                    <MenuItem
                        onClick={() => {
                            handleMenuItemClick(selectedNode, "delete");
                            closeContextMenu();
                        }}
                    >
                        Delete
                    </MenuItem>
                </Menu>
            }
        </div>
    );
};

export default ItemsDisplayRow;
