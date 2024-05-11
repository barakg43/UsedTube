"use client";
import React, { FC, ReactNode } from "react";
import TreeFragment from "./FolderTree";
import { useAppSelector } from "@/redux/hooks";
import { RootState } from "@/redux/store";

const SideBarItem: FC<{ children: ReactNode }> = ({ children }) => {
  return <div className="rounded-2xl bg-dustyPaper text-black my-2 text-center">{children}</div>;
};

const Sidebar = () => {
  const tree = useAppSelector((state: RootState) => state.items.activeDirectory);
  return (
    <nav className="h-full w-[150px] flex flex-col px-2">
      <SideBarItem>
        <TreeFragment node={tree} spaces={0} />
      </SideBarItem>
      <SideBarItem>Shared with me</SideBarItem>
      <SideBarItem>Quota and storage left</SideBarItem>
    </nav>
  );
};

export default Sidebar;
