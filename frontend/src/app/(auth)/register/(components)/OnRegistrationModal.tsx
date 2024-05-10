"use client";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { setShowModal } from "@/redux/slices/generalSlice";
import { RootState } from "@/redux/store";
import { Box, Button, Modal } from "@mui/material";
import Typography from "@mui/material/Typography";
import { useRouter } from "next/navigation";
import React from "react";

const style = {
  position: "absolute" as "absolute",
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
    <Modal open={isOpen} aria-labelledby="registration-success">
      <Box sx={style}>
        <Typography id="registered successfully" variant="h6" component="h2">
          Registration successful!
        </Typography>
        <div className="flex flex-row-reverse space-x-4">
          <Button variant="outlined" onClick={redirectToLogin}>
            <Typography id="what's next" sx={{ mt: 2 }}>
              login
            </Typography>
          </Button>
          <Button variant="outlined" onClick={redirectToHome}>
            <Typography id="what's next" sx={{ mt: 2 }}>
              home
            </Typography>
          </Button>
        </div>
      </Box>
    </Modal>
  );
};

export default OnRegistrationModal;
