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
  TextField,
  CircularProgress,
} from "@mui/material";
import Slide from "@mui/material/Slide";

// components
import TxtField from "./TxtField";

// services
import { editUser } from "../service/user.service";

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const EditUser = ({ open, onClose, callback, userToEdit }) => {
  // store vaiable
  const { store } = useContext(AppContext);
  const { user, users } = store;

  // state variabled
  const [creating, setCreating] = useState(false);
  const [err, setErr] = useState(null);
  const [chLimitErr, setChLimitErr] = useState(null);
  const [userObj, setUserObj] = useState({
    ...userToEdit,
  });
  const [password, setPassword] = useState("");
  const handleChange = (e) => {
    setUserObj({
      ...userObj,
      [e.target.name]: e.target.value,
    });
  };

  const editExistingUser = async () => {
    setCreating(true);
    setErr(null);
    const entered = parseInt(userObj.limit);
    if (entered <= 0) {
      setChLimitErr("Invalid channel limit");
      setCreating(false);
      return;
    }
    if (user.usertype === "a") {
      const consumed = users.reduce((prev, cur) => prev + cur.limit, 0);
      const total = consumed + entered;
      if (total > parseInt(user.limit)) {
        setChLimitErr("Channel limit exceeded.");
        setCreating(false);
        return;
      }
    }
    await editUser(user, userObj, password);
    closePopup();
    callback();
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
          <TxtField
            id="limit"
            name="limit"
            label="Limit"
            value={userObj.limit}
            type="number"
            disabled={creating}
            onChange={handleChange}
            error={chLimitErr}
            helperText={chLimitErr}
          />
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
