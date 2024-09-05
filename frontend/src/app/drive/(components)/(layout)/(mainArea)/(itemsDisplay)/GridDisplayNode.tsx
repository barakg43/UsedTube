import { FOLDER } from "@/constants";
import { FSNode } from "@/types";
import FolderIcon from "@mui/icons-material/Folder";
import DescriptionIcon from "@mui/icons-material/Description";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import { Typography, Tooltip } from "@mui/material";
import { FC } from "react";
import { useFolderClick } from "../../../../(hooks)/useFolderClick";
import useContextMenu from "@/app/(common)/(hooks)/(contextMenu)/useContextMenu";

const ItemsDisplayNode: FC<{ node: FSNode }> = ({ node }) => {
    const folderClick = useFolderClick();
    const { openContextMenu, renderContextMenu } = useContextMenu();
    return (
        <>
            <Tooltip
                title={node.name}
                placement="bottom"
                enterDelay={500}
                leaveDelay={200}
            >
                <div
                    className="cursor-pointer max-w-[18vw] hover:bg-highlighted flex-grow flex flex-row items-center rounded-2xl px-2 py-1 mt-2 ml-2 mr-2 bg-dustyPaper hover:bg-dustyPaperDark border max-h-16 text-ellipsis overflow-hidden whitespace-nowrap"
                    onClick={(e) => {
                        if (node.type === FOLDER) {
                            folderClick(node.id);
                        } else {
                            alert("prompt download");
                        }
                    }}
                >
                    {node.type === FOLDER ? (
                        <FolderIcon className="mr-5" />
                    ) : (
                        <DescriptionIcon className="mr-5" />
                    )}
                    <Typography className="text-ellipsis whitespace-nowrap overflow-hidden flex-grow">
                        {node.name}
                    </Typography>
                    {node.name !== ".." && (
                        <div
                            onClick={(e) => openContextMenu(e, node)}
                            className="z-[999]"
                        >
                            <MoreVertIcon className="hover:bg-stone-300 rounded-full" />
                        </div>
                    )}
                </div>
            </Tooltip>
            {renderContextMenu()}
        </>
    );
};

export default ItemsDisplayNode;
