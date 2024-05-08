import { Box } from "@mui/material";

function page() {
  return (
    <Box
      //   style={{ textAlign: "center" }}
      flex={1}
      height={"100vh"}
      justifyContent='flex-start'
      alignItems='center'
      display='flex'
      flexDirection='column'
    >
      <h1>Drive</h1>
    </Box>
  );
}

export default page;
