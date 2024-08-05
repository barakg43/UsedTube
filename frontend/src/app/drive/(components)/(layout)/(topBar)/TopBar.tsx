"use client";
import React from "react";
import LogoutButton from "./LogoutButton";
import { ThemeProvider } from "@emotion/react";
import { theme } from "@/app/drive/(components)/(layout)/(topBar)/theme";
import Logo from "../../../../(common)/(components)/Logo";

const TopBar = () => {
    return (
        <div className="bg-paper h-[120px] flex flex-row justify-between pb-10">
            <ThemeProvider theme={theme}>
                <Logo color="dustyPaperDarkest" />
                <LogoutButton />
            </ThemeProvider>
        </div>
    );
};

export default TopBar;
