import React from "react";
import { grid, row } from "@/constants";
const ItemsDisplay: React.FC<{ displayType: "grid" | "row" }> = ({ displayType }) => {
  return <div className="mt-10 flex-grow">ITEMS</div>;
};

export default ItemsDisplay;
