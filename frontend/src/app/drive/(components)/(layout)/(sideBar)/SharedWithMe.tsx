import React from "react";
import PeopleAltIcon from "@mui/icons-material/PeopleAlt";
import { Button } from "@mui/material";
const SharedWithMe = () => {
    return (
        <Button
            className="flex justify-start text-black normal-case rounded-full"
            component="label"
            variant="text"
            size="small"
            sx={{
                "&:hover": {
                    backgroundColor: "transparent",
                },
            }}
        >
            <PeopleAltIcon fontSize="small" className="mr-2 ml-5" />
            Shared With Me
        </Button>
    );
};

export default SharedWithMe;
