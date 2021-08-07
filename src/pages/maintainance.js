import React from "react";
const MaintanencePage = () => {
  return (
    <div
      style={{
        height: "100vh",
        width: "100vw",
        backgroundColor: "#ffffff",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
      }}
    >
      <img
        width="450"
        height="450"
        style={{ borderRadius: "16px" }}
        alt="panel under maintainance"
        src="landingbg.png"
      />
      <p style={{ textAlign: "center", fontSize: "18px", marginBottom: "8px" }}>
        Panel is getting updated with features under maintanence.
      </p>
      <p>
        In case of urgent queries contact admin at
        <a
          style={{ color: "#050f66", marginLeft: "8px" }}
          href="https://streamwell.in"
          target="_blank"
          rel="noopener noreferrer"
        >
          Streamwell.
        </a>
      </p>
    </div>
  );
};

export default MaintanencePage;
