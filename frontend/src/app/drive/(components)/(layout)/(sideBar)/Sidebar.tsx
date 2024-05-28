"use client";
import React, { FC, ReactNode } from "react";
import TreeFragment from "./FolderTree";
import { useAppSelector } from "@/redux/hooks";
import { RootState } from "@/redux/store";
import FileUpload from "./FileUpload";

import SelectedFile from "./SelectedFile";

const SideBarItem: FC<{ children: ReactNode; hoverStyle?: boolean }> = ({
    children,
    hoverStyle = true,
}) => {
    return (
        <div
            className={`rounded-2xl bg-dustyPaper ${
                hoverStyle
                    ? " hover:bg-dustyPaperDark  cursor-pointer"
                    : "cursor-default"
            } items-center mb-3 text-black text-center`}
        >
            {children}
        </div>
    );
};

const Sidebar = () => {
    const file = useAppSelector((state: RootState) => state.fileUpload.file);
    const tree = useAppSelector(
        (state: RootState) => state.items.items.myItems
    );
    return (
        <nav className="h-full w-[200px] flex flex-col px-2">
            <SideBarItem>
                <FileUpload />
            </SideBarItem>
            {file && (
                <SideBarItem hoverStyle={false}>
                    <SelectedFile file={file} />
                </SideBarItem>
            )}
            <SideBarItem hoverStyle={false}>
                <TreeFragment node={tree} spaces={0} />
            </SideBarItem>
            <SideBarItem>Shared with me</SideBarItem>
            <SideBarItem>Quota and storage left</SideBarItem>
        </nav>
    );
};

export default Sidebar;
