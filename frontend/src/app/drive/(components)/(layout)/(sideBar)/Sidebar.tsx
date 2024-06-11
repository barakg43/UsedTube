"use client";
import { useAppSelector } from "@/redux/hooks";
import { RootState } from "@/redux/store";
import { FC, ReactNode } from "react";
import FolderTree from "./FolderTree";
import FileUploadButton from "./(fileUpload)/(processor)/(components)/FileUploadButton";
import SelectedFileCard from "./(fileUpload)/(processor)/(components)/SelectedFileCard";

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
    const fileToUpload = useAppSelector(
        (state: RootState) => state.fileUpload.fileToUpload
    );
    return (
        <nav className="h-full w-[200px] flex flex-col px-2">
            <SideBarItem>
                <FileUploadButton />
            </SideBarItem>
            {fileToUpload && (
                <SideBarItem hoverStyle={false}>
                    <SelectedFileCard />
                </SideBarItem>
            )}
            <SideBarItem hoverStyle={false}>
                <FolderTree />
            </SideBarItem>
            <SideBarItem>Shared with me</SideBarItem>
            <SideBarItem>Quota and storage left</SideBarItem>
        </nav>
    );
};

export default Sidebar;
