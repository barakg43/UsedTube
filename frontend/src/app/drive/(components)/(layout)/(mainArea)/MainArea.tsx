import { useFolderContentQuery } from "@/redux/api/driveApi";
import { useAppSelector } from "@/redux/hooks";
import { RootState } from "@/redux/store";
import { Typography } from "@mui/material";
import ItemsDisplay from "../../(itemsDisplay)/Display";
import ItemsDisplayToggle from "../../(itemsDisplay)/ItemsDisplayToggle";
import CreateNewFolder from "./CreateNewFolder";
import { Suspense } from "react";
import { useToaster } from "@/app/(common)/useToaster";

const MainArea = ({ folderId }: { folderId: string | undefined }) => {
  console.log("folderId", folderId);
  const toaster = useToaster();
  const { data, error, isLoading } = {
    data: { folders: [], files: [] },
    error: null,
    isLoading: false,
  };
  if (error) {
    // toaster(error, "error");
  }
  //   useFolderContentQuery({ folderId });
  console.log(data);
  const { files, folders } = data || {};
  const activeDirectory = useAppSelector(
    (state: RootState) => state.items.activeDirectory
  );
  if (isLoading) {
    return <div>Loading...</div>;
  }
  return (
    <div className='flex flex-col flex-grow px-4 py-4 mb-4 mr-4 bg-dustyPaper rounded-3xl'>
      <div className='flex flex-row justify-between w-full'>
        <Typography variant='h4'>{activeDirectory?.name}</Typography>
        <div className='flex flex-row justify-between mb-4'>
          <CreateNewFolder />
          <ItemsDisplayToggle />
        </div>
      </div>
      <ItemsDisplay folders={folders || []} files={files || []} />
    </div>
  );
};

export default MainArea;
