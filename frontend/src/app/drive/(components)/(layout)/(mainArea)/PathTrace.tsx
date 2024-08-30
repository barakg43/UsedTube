import PathTraceItem from "./PathTraceItem";
import { useFolderContentQuery } from "@/redux/api/driveApi";
import { useAppSelector } from "@/redux/hooks";
import { Typography } from "@mui/material";

function PathTrace({ folderId }: { folderId: string }) {
    const { data } = useFolderContentQuery(
        { folderId },
        { skip: folderId === "" }
    );

    const isShowingSharedItems = useAppSelector(
        (state) => state.share.showSharedItems
    );

    if (!data) return null;

    if (isShowingSharedItems)
        return (
            <Typography className="text-nowrap text-xl">
                Shared With Me
            </Typography>
        );

    return (
        <div className="flex flex-row flex-start w-full gap-0">
            {data.parents
                ?.slice()
                .reverse()
                .map((parent, index) => (
                    <PathTraceItem
                        key={index}
                        id={parent.id}
                        name={parent.name}
                        isLastItem={index === data.parents.length - 1}
                    />
                ))}
        </div>
    );
}

export default PathTrace;
