import React from "react";
import {
  Button,
  Dialog,
  DialogActions,
  DialogTitle,
  DialogContentText,
  DialogContent,
} from "@material-ui/core";

const RebootConfirmationDialog = ({ openForm, closeForm, onYes }) => {
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
            Rebooting server will automatically log you out for security
            reasons.Please login after 2-3 minutes to continue.
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
          Reboot
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default RebootConfirmationDialog;
