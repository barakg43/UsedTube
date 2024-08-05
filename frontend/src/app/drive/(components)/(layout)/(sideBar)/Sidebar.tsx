"use client";
import { useAppSelector } from "@/redux/hooks";
import { RootState } from "@/redux/store";
import { FC, ReactNode } from "react";
import FolderTree from "./(DirTree)/FolderTree";
import FileUploadButton from "./(fileUpload)/(components)/FileUploadButton";
import SelectedFileCard from "./(fileUpload)/(components)/SelectedFileCard";
import SharedWithMe from "./SharedWithMe";
import Quota from "./Quota";

const SideBarItem: FC<{ children: ReactNode }> = ({ children }) => {
    return (
        <div className="rounded-2xl cursor-default items-center mb-3 text-black text-center">
            {children}
        </div>
    );
};

const Sidebar = () => {
    const fileToUpload = useAppSelector(
        (state: RootState) => state.fileUpload.fileToUpload
    );
    return (
        <nav className="h-full w-[200px] flex flex-col pt-4">
            <SideBarItem>
                <FileUploadButton />
            </SideBarItem>
            {fileToUpload && (
                <SideBarItem>
                    <SelectedFileCard />
                </SideBarItem>
            )}
            <SideBarItem>
                <FolderTree />
            </SideBarItem>
            <SideBarItem>
                <SharedWithMe />
            </SideBarItem>
            <Quota />
        </nav>
    );
};

export default Sidebar;
