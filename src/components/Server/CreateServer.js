import React, { useState } from "react";

// mui
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  CircularProgress,
} from "@mui/material";
import Slide from "@mui/material/Slide";
import TxtField from "../TxtField";

// services
import { createServer } from "../../service/server.service";

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const vars = ["domain", "ip", "limit"];

const CreateServer = ({ open, onClose, callback }) => {
  // state variables
  const [serv, setserv] = useState({ domain: "", ip: "" });
  const [_err, setErr] = useState(false);
  const [creating, setcreating] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setserv({
      ...serv,
      [name]: value,
    });
  };

  const _editserver = async () => {
    setcreating(true);
    const status = await createServer(serv);
    if (status === "success") {
      setcreating(false);
      callback();
      return;
    } else {
      setErr("Error in saving changes");
      setcreating(false);
    }
  };

  const closeDialog = () => {
    setErr(false);
    setcreating(false);
    onClose();
  };

  React.useEffect(() => {}, []);

  return (
    <Dialog
      open={open}
      TransitionComponent={Transition}
      keepMounted
      onClose={closeDialog}
      aria-labelledby="create-server-form"
    >
      <DialogTitle id="edit-server-form-title">{"Edit Server"}</DialogTitle>
      <DialogContent sx={{ width: "350px" }}>
        <DialogContentText id="edit-server-form-title-description">
          {_err && <p style={{ color: "red" }}>Error in saving changes.</p>}
          {vars.map((k) => (
            <TxtField
              id={k}
              name={k}
              label={k}
              value={serv[k]}
              disabled={creating}
              onChange={handleChange}
            />
          ))}
        </DialogContentText>
        {creating && (
          <div style={{ display: "flex", justifyContent: "center" }}>
            <CircularProgress />
          </div>
        )}
      </DialogContent>
      <DialogActions>
        <Button
          onClick={_editserver}
          variant="contained"
          color="primary"
          disableElevation
          disabled={creating}
        >
          Save changes
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default CreateServer;
