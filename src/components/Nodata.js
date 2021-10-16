import React from "react";
const Nodata = ({ message }) => {
  return (
    <div
      style={{
        flex: 1,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        width: "100%",
        height: "50vh",
      }}
    >
      <p style={{ fontSize: "20px" }}>
        {message || "No data available."}
      </p>
    </div>
  );
};

export default Nodata;
