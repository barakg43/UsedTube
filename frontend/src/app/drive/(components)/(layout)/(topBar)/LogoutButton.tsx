"use client";
import { useLogout } from "@/hooks/auth/useLogout";
import { useAppDispatch } from "@/redux/hooks";
import { Logout } from "@mui/icons-material";
import { Button } from "@mui/material";
import { useRouter } from "next/navigation";
import React from "react";

const LogoutButton = () => {
    const router = useRouter();
    const dispatch = useAppDispatch();
    const { logout } = useLogout();
    return (
        <div>
            <Button
                className="bg-paper hover:bg-highlighted h-[100%] ml-1"
                onClick={() => {
                    logout();
                }}
            >
                <Logout />
            </Button>
        </div>
    );
};

export default LogoutButton;
