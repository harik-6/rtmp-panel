import React from "react";
import {
  Button,
  Dialog,
  DialogActions,
  DialogTitle,
  DialogContent,
} from "@mui/material";

const WarningModal = ({ open, onClose, onYes, message }) => {
  return (
    <Dialog
      open={open}
      keepMounted
      onClose={onClose}
      aria-labelledby="delete-channel-confirmation"
    >
      <DialogTitle id="delete-channel-form-title" sx={{ width: "300px" }}>
        {message}
      </DialogTitle>
      <DialogActions sx={{ width: "300px" }}>
        <Button
          onClick={onClose}
          variant="outlined"
          color="primary"
          disableElevation
        >
          Cancel
        </Button>
        <Button
          onClick={onYes}
          variant="contained"
          color="primary"
          disableElevation
        >
          Yes
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default WarningModal;
