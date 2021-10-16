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

// services
import { createUser, isUsernameAllowed } from "../../service/user.service";
import TxtField from "../TxtField";

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const CreateNewUser = ({ open, onClose, callback }) => {
  // store variables
  const { store } = useContext(AppContext);
  const { user } = store;

  // state variables
  const [creating, setCreating] = useState(false);
  const [err, setErr] = useState(null);
  const [userObj, setUserObj] = useState({
    username: "",
    password: "",
    server: "",
  });

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
    const isNameValid = await isUsernameAllowed(username);
    if (!isNameValid) {
      setErr("Username already exists");
      return false;
    }
    return true;
  };

  const addNewUser = async () => {
    setCreating(true);
    const isValid = await _validEntries();
    if (isValid) {
      await createUser(user, userObj);
      onClose();
      callback();
    }
    setCreating(false);
  };

  const closePopup = () => {
    setCreating(false);
    setErr(null);
    setUserObj({
      username: "",
      password: "",
      server: "",
    });
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
      <DialogTitle id="create-user-form-title">{"Create new user"}</DialogTitle>
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
            value={userObj.password}
            disabled={creating}
            onChange={handleChange}
          />
          <TxtField
            id="server"
            name="server"
            label="Server"
            value={userObj.server}
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
          onClick={addNewUser}
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

export default CreateNewUser;
