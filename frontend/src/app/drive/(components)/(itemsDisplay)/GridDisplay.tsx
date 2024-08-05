import { FSNode } from "@/types";
import { FC } from "react";
import ItemsDisplayNode from "./GridDisplayNode";

const ItemsDisplayGrid: FC<{ items: FSNode[] }> = ({ items }) => {
    return (
        <div className="flex-grow grid md:grid-cols-3 lg:grid-cols-4 grid-rows-7 overflow-y-scroll">
            {items?.map((node: FSNode, index: number) => {
                return <ItemsDisplayNode key={index} node={node} />;
            })}
        </div>
    );
};

export default ItemsDisplayGrid;
