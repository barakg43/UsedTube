"use client";
import { useAppDispatch } from "@/redux/hooks";
import { removeAuthToken } from "@/redux/slices/generalSlice";
import { Logout } from "@mui/icons-material";
import { Button } from "@mui/material";
import { useRouter } from "next/navigation";
import React from "react";

const LogoutButton = () => {
  const router = useRouter();
  const dispatch = useAppDispatch();
  return (
    <div>
      <Button
        className="top-1 right-1"
        onClick={() => {
          dispatch(removeAuthToken());
          router.push("/login");
        }}
      >
        <Logout />
      </Button>
    </div>
  );
};

export default LogoutButton;
