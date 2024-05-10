import React from "react";
import TreeFragment from "./FolderTree";
import { fakeData2 } from "@/redux/slices/itemsSliceFakeData";

const Sidebar = () => {
  return (
    <nav className="h-full w-[150px] pl-5 bg-purple-600">
      <div>Go To Root</div>
      <TreeFragment node={fakeData2} spaces={0} />
      <div>Shared with me</div>
      <div>Quota and storage left</div>
    </nav>
  );
};

export default Sidebar;
