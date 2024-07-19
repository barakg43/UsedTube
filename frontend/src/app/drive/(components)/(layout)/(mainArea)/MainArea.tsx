"use client";
import { useToaster } from "@/app/(common)/useToaster";
import { useFolderContentQuery } from "@/redux/api/driveApi";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { RootState } from "@/redux/store";
import { Typography } from "@mui/material";
import ItemsDisplay from "../../(itemsDisplay)/Display";
import ItemsDisplayToggle from "../../(itemsDisplay)/ItemsDisplayToggle";
import CreateNewFolder from "./CreateNewFolder";
import Loading from "@/app/(common)/Loading";
import { useEffect } from "react";
import { setActiveDirectory } from "@/redux/slices/itemsSlice";
import ParentsRow from "./ParentsRow";
import { FSNode, FileNode } from "@/types";

const MainArea = ({ folderId }: { folderId: string | undefined }) => {
  const toaster = useToaster();

  const { data, error, isLoading } = useFolderContentQuery({ folderId });
  if (error) {
    // toaster(error.data, "error");
  }
  const dispatch = useAppDispatch();
  const {
    files,
    folders,
    parents,
  }: { files: FileNode[]; folders: FSNode[]; parents: FSNode[] } = data || {};
  const activeDirectory = useAppSelector(
    (state: RootState) => state.items.activeDirectoryId
  );
  useEffect(() => {
    if (!activeDirectory)
      dispatch(setActiveDirectory(parents && parents[0]?.id));
  });
  if (isLoading) {
    <Loading />;
  }

  return (
    <div className='flex flex-col flex-grow px-4 py-4 mb-4 mr-4 bg-dustyPaper rounded-3xl'>
      <div className='flex flex-row justify-between w-full'>
        <Typography variant='h4'>
          <ParentsRow parents={parents?.slice().reverse()} />
        </Typography>
        <div className='flex flex-row justify-between'>
          <CreateNewFolder />
          <ItemsDisplayToggle />
        </div>
      </div>
      <ItemsDisplay
        parent={parents && parents[1]}
        folders={folders || []}
        files={files || []}
      />
    </div>
  );
};

export default MainArea;
