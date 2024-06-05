"use client";
import React, { FC, ReactNode } from "react";
import TreeFragment from "./TreeFragment";
import { useAppSelector } from "@/redux/hooks";
import { RootState } from "@/redux/store";
import FileUpload from "./FileUpload";
import FolderTree from "./FolderTree";

const SideBarItem: FC<{ children: ReactNode; hoverStyle?: boolean }> = ({
  children,
  hoverStyle = true,
}) => {
  return (
    <div
      className={`rounded-2xl bg-dustyPaper ${
        hoverStyle ? " hover:bg-dustyPaperDark" : ""
      } items-center mb-3 text-black text-center cursor-pointer`}
    >
      {children}
    </div>
  );
};

const Sidebar = () => {
  return (
    <nav className='h-full w-[200px] flex flex-col px-2'>
      <SideBarItem>
        <FileUpload />
      </SideBarItem>
      <SideBarItem hoverStyle={false}>
        <FolderTree />
      </SideBarItem>
      <SideBarItem>Shared with me</SideBarItem>
      <SideBarItem>Quota and storage left</SideBarItem>
    </nav>
  );
};

export default Sidebar;
