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
    const closeContextMenu = () => {
        setAnchorPosition({ top: 0, left: 0 });
    };

    const handleMenuItemClick = useHandleMenuItemClick();

    return (
        <>
            <div
                className="cursor-pointer flex-grow flex flex-row items-center rounded-2xl px-2 py-2 mt-2 mr-6 bg-dustyPaper hover:bg-dustyPaperDark border max-w-150px text-ellipsis overflow-hidden whitespace-nowrap"
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
                {node.name !== ".." && (
                    <div onClick={handleClick}>
                        <MoreVertIcon className="hover:bg-dustyPaperEvenDarker rounded-full" />
                    </div>
                )}
            </div>
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
                        handleMenuItemClick(node, "download");
                        closeContextMenu();
                    }}
                >
                    Download
                </MenuItem>
                <MenuItem
                    onClick={() => {
                        handleMenuItemClick(node, "share");
                        closeContextMenu();
                    }}
                >
                    Share
                </MenuItem>
                <MenuItem
                    onClick={() => {
                        handleMenuItemClick(node, "delete");
                        closeContextMenu();
                    }}
                >
                    Delete
                </MenuItem>
            </Menu>
        </>
    );
};

export default ItemsDisplayNode;
