import React from "react";
import styled from "styled-components";
import { Button, Dialog, DialogActions, DialogContent } from "@mui/material";

import WarningIcon from "@mui/icons-material/WarningAmberRounded";
import Constants from '../constants';

// styled
const Message = styled.p`
  font-size: 18px;
`;

const WarningModal = ({ open, onClose, onYes, message }) => {
  return (
    <Dialog
      open={open}
      keepMounted
      onClose={onClose}
      aria-labelledby="delete-channel-confirmation"
    >
      <DialogContent sx={{ width: "300px", textAlign: "center" }}>
        <WarningIcon sx={{ height: 64, width: 64,color:Constants.secondary_color }} />
        <Message>{message}</Message>
      </DialogContent>
      <DialogActions sx={{ width: "300px" }}>
        <Button
          onClick={onClose}
          variant="outlined"
          color="primary"
          disableElevation
        >
          No
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
