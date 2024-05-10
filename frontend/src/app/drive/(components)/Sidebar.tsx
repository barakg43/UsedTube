import React, { FC, ReactNode } from "react";
import TreeFragment from "./FolderTree";
import { fakeData2 } from "@/redux/slices/itemsSliceFakeData";

const SideBarItem: FC<{ children: ReactNode }> = ({ children }) => {
  return <div className="rounded-2xl bg-dustyPaper text-black my-2 text-center">{children}</div>;
};

const Sidebar = () => {
  return (
    <nav className="h-full w-[150px] flex flex-col px-2">
      <SideBarItem>
        <TreeFragment node={fakeData2} spaces={0} />
      </SideBarItem>
      <SideBarItem>Shared with me</SideBarItem>
      <SideBarItem>Quota and storage left</SideBarItem>
    </nav>
  );
};

export default Sidebar;
