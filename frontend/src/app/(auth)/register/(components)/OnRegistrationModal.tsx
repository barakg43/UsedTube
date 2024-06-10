"use client";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { setShowModal } from "@/redux/slices/generalSlice";
import { RootState } from "@/redux/store";
import { Box, Button, Modal } from "@mui/material";
import Typography from "@mui/material/Typography";
import { useRouter } from "next/navigation";
import React from "react";

const style = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: 400,
    bgcolor: "background.paper",
    boxShadow: 24,
    p: 4,
};

const OnRegistrationModal: React.FC = () => {
    const isOpen = useAppSelector((s: RootState) => s.general.showModal);
    const dispatch = useAppDispatch();
    const router = useRouter();
    const redirectToLogin = () => {
        dispatch(setShowModal(false));
        router.push("/login");
    };

    const redirectToHome = () => {
        dispatch(setShowModal(false));
        router.push("/");
    };
    return (
        <Modal
            open={isOpen}
            className=" "
            aria-labelledby="registration-success"
        >
            <Box className=" top-1/2 left-1/2 rounded-xl absolute w-[300px] bg-paper p-5 -translate-x-1/2 -translate-y-1/2 outline-none">
                <Typography
                    id="registered successfully"
                    variant="h6"
                    component="h2"
                >
                    registration successful
                </Typography>
                <Typography
                    className="ml-4 mb-4"
                    id="what's next"
                    sx={{ mt: 2 }}
                >
                    {"what's next?"}
                </Typography>
                <div className="flex justify-center">
                    <Button
                        className="mr-2"
                        variant="outlined"
                        onClick={redirectToLogin}
                    >
                        <Typography variant="button" id="what's next">
                            login
                        </Typography>
                    </Button>
                    <Button
                        className="ml-2"
                        variant="outlined"
                        onClick={redirectToHome}
                    >
                        <Typography variant="button" id="what's next">
                            home
                        </Typography>
                    </Button>
                </div>
            </Box>
        </Modal>
    );
};

export default OnRegistrationModal;
