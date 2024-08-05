import { FSNode } from "@/types";
import React, { FC, useCallback, useState } from "react";
import { useFolderClick } from "../../../useFolderClick";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { RootState } from "@/redux/store";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import ArrowRightIcon from "@mui/icons-material/ArrowRight";
import { toggleIsOpened } from "@/redux/slices/itemsSlice";
import FolderOpenIcon from "@mui/icons-material/FolderOpen";
import FolderIcon from "@mui/icons-material/Folder";

interface FolderEntryProps {
    node: FSNode;
}

const FolderEntry: FC<FolderEntryProps> = ({ node }) => {
    const dispatch = useAppDispatch();
    // const [, updateState] = useState<object>();
    // const forceUpdate = useCallback(() => updateState({}), []);
    const onLabelClick = useFolderClick();
    const hasSubFolders = (node?.children?.length ?? 0) > 0;
    const activeDirectory = useAppSelector(
        (state: RootState) => state.items.activeDirectoryId
    );
    const isActiveFolder =
        (node.name === "My Drive" && activeDirectory === "") ||
        activeDirectory === node?.id;

    const handleArrowToggle = (node: FSNode): void => {
        dispatch(toggleIsOpened(node));
        // forceUpdate();
    };

    let prefix;

    if (!node.isOpened && !hasSubFolders) {
        prefix = <FolderIcon fontSize="small" className="ml-3" />;
    } else if (!node.isOpened && hasSubFolders) {
        prefix = (
            <>
                <ArrowRightIcon
                    onClick={() => handleArrowToggle(node)}
                    fontSize="small"
                />
                <FolderIcon fontSize="small" />
            </>
        );
    } else if (node.isOpened && hasSubFolders) {
        prefix = (
            <>
                <ArrowDropDownIcon
                    onClick={() => handleArrowToggle(node)}
                    fontSize="small"
                />
                <FolderOpenIcon fontSize="small" />
            </>
        );
    } else if (node.isOpened && !hasSubFolders) {
        prefix = (
            <>
                <ArrowDropDownIcon
                    onClick={() => handleArrowToggle(node)}
                    fontSize="small"
                />
                <FolderOpenIcon fontSize="small" />
            </>
        );
    }
    return (
        <>
            {prefix}
            <div
                className={`text-left text-ellipsis ml-3`}
                onClick={() => onLabelClick(node.id)}
            >{`${node.name}`}</div>
        </>
    );
};

export default FolderEntry;
