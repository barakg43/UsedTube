import { FSNode } from "@/types";
import PathTraceItem from "./PathTraceItem";

function PathTrace({ parents }: { parents: FSNode[] }) {
    return (
        <div className="flex flex-row flex-start w-full gap-0">
            {parents?.map((parent, index) => (
                <PathTraceItem
                    key={index}
                    id={parent.id}
                    name={parent.name}
                    isLastItem={index === parents.length - 1}
                />
            ))}
        </div>
    );
}

export default PathTrace;
