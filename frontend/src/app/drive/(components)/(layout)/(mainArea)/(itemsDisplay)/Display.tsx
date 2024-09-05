import { GRID } from "@/constants";
import { useAppSelector } from "@/redux/hooks";
import { FSNode } from "@/types";
import ItemsDisplayGrid from "./GridDisplay";
import ItemsDisplayRow from "./RowDisplay";

function ItemsDisplay<T extends FSNode>({ items }: { items: T[] }) {
    const displayType = useAppSelector((state) => state.items.displayType);
    const items_with_file_ext = items.map((item) => ({
        ...item,
        name:
            "extension" in item ? item.name + "." + item.extension : item.name,
    }));

    return (
        <div className="bg-paper rounded-2xl flex flex-grow w-full h-full">
            {displayType === GRID ? (
                <ItemsDisplayGrid
                    //@ts-ignore
                    items={items_with_file_ext || []}
                />
            ) : (
                <ItemsDisplayRow
                    //@ts-ignore
                    items={items_with_file_ext || []}
                />
            )}
        </div>
    );
}

export default ItemsDisplay;
