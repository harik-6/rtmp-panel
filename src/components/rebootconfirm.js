import React, { useState, useContext } from "react";
import {
  Button,
  Dialog,
  DialogActions,
  DialogTitle,
  DialogContentText,
  DialogContent,
  FormLabel,
  Menu,
  MenuItem,
} from "@material-ui/core";
import DownArrowIcon from "@material-ui/icons/ExpandMoreRounded";
import AppContext from "../context/context";
import { rebootServer } from "../service/rtmp.service";

const RebootConfirmationDialog = ({ openForm, closeForm }) => {
  const text = "Choose server to reboot";
  const { channels } = useContext(AppContext);
  const [anchorEl, setAnchorEl] = useState(null);
  const [server, setServer] = useState(text);
  const rebootRtmpServer = async () => {
    if (server !== text) {
      const channellist = (channels || []).filter((ch) => ch.server === server);
      await rebootServer(channellist);
      closeForm();
    }
  };

  return (
    <Dialog
      open={openForm}
      keepMounted
      onClose={closeForm}
      aria-labelledby="reboot-server-confirmation"
      fullWidth
    >
      <DialogTitle id="reboot-server-confirmation">
        {`Are you sure you want to reboot your server?`}
      </DialogTitle>
      <DialogContent>
        <DialogContentText id="reboot-server-title-description">
          <p>
            Rebooting server will automatically disconnect and reconnect all the
            live running stream.Would you like to reboot?.
          </p>
        </DialogContentText>
        <FormLabel component="legend">Choose Server</FormLabel>
        <Button
          aria-controls="change-ownwer-menu"
          aria-haspopup="true"
          onClick={(event) => setAnchorEl(event.currentTarget)}
          disableElevation
          style={{ marginTop: "16px", marginBottom: "-16px" }}
        >
          {server}
          <DownArrowIcon />
        </Button>
        <Menu
          id="choose-server-menu"
          anchorEl={anchorEl}
          keepMounted
          open={Boolean(anchorEl)}
          onClose={() => setAnchorEl(null)}
        >
          {[...new Set((channels || []).map((ch) => ch.server))].map(
            (servername) => (
              <MenuItem
                key={servername}
                onClick={() => {
                  setServer(servername);
                  setAnchorEl(null);
                }}
              >
                {servername}
              </MenuItem>
            )
          )}
        </Menu>
      </DialogContent>
      <DialogActions>
        <Button
          onClick={closeForm}
          variant="outlined"
          color="primary"
          disableElevation
        >
          Close
        </Button>
        <Button
          onClick={rebootRtmpServer}
          variant="contained"
          color="primary"
          disableElevation
        >
          Reboot
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default RebootConfirmationDialog;
