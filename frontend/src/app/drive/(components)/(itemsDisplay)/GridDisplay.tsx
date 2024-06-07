import { FSNode, ItemsDisplayProp } from "@/types";
import { FC } from "react";
import ItemsDisplayNode from "./GridDisplayNode";

const ItemsDisplayGrid: FC<ItemsDisplayProp<FSNode>> = ({
  items,
  onEntryClick,
}) => {
  return (
    <div className='flex-grow grid grid-cols-3 grid-rows-7 overflow-y-scroll'>
      {items?.map((node: FSNode, index: number) => {
        return (
          <ItemsDisplayNode
            onEntryClick={onEntryClick}
            key={index}
            node={node}
          />
        );
      })}
    </div>
  );
};

export default ItemsDisplayGrid;
