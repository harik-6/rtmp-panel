import React from "react";
import {
  Button,
  Dialog,
  DialogActions,
  DialogTitle,
  DialogContentText,
  DialogContent,
} from "@mui/material";
import ContactIcons from "./contacticons";

const RequestDemo = ({ openForm, closeForm }) => {
  return (
    <Dialog
      open={openForm}
      keepMounted
      onClose={closeForm}
      aria-labelledby="request-demo-confirmation"
      fullWidth
    >
      <DialogTitle id="rtmp-status-confirmation">
        For requesting a free demo, please contact our business team.
      </DialogTitle>
      <DialogContent>
        <DialogContentText>Business Team, Streamwell.</DialogContentText>
        <ContactIcons />
      </DialogContent>
      <DialogActions>
        <Button
          onClick={closeForm}
          variant="contained"
          color="primary"
          disableElevation
        >
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default RequestDemo;
