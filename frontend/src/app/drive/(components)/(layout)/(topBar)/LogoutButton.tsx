"use client";
import { Logout } from "@mui/icons-material";
import { Button } from "@mui/material";
import { useRouter } from "next/navigation";
import React from "react";

const LogoutButton = () => {
  const router = useRouter();
  return (
    <div>
      <Button
        className="top-1 right-1"
        onClick={() => {
          localStorage.removeItem("userId");
          router.push("/login");
        }}
      >
        <Logout />
      </Button>
    </div>
  );
};

export default LogoutButton;
