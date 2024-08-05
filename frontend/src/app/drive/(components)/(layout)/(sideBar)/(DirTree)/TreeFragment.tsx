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
import { useFolderClick } from "../../../useFolderClick";
import { Button } from "@mui/material";

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
            {/* <Button
        //     className="flex justify-start text-black normal-case"
        //     component="label"
        //     variant="text"
        //     size="small"
        //     sx={{
        //         "&:hover": {
        //             backgroundColor: "transparent",
        //         },
        //     }}
        // */}
            <div
                className={`  flex cursor-pointer  text-black ${
                    isActiveFolder && ""
                } hover:bg-dustyPaperDark rounded-xl `}
            >
                {spaces > 0 &&
                    new Array(spaces)
                        .fill(0)
                        .map((_, index) => <Space key={index} />)}
                <div className="mr-2 flex flex-row">
                    <Button
                        className="hover:bg-transparent normal-case text-black flex"
                        component="label"
                        variant="text"
                        size="small"
                        sx={{
                            justifyContent: "flex-start",
                            "&:disabled": {
                                background: "transparent !important",
                                cursor: "default !important",
                            },
                        }}
                    >
                        {hasChildren ? (
                            node?.isOpened ? (
                                <>
                                    <ArrowDropDownIcon
                                        onClick={() => handleArrowToggle(node)}
                                    />
                                    <FolderOpenIcon fontSize="small" />
                                    <div
                                        className={`text-left text-ellipsis ml-3`}
                                        onClick={() => onLabelClick(node.id)}
                                    >{`${node.name}`}</div>
                                </>
                            ) : (
                                <>
                                    <ArrowRightIcon
                                        fontSize="small"
                                        onClick={() => handleArrowToggle(node)}
                                    />
                                    <FolderIcon fontSize="small" />
                                    <div
                                        className={`text-left text-ellipsis ml-3`}
                                        onClick={() => onLabelClick(node.id)}
                                    >{`${node.name}`}</div>
                                </>
                            )
                        ) : (
                            <>
                                <ChevronRightIcon fontSize="small" />
                                <FolderOpenIcon />
                                <div
                                    className={`text-left text-ellipsis ml-3`}
                                    onClick={() => onLabelClick(node.id)}
                                >{`${node.name}`}</div>
                            </>
                        )}
                    </Button>
                </div>
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

            {/* </Button> */}
        </TreeContainer>
    );
};

export default TreeFragment;
