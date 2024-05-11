import React, { FC } from "react";
import { grid, row } from "@/constants";
import { FSNode } from "@/types";
import { useAppSelector } from "@/redux/hooks";
const ItemsDisplayNode: FC<FSNode> = (node) => {
  return <div>{node.name}</div>;
};

const ItemsDisplay: React.FC<{ displayType: "grid" | "row" }> = ({ displayType }) => {
  const items = useAppSelector((state) => state.items.myItems);
  return (
    // rounded box with scroll bar color paper
    <div className="mt-10 flex-grow">
      {items.map((child: FSNode, index: number) => {
        return <ItemsDisplayNode key={index} {...child} />;
      })}
    </div>
  );
};

export default ItemsDisplay;
