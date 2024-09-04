"use client";
import React, { useEffect } from "react";
import PeopleAltIcon from "@mui/icons-material/PeopleAlt";
import { Button } from "@mui/material";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { setShowSharedItems } from "@/redux/slices/shareSlice";
import { useRouter } from "next/navigation";

const SharedWithMe = () => {
    const dispatch = useAppDispatch();
    const isShowingSharedItems = useAppSelector(
        (state) => state.share.showSharedItems
    );
    const router = useRouter();
    useEffect(() => {
        router.push("/drive");
    });
    return (
        <Button
            className={`flex justify-start text-black normal-case rounded-full ${
                isShowingSharedItems
                    ? "bg-blue-200 hover:bg-blue-300"
                    : "bg-transparent hover:bg-highlighted_2"
            } `}
            component="label"
            variant="text"
            size="small"
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
