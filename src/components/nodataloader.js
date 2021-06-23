import React from "react";
const Nodataloader = ({ message }) => {
  return (
    <div
      style={{
        flex: 1,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        width: "100%",
        height: "600px",
      }}
    >
      <p style={{ fontSize: "20px", paddingTop: "16px" }}>
        {message || "No data available."}
      </p>
    </div>
  );
};

export default Nodataloader;
