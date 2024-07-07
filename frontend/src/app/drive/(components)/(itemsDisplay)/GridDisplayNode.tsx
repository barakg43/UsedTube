import { FILE, FOLDER } from "@/constants";
import { FSNode } from "@/types";
import FolderIcon from "@mui/icons-material/Folder";
import DescriptionIcon from "@mui/icons-material/Description";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import { Menu, MenuItem, Typography } from "@mui/material";
import { FC, useState } from "react";
import { useHandleMenuItemClick } from "./useHandleMenuItemClick";

const ItemsDisplayNode: FC<{ node: FSNode; onEntryClick: Function }> = ({
    node,
    onEntryClick,
}) => {
    const [anchorPosition, setAnchorPosition] = useState({ top: 0, left: 0 });
    const handleClick = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorPosition({ top: event.clientY, left: event.clientX });
    };
    const handleClose = () => {
        setAnchorPosition({ top: 0, left: 0 });
    };

    const handleMenuItemClick = useHandleMenuItemClick();

    return (
        <>
            <div
                className="cursor-pointer flex-grow flex flex-row rounded-3xl px-2 py-2 mt-2 mr-6 bg-dustyPaper hover:bg-dustyPaperDark border"
                onClick={(e) => (onEntryClick(node) ? null : handleClick(e))}
                onContextMenu={(e) => {
                    e.preventDefault();
                    handleClick(e);
                }}
            >
                {node.type === FOLDER ? (
                    <FolderIcon className="mr-5" />
                ) : (
                    <DescriptionIcon className="mr-5" />
                )}
                <Typography className="text-ellipsis flex-grow">
                    {node.name}
                </Typography>
                {node.type === FILE && (
                    <MoreVertIcon className="hover:bg-dustyPaperEvenDarker rounded-full" />
                )}
            </div>
            <Menu
                anchorReference="anchorPosition"
                anchorPosition={anchorPosition}
                open={Boolean(
                    anchorPosition.top > 0 && anchorPosition.left > 0
                )}
                onClose={handleClose}
            >
                <MenuItem
                    onClick={() =>
                        handleMenuItemClick(node, handleClose, "download")
                    }
                >
                    Download
                </MenuItem>
                <MenuItem
                    onClick={() =>
                        handleMenuItemClick(node, handleClose, "share")
                    }
                >
                    Share
                </MenuItem>
                <MenuItem
                    onClick={() =>
                        handleMenuItemClick(node, handleClose, "delete")
                    }
                >
                    Delete
                </MenuItem>
            </Menu>
        </>
    );
};

export default ItemsDisplayNode;
