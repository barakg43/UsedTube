import { FSNode } from "@/types";
import { Menu, MenuItem } from "@mui/material";
import React, { useState } from "react";
import { useHandleMenuItemClick } from "./useHandleMenuItemClick";
import { useAppSelector } from "@/redux/hooks";

const useContextMenu = () => {
    // return Container, activation function which receives node and action, and event
    const [anchorPosition, setAnchorPosition] = useState({ top: 0, left: 0 });
    const [node, setNode] = useState<FSNode>({} as FSNode);
    const openContextMenu = (
        event: React.MouseEvent<HTMLElement>,
        node: FSNode
    ) => {
        event.stopPropagation();
        setAnchorPosition({ top: event.clientY, left: event.clientX });
        setNode(node);
    };
    const closeContextMenu = () => {
        setAnchorPosition({ top: 0, left: 0 });
    };

    const isShowingSharedItems = useAppSelector(
        (state) => state.share.showSharedItems
    );

    const handleMenuItemClick = useHandleMenuItemClick();

    const renderContextMenu = () => (
        <Menu
            anchorReference="anchorPosition"
            anchorPosition={anchorPosition}
            open={Boolean(anchorPosition.top > 0 && anchorPosition.left > 0)}
            onClose={closeContextMenu}
        >
            {node.type === "file" && [
                <MenuItem
                    key="download"
                    onClick={() => {
                        handleMenuItemClick(node, "download");
                        closeContextMenu();
                    }}
                >
                    Download
                </MenuItem>,
                !isShowingSharedItems && (
                    <MenuItem
                        key="share"
                        onClick={() => {
                            handleMenuItemClick(node, "share");
                            closeContextMenu();
                        }}
                    >
                        Share
                    </MenuItem>
                ),
            ]}

            <MenuItem
                key="delete"
                onClick={() => {
                    handleMenuItemClick(node, "delete");
                    closeContextMenu();
                }}
            >
                Delete
            </MenuItem>
        </Menu>
    );

    return { openContextMenu, renderContextMenu };
};

export default useContextMenu;
