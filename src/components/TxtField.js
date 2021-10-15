import React from "react";

// mui
import TextField from "@mui/material/TextField";

const TxtField = (props) => {
  return (
    <TextField
      sx={{ margin: "16px 0" }}
      {...props}
      fullWidth
    />
  );
};

export default TxtField;
