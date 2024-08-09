import { FSNode } from "@/types";
import PathTraceItem from "./PathTraceItem";
import { useFolderContentQuery } from "@/redux/api/driveApi";

function PathTrace({ folderId }: { folderId: string }) {
    const { data } = useFolderContentQuery(
        { folderId },
        { skip: folderId === "" }
    );

    if (!data) return null;

    return (
        <div className="flex flex-row flex-start w-full gap-0">
            {data.parents?.map((parent, index) => (
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
