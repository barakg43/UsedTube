"use client";

import { FC, ReactNode } from "react";
import FolderTree from "./(DirTree)/FolderTree";
import FileUploadButton from "./(fileUpload)/FileUploadButton";
import SharedWithMe from "./SharedWithMe";
import Quota from "./Quota";
import { useToaster } from "@/app/(common)/(hooks)/(toaster)/useToaster";

const SideBarItem: FC<{ children: ReactNode }> = ({ children }) => {
    return (
        <div className="rounded-2xl cursor-default items-center mb-3 text-black text-center">
            {children}
        </div>
    );
};

const Sidebar = () => {
    return (
        <nav className="h-full w-[200px] flex flex-col pt-4">
            <SideBarItem>
                <FileUploadButton />
            </SideBarItem>
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
