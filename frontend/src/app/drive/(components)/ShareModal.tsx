"use client";
import React, { useState } from "react";
import { Button, TextField, Box } from "@mui/material";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { setShowModal } from "@/redux/slices/shareSlice";
import { httpClient } from "@/axios";
import { AxiosError } from "axios";

const ShareModal = () => {
    const [email, setEmail] = useState<String | null>(null);
    const [error, setError] = useState<String | null>(null);
    const [message, setMessage] = useState<String | null>(null);
    const [disableShareButton, setDisableShareButton] = useState(false);
    const fileNode = useAppSelector((state) => state.share.fileNode);
    const dispatch = useAppDispatch();

    const clearState = () => {
        setEmail(null);
        setError(null);
        setMessage(null);
    };

    const handleShare = async () => {
        setDisableShareButton(true);
        try {
            const response = await httpClient.get(
                `/sharing/create/${email}&${fileNode.id}`
            );
            setError(null);
            setMessage("shard successfully");
            setTimeout(() => {
                dispatch(setShowModal(false));
                setDisableShareButton(false);
                clearState();
            }, 2000);

            //@ts-ignore
        } catch (err: AxiosError) {
            setError(err.response.data.error);
            setDisableShareButton(false);
        }
    };

    return (
        <div
            className="fixed top-0 left-0 w-full h-full flex justify-center items-center bg-black bg-opacity-50 z-50"
            onClick={(e) => {
                e.stopPropagation();
                dispatch(setShowModal(false));
                clearState();
            }}
        >
            <div
                className="bg-white p-6 rounded-md shadow-lg w-full max-w-md relative"
                onClick={(e) => e.stopPropagation()}
            >
                <Button
                    className="absolute top-3 right-3 text-gray-500 hover:text-gray-700"
                    onClick={() => {
                        dispatch(setShowModal(false));
                        clearState();
                    }}
                >
                    &times;
                </Button>
                <h3 className="text-lg font-medium mb-4">{`Share "${fileNode.name}" with`}</h3>
                <TextField
                    type="email"
                    placeholder="Enter email address"
                    className="w-full mb-4"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    error={!!error}
                    helperText={error}
                />
                {message && (
                    <Box className="mb-4" color="primary.main">
                        {message}
                    </Box>
                )}
                <Button
                    className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
                    onClick={handleShare}
                    disabled={disableShareButton}
                >
                    Share
                </Button>
            </div>
        </div>
    );
};

export default ShareModal;
