import React, { useState, useContext } from "react";
import AppContext from "../../context/context";

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

// components
// import ServerSelect from "../Serverselect";
import TxtField from "../TxtField";

// services
import { createChannel } from "../../service/channel.service";

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const CreateNewChannel = ({ open, onClose, callback, server }) => {
  // store variables
  const { store } = useContext(AppContext);
  const { user } = store;

  // state variables
  const [_name, setName] = useState("");
  const [creating, setcreating] = useState(false);
  const [_err, setErr] = useState(false);

  const _validEntries = async () => {
    setErr(null);
    if (_name.length === 0) {
      setErr("Channel name cannot be empty");
      return false;
    }
    return true;
  };

  const createNewChannel = async () => {
    setcreating(true);
    const isValid = await _validEntries();
    if (isValid) {
      const status = await createChannel(user, _name, server);
      if (status === "failed") {
        setErr("Error in creating channel");
      } else {
        onClose();
        callback();
      }
    }
    setcreating(false);
  };

  const closePopup = () => {
    setName("");
    setErr(false);
    setcreating(false);
    onClose();
  };

  return (
    <Dialog
      open={open}
      TransitionComponent={Transition}
      keepMounted
      onClose={closePopup}
      aria-labelledby="create-channel-form"
    >
      <DialogTitle id="create-channel-form-title">
        {"Create a new channel"}
      </DialogTitle>
      <DialogContent sx={{ width: "350px" }}>
        <DialogContentText id="create-channel-form-title-description">
          {/* <ServerSelect
            selectedServer={_server}
            serverNames={servers}
            onSelect={setSelectedServer}
          /> */}
          <TxtField
            id="_server"
            label="Server"
            value={server}
            // onChange={(e) => setName(e.target.value)}
          />
          <TxtField
            id="_name"
            label="Channel name"
            value={_name}
            disabled={creating}
            onChange={(e) => setName(e.target.value)}
          />
          {_err && <p style={{ color: "red" }}>Error in creating channel.</p>}
        </DialogContentText>
        {creating && (
          <div style={{ display: "flex", justifyContent: "center" }}>
            <CircularProgress />
          </div>
        )}
      </DialogContent>
      <DialogActions>
        <Button
          onClick={createNewChannel}
          variant="contained"
          color="primary"
          disableElevation
          disabled={creating}
        >
          Create
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default CreateNewChannel;
