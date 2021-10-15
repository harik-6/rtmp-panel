import React, { useState, useContext } from "react";
import AppContext from "../context/context";

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
import ServerSelect from "./Serverselect";
import TxtField from "./TxtField";

// services
import { createChannel } from "../service/channel.service";

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const CreateNewChannel = ({ open, onClose, callback }) => {
  // store variables
  const { store } = useContext(AppContext);
  const { user, servers } = store;

  // state variables
  const [_name, setName] = useState("");
  const [creating, setcreating] = useState(false);
  const [_err, setErr] = useState(false);
  const [_server, setSelectedServer] = useState(user.server);

  const createNewChannel = async () => {
    if (_name.length > 0) {
      setcreating(true);
      const channel = await createChannel(user, _name, _server);
      if (channel !== null) {
        setcreating(false);
        onClose();
        callback();
      }
    }
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
          <ServerSelect
            selectedServer={_server}
            serverNames={servers}
            onSelect={setSelectedServer}
          />
          <TxtField
            id="_name"
            label="Channel name"
            value={_name}
            disabled={creating}
            onChange={(e) => setName(e.target.value)}
          />
          {_err && <p style={{ color: "red" }}>Name already exists.</p>}
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
