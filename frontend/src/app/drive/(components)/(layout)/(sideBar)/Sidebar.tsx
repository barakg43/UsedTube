"use client";
import { useAppSelector } from "@/redux/hooks";
import { RootState } from "@/redux/store";
import { FC, ReactNode } from "react";
import FileUpload from "./(fileUpload)/FileUpload";
import SelectedFile from "./(fileUpload)/SelectedFile";
import FolderTree from "./FolderTree";

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
  return (
    <nav className='h-full w-[200px] flex flex-col px-2'>
      <SideBarItem>
        <FileUpload />
      </SideBarItem>
      {file && (
        <SideBarItem hoverStyle={false}>
          <SelectedFile />
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
