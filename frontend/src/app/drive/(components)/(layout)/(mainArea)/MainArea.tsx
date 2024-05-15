import { useAppSelector } from "@/redux/hooks";
import { RootState } from "@/redux/store";
import { Typography } from "@mui/material";
import React, { useState } from "react";
import ItemsDisplay from "../../(itemsDisplay)/Display";
import ItemsDisplayToggle from "../../(itemsDisplay)/ItemsDisplayToggle";
import CreateNewFolder from "./CreateNewFolder";

const MainArea = () => {
  const activeDirectory = useAppSelector((state: RootState) => state.items.activeDirectory);
  return (
    <div className="flex flex-col flex-grow px-4 py-4 mb-4 mr-4 bg-dustyPaper rounded-3xl">
      <div className="flex flex-row justify-between w-full">
        <Typography variant="h4">{activeDirectory?.name}</Typography>
        <div className="flex flex-row justify-between w-[250px]">
          <CreateNewFolder />
          <ItemsDisplayToggle />
        </div>
      </div>
      <ItemsDisplay />
    </div>
  );
};

export default MainArea;
