"use client";
import { GRID, ROW } from "@/constants";
import { DisplayType } from "@/types";
import React from "react";
import ToggleButtonGroup from "@mui/material/ToggleButtonGroup";
import ToggleButton from "@mui/material/ToggleButton";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { setDisplayType } from "@/redux/slices/itemsSlice";
import GridViewIcon from "@mui/icons-material/GridView";
import ViewHeadlineSharpIcon from "@mui/icons-material/ViewHeadlineSharp";

const ItemsDisplayToggle = () => {
    const dispatch = useAppDispatch();
    const displayType = useAppSelector((state) => state.items.displayType);
    const handleToggle = (
        event: React.MouseEvent<HTMLElement>,
        newDisplayState: DisplayType
    ) => {
        dispatch(setDisplayType(newDisplayState));
    };

    return (
        <ToggleButtonGroup
            className="mb-4"
            value={displayType}
            exclusive
            onChange={handleToggle}
        >
            <ToggleButton value={ROW}>
                <ViewHeadlineSharpIcon />
            </ToggleButton>
            <ToggleButton value={GRID}>
                <GridViewIcon />
            </ToggleButton>
        </ToggleButtonGroup>
    );
};

export default ItemsDisplayToggle;
