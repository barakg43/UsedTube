"use client";
import React from "react";
import LoginContext from "./LoginContext";
import { ThemeProvider } from "@emotion/react";
import { theme } from "@/app/drive/(components)/(layout)/(topBar)/theme";

const TopBar = () => {
  return (
    <div className="bg-paper h-[120px] flex flex-row justify-between">
      <ThemeProvider theme={theme}>
        <div className="">logo</div>
        <LoginContext />
      </ThemeProvider>
    </div>
  );
};

export default TopBar;
