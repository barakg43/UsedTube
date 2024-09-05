"use client";
import React from "react";
import LogoutButton from "./LogoutButton";
import { ThemeProvider } from "@emotion/react";
import { theme } from "@/app/drive/(components)/(layout)/(topBar)/theme";
import Logo from "../../../../(common)/(components)/Logo";
import { Button } from "@mui/material";
import { useRouter } from "next/navigation";

const TopBar = () => {
    const router = useRouter();
    return (
        <div className="bg-paper h-[120px] flex flex-row justify-between pb-10">
            <ThemeProvider theme={theme}>
                <Logo color="blue-500" />
                <div className="flex flex-row">
                    <Button
                        size="small"
                        sx={{
                            backgroundColor: "#f8fafc",
                            "&:hover": {
                                backgroundColor: "#e4e4e7",
                            },
                        }}
                        onClick={() => {
                            router.push("/providers");
                        }}
                    >
                        providers
                    </Button>
                    <LogoutButton />
                </div>
            </ThemeProvider>
        </div>
    );
};

export default TopBar;
