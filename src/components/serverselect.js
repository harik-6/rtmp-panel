import React, { useState } from "react";
import { Button, Menu, MenuItem, FormLabel } from "@material-ui/core";
import DownArrowIcon from "@material-ui/icons/ExpandMoreRounded";

const ServerSelect = ({
  serverNames,
  onSelect,
  selectedServer,
  labelVisible,
}) => {
  const [anchorEl, setAnchorEl] = useState(null);
  const visible = labelVisible ===false? false : true;

  return (
    <React.Fragment>
      {visible && <FormLabel component="legend">Choose server</FormLabel>}
      <Button
        aria-controls="change-ownwer-menu"
        aria-haspopup="true"
        onClick={(event) => setAnchorEl(event.currentTarget)}
        disableElevation
        style={{ marginTop: "16px", marginBottom: "-16px" }}
      >
        {selectedServer}
        <DownArrowIcon />
      </Button>
      <Menu
        id="choose-server-menu"
        anchorEl={anchorEl}
        keepMounted
        open={Boolean(anchorEl)}
        onClose={() => setAnchorEl(null)}
      >
        {(serverNames || []).map((servername) => (
          <MenuItem
            key={servername}
            onClick={() => {
              onSelect(servername);
              setAnchorEl(null);
            }}
          >
            {servername}
          </MenuItem>
        ))}
      </Menu>
    </React.Fragment>
  );
};

export default ServerSelect;
