"use client";
import { useFolderContentQuery } from "@/redux/api/driveApi";
import { Typography } from "@mui/material";
import ItemsDisplay from "./(itemsDisplay)/Display";
import ItemsDisplayToggle from "./(itemsDisplay)/ItemsDisplayToggle";
import CreateNewFolder from "./CreateNewFolder";
import Loading from "@/app/(common)/(components)/Loading";
import PathTrace from "./PathTrace";
import useDisplayItems from "./(itemsDisplay)/useDisplayItems";

const MainArea = ({ folderId }: { folderId: string }) => {
    const { isLoading } = useFolderContentQuery(
        { folderId },
        { skip: folderId === "" }
    );

    const items = useDisplayItems({ folderId });

    if (isLoading) {
        return <Loading />;
    }

    return (
        <div className="bg-white flex flex-col flex-grow px-4 py-4 mb-4 mr-4 rounded-3xl h-[80%]">
            <div className="flex flex-row justify-between w-full h-fit">
                <Typography variant="h4">
                    <PathTrace folderId={folderId} />
                </Typography>
                <div className="flex flex-row justify-between">
                    {/* <ShareItem /> */}
                    <CreateNewFolder />
                    <ItemsDisplayToggle />
                </div>
            </div>
            {/* @ts-ignore */}
            <ItemsDisplay items={items} />
        </div>
    );
};

export default MainArea;
