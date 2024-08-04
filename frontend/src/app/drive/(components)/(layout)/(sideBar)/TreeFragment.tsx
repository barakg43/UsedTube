"use client";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import ArrowRightIcon from "@mui/icons-material/ArrowRight";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import FolderIcon from "@mui/icons-material/Folder";
import FolderOpenIcon from "@mui/icons-material/FolderOpen";
import { toggleIsOpened } from "@/redux/slices/itemsSlice";
import { RootState } from "@/redux/store";
import { FSNode } from "@/types";
import { useCallback, useState } from "react";
import { useFolderClick } from "../../useFolderClick";

const Space = () => {
    return <div className="w-[8px]" />;
};

const TreeContainer: React.FC<React.PropsWithChildren<{}>> = ({ children }) => {
    return <div className="flex flex-col text-left">{children}</div>;
};

type MyProps = {
    node: FSNode;
    spaces: number;
};

export const TreeFragment: React.FC<MyProps> = ({ node, spaces }) => {
    const [, updateState] = useState<object>();
    const forceUpdate = useCallback(() => updateState({}), []);
    const onLabelClick = useFolderClick();
    const dispatch = useAppDispatch();
    const activeDirectory = useAppSelector(
        (state: RootState) => state.items.activeDirectoryId
    );
    const handleArrowToggle = (node: FSNode): void => {
        dispatch(toggleIsOpened(node));

        forceUpdate();
    };

    if (!node) return null;
    const hasChildren = (node?.children?.length ?? 0) > 0;
    const isActiveFolder =
        (node.name === "My Drive" && activeDirectory === "") ||
        activeDirectory === node?.id;
    return (
        <TreeContainer>
            <div
                className={`  flex cursor-pointer  text-black ${
                    isActiveFolder && ""
                } hover:bg-dustyPaperDark rounded-xl `}
            >
                {spaces > 0 &&
                    new Array(spaces)
                        .fill(0)
                        .map((_, index) => <Space key={index} />)}
                <div className="mr-2">
                    {hasChildren ? (
                        node?.isOpened ? (
                            <>
                                <ArrowDropDownIcon
                                    onClick={() => handleArrowToggle(node)}
                                />
                                <FolderOpenIcon fontSize="small" />
                            </>
                        ) : (
                            <>
                                <ArrowRightIcon
                                    fontSize="small"
                                    onClick={() => handleArrowToggle(node)}
                                />
                                <FolderIcon fontSize="small" />
                            </>
                        )
                    ) : (
                        <>
                            <ChevronRightIcon fontSize="small" />
                            <FolderOpenIcon />
                        </>
                    )}
                </div>

                {
                    <span
                        className={`text-left text-ellipsis flex-grow w-[24px]  `}
                        onClick={() => onLabelClick(node.id)}
                    >{`${node.name}`}</span>
                }
            </div>
            {node?.isOpened && hasChildren && (
                <TreeContainer>
                    {node?.children?.map((child: FSNode, index: number) => {
                        return (
                            <TreeFragment
                                key={index}
                                spaces={spaces + 1}
                                node={child}
                            />
                        );
                    })}
                </TreeContainer>
            )}
        </TreeContainer>
    );
};

export default TreeFragment;
