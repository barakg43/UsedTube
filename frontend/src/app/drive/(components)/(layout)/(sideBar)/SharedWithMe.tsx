"use client";
import React from "react";
import PeopleAltIcon from "@mui/icons-material/PeopleAlt";
import { Button } from "@mui/material";
import { useAppDispatch } from "@/redux/hooks";
import { setShowSharedItems } from "@/redux/slices/shareSlice";

const SharedWithMe = () => {
    const dispatch = useAppDispatch();

    return (
        <Button
            className="flex justify-start text-black normal-case rounded-full"
            component="label"
            variant="text"
            size="small"
            sx={{
                "&:hover": {
                    backgroundColor: "transparent",
                },
            }}
            onClick={() => {
                dispatch(setShowSharedItems(true));
            }}
        >
            <PeopleAltIcon fontSize="small" className="mr-2 ml-5" />
            Shared With Me
        </Button>
    );
};

export default SharedWithMe;
