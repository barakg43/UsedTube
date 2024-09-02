"use client";

import { FC, ReactNode } from "react";
import FolderTree from "./(DirTree)/FolderTree";
import FileUploadButton from "./(fileUpload)/FileUploadButton";
import SharedWithMe from "./SharedWithMe";
import Quota from "./Quota";

const SideBarItem: FC<{ children: ReactNode }> = ({ children }) => {
    return (
        <div className="rounded-2xl cursor-default items-center  text-black text-center pb-4">
            {children}
        </div>
    );
};

const Sidebar = () => {
    return (
        <nav className="h-full w-[200px] flex flex-col pt-4">
            <div className="flex-grow">
                <SideBarItem>
                    <FileUploadButton />
                </SideBarItem>
                <SideBarItem>
                    <FolderTree />
                </SideBarItem>
                <SideBarItem>
                    <SharedWithMe />
                </SideBarItem>
            </div>
            <Quota />
        </nav>
    );
};

export default Sidebar;
