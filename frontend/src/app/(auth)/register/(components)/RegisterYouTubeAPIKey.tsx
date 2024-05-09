"use client";
import { TextField, Typography, Button } from "@mui/material";
import React, { useState } from "react";
import OnRegistrationModal from "./OnRegistrationModal";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { registerUserData, setApiKey } from "@/redux/slices/userSlice";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";

const CustomLink: React.FC<{ href: string; children: React.ReactNode }> = ({ href, children }) => {
  return (
    <Typography component="a" color="primary" href={href} target="_blank">
      {children}
    </Typography>
  );
};

const RegisterYouTubeAPIKey = () => {
  const [showModal, setShowModal] = useState(false);
  const dispatch = useAppDispatch();
  const user = useAppSelector((s: RootState) => s.user);

  const onClick = () => {
    dispatch(registerUserData(user));
    // setShowModal(true);
  };
  return (
    <div className="flex justify-center items-center h-screen">
      <div className="flex flex-col items-start gap-4">
        <Typography variant="h4" align="left">
          How to get YouTube API secrets
        </Typography>
        <Typography variant="body1" align="left">
          To use the YouTube API, you need to create a project in the Google Cloud Platform and enable the YouTube API
          for that project.
        </Typography>
        <Typography variant="h5" align="left">
          Step 1: Create a project
        </Typography>
        <Typography variant="body1" align="left">
          Go to the <CustomLink href="https://console.developers.google.com/">Google Cloud Platform</CustomLink> and
          create a new project.
        </Typography>
        <Typography variant="h5" align="left">
          Step 2: Enable the YouTube API
        </Typography>
        <Typography variant="body1" align="left">
          Go to the{" "}
          <CustomLink href="https://console.developers.google.com/apis/library/youtube.googleapis.com">
            YouTube API
          </CustomLink>{" "}
          page and enable the API for your project.
        </Typography>
        <Typography variant="h5" align="left">
          Step 3: Create credentials
        </Typography>
        <Typography variant="body1" align="left">
          Go to the <CustomLink href="https://console.developers.google.com/apis/credentials">Credentials</CustomLink>{" "}
          page and create a new API key (Create Credentials -&gt; API Key).
        </Typography>
        <Typography variant="h5" align="left">
          Step 4: Copy and paste the API key here:
        </Typography>
        <Typography variant="body1" align="left">
          Copy the API key and paste it into the API key field below.
        </Typography>
        <TextField
          onChange={(e) => {
            dispatch(setApiKey(e.target.value));
          }}
          value={user.apiKey}
          label="YouTube API Key"
          variant="standard"
          className="w-full mt-2 mb-2"
        />
        <div className="mb-4 flex flex-row-reverse w-full">
          <Button disabled={user.apiKey === ""} variant="contained" color="primary" onClick={onClick}>
            Submit
          </Button>
        </div>
      </div>
      <OnRegistrationModal isOpen={showModal} setIsOpen={setShowModal} />
    </div>
  );
};

export default RegisterYouTubeAPIKey;
