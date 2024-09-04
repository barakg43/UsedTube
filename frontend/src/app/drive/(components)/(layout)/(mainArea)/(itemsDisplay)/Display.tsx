import { GRID } from "@/constants";
import { useAppSelector } from "@/redux/hooks";
import { FSNode } from "@/types";
import ItemsDisplayGrid from "./GridDisplay";
import ItemsDisplayRow from "./RowDisplay";

function ItemsDisplay({ items }: { items: FSNode[] }) {
    const displayType = useAppSelector((state) => state.items.displayType);

    return (
        <div className="bg-paper rounded-2xl flex flex-grow w-full h-full max-h-full">
            {displayType === GRID ? (
                <ItemsDisplayGrid
                    //@ts-ignore
                    items={items || []}
                />
            ) : (
                <ItemsDisplayRow
                    //@ts-ignore
                    items={items || []}
                />
            )}
        </div>
    );
}

export default ItemsDisplay;
