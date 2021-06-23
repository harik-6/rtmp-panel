import React from "react";
import { IconButton } from "@material-ui/core";
import PlusIcon from "@material-ui/icons/AddRounded";

const FabAddButton = ({ onClickAction }) => {
  return (
    <IconButton
      style={{
        position: "fixed",
        right: "24px",
        bottom: "24px",
        background: "#121858",
      }}
      onClick={onClickAction}
    >
      <PlusIcon style={{ color: "white", fontSize: "32px" }} />
    </IconButton>
  );
};

export default FabAddButton;
