import React from "react";
import { Typography, Container } from "@mui/material";

const Unauthorized = () => {
  return (
    <Container sx={{ mt: 10, textAlign: "center" }}>
      <Typography variant="h4" color="error" gutterBottom>
        403 - Unauthorized Access
      </Typography>
      <Typography variant="subtitle1">
        You do not have permission to view this page.
      </Typography>
    </Container>
  );
};

export default Unauthorized;
