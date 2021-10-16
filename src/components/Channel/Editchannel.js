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
import TxtField from "../TxtField";

// services
import {
  isChannelnameAllowed,
  editchannel,
} from "../../service/channel.service";

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const EditChannel = ({ open, onClose, callback, channel }) => {
  console.log("Edit channle", channel);
  // store variables
  const { store } = useContext(AppContext);
  const { user } = store;

  // state variables
  const [chnl, setChnl] = useState(channel);
  const [_err, setErr] = useState(false);
  const [creating, setcreating] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setChnl({
      ...chnl,
      [name]: value,
    });
  };

  const _validEntries = async () => {
    setErr(null);
    const { name } = chnl;
    if (name.length === 0) {
      setErr("Channel name cannot be empty");
      return false;
    }
    const isNameValid = await isChannelnameAllowed(user, name);
    if (!isNameValid) {
      setErr("Channel name already exists");
      return false;
    }
    return true;
  };

  const _editChannel = async () => {
    setcreating(true);
    const isValid = await _validEntries();
    if (isValid) {
      await editchannel(chnl, user);
      callback();
      closeDialog();
    }
    setcreating(false);
  };

  const closeDialog = () => {
    setErr(false);
    setcreating(false);
    setChnl({});
    onClose();
  };

  React.useEffect(() => {
    setChnl(channel);
  }, [channel]);

  return (
    <Dialog
      open={open}
      TransitionComponent={Transition}
      keepMounted
      onClose={closeDialog}
      aria-labelledby="create-channel-form"
    >
      <DialogTitle id="edit-channel-form-title">{"Edit channel"}</DialogTitle>
      <DialogContent sx={{ width: "350px" }}>
        <DialogContentText id="edit-channel-form-title-description">
          <TxtField
            id="name"
            name="name"
            label="Name"
            value={chnl.name}
            disabled={creating}
            onChange={handleChange}
          />
          {_err && <p style={{ color: "red" }}>Name already exists.</p>}
          <TxtField
            id="key"
            name="key"
            label="Key"
            value={chnl.key}
            disabled={creating}
            onChange={handleChange}
          />
          <TxtField
            id="server"
            name="server"
            label="Server"
            value={chnl.server}
            disabled={creating}
            onChange={handleChange}
          />
          <TxtField
            id="stream"
            name="stream"
            label="Stream url"
            value={chnl.stream}
            disabled={creating}
            onChange={handleChange}
          />
          <TxtField
            id="rtmp"
            name="rtmp"
            label="Rtmp play url"
            value={chnl.rtmp}
            disabled={creating}
            onChange={handleChange}
          />
          <TxtField
            id="hls"
            name="hls"
            label="Hls play url"
            value={chnl.hls}
            disabled={creating}
            onChange={handleChange}
          />
          <TxtField
            id="token"
            name="token"
            label="Token"
            value={chnl.token}
            disabled={creating}
            onChange={handleChange}
          />
          <TxtField
            id="preview"
            name="preview"
            label="Preview play url"
            value={chnl.preview}
            disabled={creating}
            onChange={handleChange}
          />
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

export default EditChannel;
