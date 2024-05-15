import { createTheme } from "@mui/material";

export const theme = createTheme({
  palette: {
    primary: {
      main: "#000000", // Set the primary color to black
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: "1rem",
          backgroundColor: "#F0EBE3",
          color: "#000000",
          "&:hover": {
            backgroundColor: "#DEDEDE", // Darker shade for hover effect
          },
        },
      },
    },
  },
});
