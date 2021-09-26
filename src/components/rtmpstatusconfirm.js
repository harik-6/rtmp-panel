import React from "react";
import {
  Button,
  Dialog,
  DialogActions,
  DialogTitle,
  DialogContentText,
  DialogContent,
} from "@material-ui/core";

const RtmpStatusConfirmationDialog = ({ openForm, closeForm, onYes,status }) => {
  return (
    <Dialog
      open={openForm}
      keepMounted
      onClose={closeForm}
      aria-labelledby="rtmp-status-confirmation"
      fullWidth
    >
      <DialogTitle id="rtmp-status-confirmation">
        {`Are you sure you want to TURN ${status?'OFF':'ON'} the channel?`}
      </DialogTitle>
      <DialogContent>
        <DialogContentText id="rtmp-status-title-description">
          <p>
            Changing status of the channel will automatically reboot your server.
          </p>
        </DialogContentText>
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
          onClick={onYes}
          variant="contained"
          color="primary"
          disableElevation
        >
          Change
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default RtmpStatusConfirmationDialog;
