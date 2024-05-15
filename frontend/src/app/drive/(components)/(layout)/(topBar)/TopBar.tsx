"use client";
import React from "react";
import LogoutButton from "./LogoutButton";
import { ThemeProvider } from "@emotion/react";
import { theme } from "@/app/drive/(components)/(layout)/(topBar)/theme";
import Logo from "./Logo";

const TopBar = () => {
  return (
    <div className="bg-paper h-[120px] flex flex-row justify-between">
      <ThemeProvider theme={theme}>
        <Logo />
        <LogoutButton />
      </ThemeProvider>
    </div>
  );
};

export default TopBar;
