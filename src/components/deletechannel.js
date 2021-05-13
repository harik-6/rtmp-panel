import React from "react";
import {
  Button,
  Dialog,
  DialogActions,
  DialogTitle,
} from "@material-ui/core";

const DeleteConfirmationDialog = ({
  openForm,
  closeForm,
  onDeleteYes,
  name,
}) => {
  return (
    <Dialog
        open={openForm}
        keepMounted
        onClose={closeForm}
        aria-labelledby="delete-channel-confirmation"
        fullWidth
      >
        <DialogTitle id="delete-channel-form-title">
          {`Are you sure you want to delete ${name === null ? "" : name}?`}
        </DialogTitle>
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
            onClick={onDeleteYes}
            variant="contained"
            color="primary"
            disableElevation
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>
  );
};

export default DeleteConfirmationDialog;
