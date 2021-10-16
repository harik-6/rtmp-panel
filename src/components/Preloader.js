import React from "react";
import { CircularProgress } from "@material-ui/core";
const Preloader = ({ message }) => {
  return (
    <div
      style={{
        flex: 1,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        width: "100%",
        height: "70vh",
      }}
    >
      <CircularProgress />
      <p style={{ fontSize: "20px", marginTop: "24px" }}>
        {message || "Loading."}
      </p>
    </div>
  );
};

export default Preloader;
