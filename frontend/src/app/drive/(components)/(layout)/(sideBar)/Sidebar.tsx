"use client";
import { useAppSelector } from "@/redux/hooks";
import { RootState } from "@/redux/store";
import { FC, ReactNode } from "react";
import FolderTree from "./FolderTree";
import FileUploadButton from "./(fileUpload)/(components)/FileUploadButton";
import SelectedFileCard from "./(fileUpload)/(components)/SelectedFileCard";
import SharedWithMe from "./SharedWithMe";

const SideBarItem: FC<{ children: ReactNode; hoverStyle?: boolean }> = ({
    children,
    hoverStyle = true,
}) => {
    return (
        <div
            className={`rounded-2xl  ${
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
        <nav className="h-full w-[200px] flex flex-col px-2 pt-4">
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
            <SideBarItem>
                <SharedWithMe />
            </SideBarItem>
            <SideBarItem>Quota and storage left</SideBarItem>
        </nav>
    );
};

export default Sidebar;
