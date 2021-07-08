import React from "react";
import RoundIcon from "@material-ui/icons/FiberManualRecordRounded";

const HealthIcon = ({ status, size }) => {
  return (
    <RoundIcon
      fontSize={size || "small"}
      style={{
        color: status ? "#32CD32" : "red",
      }}
    />
  );
};

export default HealthIcon;
