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
import { editServer } from "../../service/server.service";

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const blackListKey = ["id", "isBwLimited", "domains", "version"];

const EditServer = ({ open, onClose, callback, server }) => {
  // state variables
  const [chnl, setChnl] = useState(server);
  const [_err, setErr] = useState(false);
  const [creating, setcreating] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setChnl({
      ...chnl,
      [name]: value,
    });
  };

  const _editChannel = async () => {
    setcreating(true);
    // let domains = chnl.domains.toString();
    // const splitted = domains.split(",");
    const toedit = {
      ...chnl,
    };
    const status = await editServer(toedit);
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

  React.useEffect(() => {
    setChnl(server);
  }, [server]);

  return (
    <Dialog
      open={open}
      TransitionComponent={Transition}
      keepMounted
      onClose={closeDialog}
      aria-labelledby="create-channel-form"
    >
      <DialogTitle id="edit-channel-form-title">{"Edit Server"}</DialogTitle>
      <DialogContent sx={{ width: "350px" }}>
        <DialogContentText id="edit-channel-form-title-description">
          {_err && <p style={{ color: "red" }}>Error in saving changes.</p>}
          {Object.keys(chnl)
            .filter((k) => blackListKey.indexOf(k) === -1)
            .map((k) => (
              <TxtField
                id={k}
                name={k}
                label={k}
                value={chnl[k]}
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
          onClick={_editChannel}
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

export default EditServer;
