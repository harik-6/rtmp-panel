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
import { editchannel } from "../../service/channel.service";

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const blackListMap = {
  id: true,
  status: true,
};

const EditChannel = ({ open, onClose, callback, channel }) => {

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
    return true;
  };

  const _editChannel = async () => {
    setcreating(true);
    const isValid = await _validEntries();
    if (isValid) {
      const status = await editchannel(chnl, user);
      if (status === "failed") {
        setErr(true);
      } else {
        callback();
        closeDialog();
      }
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
          {_err && <p style={{ color: "red" }}>Error in saving changes.</p>}
          {Object.keys(chnl)
            .filter((k) => !blackListMap[k])
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

export default EditChannel;
