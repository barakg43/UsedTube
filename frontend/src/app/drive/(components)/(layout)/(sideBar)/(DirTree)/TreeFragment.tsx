"use client";
import { useAppSelector } from "@/redux/hooks";
import { RootState } from "@/redux/store";
import { FSNode } from "@/types";
import { Button } from "@mui/material";
import FolderEntry from "./FolderEntry";

const Space = () => {
    return <div className="w-[8px]" />;
};

const TreeContainer: React.FC<React.PropsWithChildren<{}>> = ({ children }) => {
    return <div className="flex flex-col text-left w-full">{children}</div>;
};

type MyProps = {
    node: FSNode;
    spaces: number;
};

export const TreeFragment: React.FC<MyProps> = ({ node, spaces }) => {
    const activeDirectory = useAppSelector(
        (state: RootState) => state.items.activeDirectoryId
    );

    const isShowingSharedItems = useAppSelector(
        (state) => state.share.showSharedItems
    );

    if (!node) return null;
    const hasChildren = (node?.children?.length ?? 0) > 0;
    const isActiveFolder =
        activeDirectory === node?.id && !isShowingSharedItems;

    return (
        <TreeContainer>
            <div
                className={`flex flex-row cursor-pointer   
                        ${isActiveFolder ? "bg-blue-200" : ""}
                        ${
                            isActiveFolder
                                ? "hover:bg-blue-300"
                                : "hover:bg-highlighted"
                        }
                        rounded-full w-full`}
            >
                {spaces > 0 &&
                    new Array(spaces)
                        .fill(0)
                        .map((_, index) => <Space key={index} />)}
                <div className="mr-2 flex flex-row overflow-hidden whitespace-nowrap w-full">
                    <Button
                        className="hover:bg-transparent normal-case text-black flex justify-start w-full rounded-full"
                        component="label"
                        variant="text"
                        size="small"
                    >
                        <FolderEntry node={node} />
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
        </TreeContainer>
    );
};

export default TreeFragment;
