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
                className="top-1 right-1 bg-paper hover:bg-highlighted"
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
