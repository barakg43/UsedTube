import { createTheme } from "@mui/material";

export const theme = createTheme({
  palette: {
    primary: {
      main: "rgba(0, 0, 0, 0.12)", // Set the primary color to black
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: "4px",
          borderColor: "rgba(0, 0, 0, 0.12)",
          borderWidth: "0.5px",
          backgroundColor: "#F0EBE3",
          color: "#000000",
          //   "&:hover": {
          //     backgroundColor: "#DEDEDE", // Darker shade for hover effect
          //   },
        },
      },
    },
  },
});
