"use client";
import React from "react";
import { Button, TextField, Typography, IconButton } from "@mui/material";
import { ThemeProvider } from "@emotion/react";
import { theme } from "./theme";
import { useToaster } from "@/app/(common)/(hooks)/(toaster)/useToaster";
import IosShareTwoToneIcon from "@mui/icons-material/IosShareTwoTone";
function ShareItem() {
    const toaster = useToaster();

    return (
        <ThemeProvider theme={theme}>
            <div className="items-center space-x-2">
                <Button
                    className="hover:bg-dustyPaperDark text-black flex flex-row justify-left h-[47.33px]"
                    component="label"
                    variant="outlined"
                    size="small"
                    sx={{ textTransform: "none" }}
                    onClick={() => toaster("Share", "info")}
                >
                    <IosShareTwoToneIcon
                        className="pb-1"
                        sx={{
                            fontSize: "1.5rem",
                        }}
                    />
                    <Typography>Share</Typography>
                </Button>
            </div>
        </ThemeProvider>
    );
}

export default ShareItem;
