import { Box, Button, Modal } from "@mui/material";
import Typography from "@mui/material/Typography";
import { redirect } from "next/navigation";
import React from "react";

const style = {
  position: "absolute" as "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "background.paper",
  border: "2px solid #000",
  boxShadow: 24,
  p: 4,
};

const OnRegistrationModal: React.FC<{ isOpen: boolean }> = ({ isOpen }) => {
  return (
    <Modal open={isOpen} aria-labelledby="registration-success">
      <Box sx={style}>
        <Typography id="registered successfully" variant="h6" component="h2">
          Registration successful!
        </Typography>
        <div className="">
          <Button
            variant="outlined"
            onClick={() => {
              redirect("/login");
            }}
          >
            <Typography id="what's next" sx={{ mt: 2 }}>
              login
            </Typography>
          </Button>
          <Button
            variant="outlined"
            onClick={() => {
              redirect("/");
            }}
          >
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
