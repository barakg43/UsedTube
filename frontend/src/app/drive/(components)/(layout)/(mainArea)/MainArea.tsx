"use client";
import { useToaster } from "@/app/(common)/useToaster";
import { useFolderContentQuery } from "@/redux/api/driveApi";
import { useAppSelector } from "@/redux/hooks";
import { RootState } from "@/redux/store";
import { Typography } from "@mui/material";
import ItemsDisplay from "../../(itemsDisplay)/Display";
import ItemsDisplayToggle from "../../(itemsDisplay)/ItemsDisplayToggle";
import CreateNewFolder from "./CreateNewFolder";

const MainArea = ({ folderId }: { folderId: string | undefined }) => {
  const toaster = useToaster();
  const { data, error, isLoading } = useFolderContentQuery({ folderId });
  if (error) {
    // toaster(error.data, "error");
  }
  const { files, folders, parents } = data || {};
  const activeDirectory = useAppSelector(
    (state: RootState) => state.items.activeDirectory
  );
  if (isLoading) {
    return <div >Loading...</div>;
  }

    return (
        <div className="flex flex-col flex-grow px-4 py-4 mb-4 mr-4 bg-dustyPaper rounded-3xl">
            <div className="flex flex-row justify-between w-full">
                <Typography variant="h4">{activeDirectory?.name}</Typography>
                <div className="flex flex-row justify-between w-[250px]">
                    <CreateNewFolder />
                    <ItemsDisplayToggle />
                </div>
            </div>
            <ItemsDisplay
                parent={parents && parents[0]}
                folders={folders || []}
                files={files || []}
            />
        </div>
      </div>
      <ItemsDisplay
        parent={parents && parents[0]}
        folders={folders || []}
        files={files || []}
      />
    </div>
  );
};

export default MainArea;
