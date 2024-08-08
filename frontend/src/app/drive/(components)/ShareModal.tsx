import React, { useState } from "react";
import { Button, TextField, Box } from "@mui/material";
import { useAppDispatch } from "@/redux/hooks";
import { setShowModal } from "@/redux/slices/shareSlice";
import { httpClient } from "@/axios";
import { AxiosError } from "axios";

const ShareModal = () => {
    const [email, setEmail] = useState<String | null>(null);
    const [error, setError] = useState<String | null>(null);
    const [message, setMessage] = useState<String | null>(null);
    const [disableShareButton, setDisableShareButton] = useState(false);
    const dispatch = useAppDispatch();

    const handleShare = async () => {
        setDisableShareButton(true);
        try {
            const response = await httpClient.get(`/sharing/validate/${email}`);
            setError(null);
            setMessage(response.data.message);
            setInterval(() => {
                dispatch(setShowModal(false));
                setDisableShareButton(false);
            }, 2000);

            //@ts-ignore
        } catch (err: AxiosError) {
            setError(err.response.data.error);
            setMessage(null);
        }
    };

    return (
        <div className="fixed top-0 left-0 w-full h-full flex justify-center items-center bg-black bg-opacity-50 z-50">
            <div
                className="bg-white p-6 rounded-md shadow-lg w-full max-w-md relative"
                onClick={(e) => {
                    e.stopPropagation();
                    dispatch(setShowModal(false));
                }}
            >
                <Button
                    className="absolute top-3 right-3 text-gray-500 hover:text-gray-700"
                    onClick={() => alert("close")}
                >
                    &times;
                </Button>
                <h3 className="text-lg font-medium mb-4">Share File</h3>
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
