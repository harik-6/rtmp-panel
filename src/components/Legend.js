import React from "react";

// components
import CircleIcon from "@mui/icons-material/FiberManualRecord";
import Constants from "../constants";

const legendColors = {
  live: Constants.live_color,
  idle: Constants.idle_color,
  rtmpcount: "blue",
  hlscount: Constants.secondary_color,
};

const Legend = ({ type }) => {
  return (
    <CircleIcon
      sx={{ height: "16px", width: "16px", color: legendColors[type] }}
    />
  );
};

export default Legend;
