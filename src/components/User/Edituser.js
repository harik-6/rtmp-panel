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
import Radio from "@mui/material/Radio";
import RadioGroup from "@mui/material/RadioGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import FormControl from "@mui/material/FormControl";
import FormLabel from "@mui/material/FormLabel";

// components
import TxtField from "../TxtField";

// services
import { editUser } from "../../service/user.service";

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const EditUser = ({ open, onClose, callback, userToEdit }) => {
  // store vaiable
  const { store } = useContext(AppContext);
  const { user } = store;

  // state variabled
  const [creating, setCreating] = useState(false);
  const [err, setErr] = useState(null);
  const [userObj, setUserObj] = useState({
    ...userToEdit,
  });
  const [password, setPassword] = useState("");
  const [preview, setPreview] = useState(
    userObj.access.indexOf("preview") !== -1
  );
  const handleChange = (e) => {
    setUserObj({
      ...userObj,
      [e.target.name]: e.target.value,
    });
  };

  const _validEntries = async () => {
    setErr(null);
    const { username } = userObj;
    if (username.length === 0) {
      setErr("Username cannot be empty");
      return false;
    }
    return true;
  };

  const editExistingUser = async () => {
    setCreating(true);
    const isValid = await _validEntries();
    let access = ["bitrate"];
    if (preview) {
      access.push("preview");
    }
    const _toEdit = {
      ...userObj,
      access,
    };
    if (isValid) {
      const status = await editUser(user, _toEdit, password);
      if (status === "failed") {
        setErr("Error in editing user");
      } else {
        closePopup();
        callback();
      }
    }
    setCreating(false);
  };

  const closePopup = () => {
    setCreating(false);
    setErr(null);
    onClose();
  };
  return (
    <Dialog
      open={open}
      TransitionComponent={Transition}
      keepMounted
      onClose={closePopup}
      aria-labelledby="create-user-form"
    >
      <DialogTitle id="create-user-form-title">{"Edit user"}</DialogTitle>
      <DialogContent sx={{ width: "350px" }}>
        <DialogContentText id="create-user-form-title-description">
          <TxtField
            id="username"
            label="Name"
            name="username"
            value={userObj.username}
            disabled={creating}
            onChange={handleChange}
            error={err}
            helperText={err}
          />
          <TxtField
            id="password"
            name="password"
            label="Password"
            value={password}
            disabled={creating}
            onChange={(ev) => setPassword(ev.target.value)}
          />
          <TxtField
            id="server"
            name="server"
            label="Server"
            value={userObj.server}
            disabled={creating}
            onChange={handleChange}
          />
          <FormControl component="fieldset">
            <FormLabel component="preview-legend">Preview URL</FormLabel>
            <RadioGroup
              row
              aria-label="preview"
              name="preview-radio-buttons-group"
            >
              <FormControlLabel
                onChange={(_) => setPreview(true)}
                checked={preview === true}
                control={<Radio />}
                label="Show"
              />
              <FormControlLabel
                onChange={(_) => setPreview(false)}
                checked={preview === false}
                control={<Radio />}
                label="Hide"
              />
            </RadioGroup>
          </FormControl>
        </DialogContentText>
        {creating && (
          <div style={{ display: "flex", justifyContent: "center" }}>
            <CircularProgress />
          </div>
        )}
      </DialogContent>
      <DialogActions>
        {!creating && (
          <Button
            onClick={editExistingUser}
            variant="contained"
            color="primary"
            disableElevation
          >
            Save changes
          </Button>
        )}
      </DialogActions>
    </Dialog>
  );
};

export default EditUser;
