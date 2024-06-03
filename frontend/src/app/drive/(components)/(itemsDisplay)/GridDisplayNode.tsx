"use client";
import { file, folder } from "@/constants";
import { FSNode } from "@/types";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import { Menu, MenuItem, Typography } from "@mui/material";
import { FC, useState } from "react";
import ItemIcon from "./ItemIcon";

const ItemsDisplayNode: FC<{ node: FSNode; onEntryClick: Function }> = ({
  node,
  onEntryClick,
}) => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };
  const handleMenuItemClick = (action: string) => {
    // Handle menu item click based on the selected action
    // For demonstration purposes, just log the action
    console.log("Clicked:", action);
    handleClose();
  };
  return (
    <>
      <div
        className="cursor-pointer flex-grow flex flex-row rounded-3xl px-2 py-2 mt-2 mr-6 bg-dustyPaper hover:bg-dustyPaperDark border"
        onClick={(e) => (node.type == folder ? onEntryClick(node) : handleClick(e))}
        onContextMenu={(e) => {
          e.preventDefault();
          handleClick(e);
        }}
      >
        {node.type === folder ? <FolderIcon className="mr-5" /> : <DescriptionIcon className="mr-5" />}
        <Typography className="text-ellipsis flex-grow">{node.name}</Typography>
        {node.type === file && <MoreVertIcon className="hover:bg-dustyPaperEvenDarker rounded-full" />}
      </div>
      <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleClose}>
        <MenuItem onClick={() => handleMenuItemClick("download")}>Download</MenuItem>
        <MenuItem onClick={() => handleMenuItemClick("share")}>Share</MenuItem>
        <MenuItem onClick={() => handleMenuItemClick("delete")}>Delete</MenuItem>
      </Menu>
    </>
  );
};

export default ItemsDisplayNode;
