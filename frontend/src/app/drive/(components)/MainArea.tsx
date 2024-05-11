import { useAppSelector } from "@/redux/hooks";
import { RootState } from "@/redux/store";
import { Typography } from "@mui/material";
import React, { useState } from "react";
import ItemsDisplay from "./ItemsDisplay";
import { grid } from "@/constants";
import ItemsDisplayToggle from "./ItemsDisplayToggle";

const MainArea = () => {
  const activeDirectory = useAppSelector((state: RootState) => state.general.activeDirectory);
  return (
    <div className="flex flex-col flex-grow px-4 py-4 mb-4 mr-4 bg-dustyPaper rounded-3xl">
      <div className="flex flex-row justify-between w-full">
        <Typography variant="h4">{activeDirectory?.name}</Typography>
        <ItemsDisplayToggle />
      </div>
      <ItemsDisplay />
    </div>
  );
};

export default MainArea;
