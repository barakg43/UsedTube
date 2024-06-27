import * as React from "react";
import CircularProgress, {
    CircularProgressProps,
} from "@mui/material/CircularProgress";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
type CircularProgressWithLabelProps = CircularProgressProps & {
    label: number | string;
};

export default function CircularProgressWithLabel(
    props: CircularProgressWithLabelProps
) {
    return (
        <Box sx={{ position: "relative", display: "inline-flex" }}>
            <CircularProgress
                variant="indeterminate"
                color="inherit"
                {...props}
            />
            <Box
                sx={{
                    top: 0,
                    left: 0,
                    bottom: 0,
                    right: 0,
                    position: "absolute",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                }}
            >
                <Typography
                    variant="caption"
                    component="div"
                    color="text.secondary"
                >
                    {typeof props.label === "number"
                        ? `${Math.round(props.label)}%`
                        : props.label}
                </Typography>
            </Box>
        </Box>
    );
}
