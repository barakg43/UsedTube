"use client";
import { TextField, Typography, Button } from "@mui/material";
import React, { ChangeEvent, FC, useState } from "react";
import { useAppDispatch } from "@/redux/hooks";
import { addAPIData } from "@/redux/slices/userSlice";
import { DAILYMOTION } from "@/constants";
import { useToaster } from "@/app/(common)/(hooks)/(toaster)/useToaster";

const CustomLink: React.FC<{ href: string; children: React.ReactNode }> = ({
    href,
    children,
}) => {
    return (
        <Typography component="a" color="primary" href={href} target="_blank">
            {children}
        </Typography>
    );
};

const RegisterDailymotionAPIKey: FC<{ goBack: Function }> = ({ goBack }) => {
    const [apikey, setApikey] = useState("");
    const dispatch = useAppDispatch();
    const toaster = useToaster();
    const onClick = () => {
        toaster.toaster("Dailymotion API key added", "success");
        goBack();
    };

    return (
        <div className="flex justify-center items-center h-screen">
            <div className="flex flex-col items-start gap-4">
                <Typography variant="h4" align="left">
                    How to get Dailymotion API secrets
                </Typography>
                <Typography variant="body1" align="left">
                    To use the Dailymotion API, you need to create an app on the
                    Dailymotion Developer Platform and generate an API key.
                </Typography>
                <Typography variant="h5" align="left">
                    Step 1: Create an app
                </Typography>
                <Typography variant="body1" align="left">
                    Go to the{" "}
                    <CustomLink href="https://developer.dailymotion.com/apps">
                        Dailymotion Developer Platform
                    </CustomLink>{" "}
                    and create a new app.
                </Typography>
                <Typography variant="h5" align="left">
                    Step 2: Generate API key
                </Typography>
                <Typography variant="body1" align="left">
                    After creating the app, navigate to the `API Keys` section
                    and generate a new API key.
                </Typography>
                <Typography variant="h5" align="left">
                    Step 3: Copy and paste the API key here:
                </Typography>
                <Typography variant="body1" align="left">
                    Copy the API key and paste it into the API key field below.
                </Typography>
                <TextField
                    onChange={(
                        e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
                    ) => {
                        setApikey(e.target.value);
                    }}
                    label="Dailymotion API Key"
                    variant="standard"
                    className="w-full mt-2 mb-2"
                />
                <div className="mb-4 flex flex-row-reverse w-full">
                    <Button
                        variant="contained"
                        color="primary"
                        disabled={apikey === ""}
                        onClick={onClick}
                        sx={{
                            marginLeft: "1em",
                        }}
                    >
                        Submit
                    </Button>
                    <Button
                        variant="outlined"
                        color="primary"
                        onClick={() => goBack()}
                    >
                        Back
                    </Button>
                </div>
            </div>
        </div>
    );
};

export default RegisterDailymotionAPIKey;
