"use client";
import { TextField, Typography, Button } from "@mui/material";
import React, { ChangeEvent, FC } from "react";
import { useAppDispatch } from "@/redux/hooks";
import { addAPIData } from "@/redux/slices/userSlice";
import { setShowModal } from "@/redux/slices/generalSlice";
import { VIMEO } from "@/constants";
import { useRouter } from "next/navigation";
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

const RegisterVimeoAPIKey: FC<{ goBack: Function }> = ({ goBack }) => {
    const dispatch = useAppDispatch();
    const toaster = useToaster();
    const onClick = () => {
        toaster.toaster("Vimeo API key added", "success");
        goBack();
    };

    return (
        <div className="flex justify-center items-center h-screen">
            <div className="flex flex-col items-start gap-4">
                <Typography variant="h4" align="left">
                    How to get Vimeo API secrets
                </Typography>
                <Typography variant="body1" align="left">
                    To use the Vimeo API, you need to create an app on the Vimeo
                    Developer Platform and generate an access token.
                </Typography>
                <Typography variant="h5" align="left">
                    Step 1: Create an app
                </Typography>
                <Typography variant="body1" align="left">
                    Go to the{" "}
                    <CustomLink href="https://developer.vimeo.com/apps">
                        Vimeo Developer Platform
                    </CustomLink>{" "}
                    and create a new app.
                </Typography>
                <Typography variant="h5" align="left">
                    Step 2: Generate access token
                </Typography>
                <Typography variant="body1" align="left">
                    After creating the app, navigate to the Authentication`
                    section and generate a new access token.
                </Typography>
                <Typography variant="h5" align="left">
                    Step 3: Copy and paste the API key here:
                </Typography>
                <Typography variant="body1" align="left">
                    Copy the access token and paste it into the API key field
                    below.
                </Typography>
                <TextField
                    onChange={(
                        e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
                    ) => {
                        let value = e.target.value;
                        dispatch(addAPIData({ provider: VIMEO, key: value }));
                    }}
                    label="Vimeo API Key"
                    variant="standard"
                    className="w-full mt-2 mb-2"
                />
                <div className="mb-4 flex flex-row-reverse w-full">
                    <Button
                        variant="contained"
                        color="primary"
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

export default RegisterVimeoAPIKey;
