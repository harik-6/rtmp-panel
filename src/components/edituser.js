import React, { useState, useContext } from "react";
import { makeStyles, createStyles } from "@material-ui/core/styles";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  TextField,
  CircularProgress,
} from "@material-ui/core";
import Slide from "@material-ui/core/Slide";
import AppContext from "../context/context";
import service from "../service/user.service";

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const useStyles = makeStyles((theme) =>
  createStyles({
    txtfield: {
      marginTop: theme.spacing(2),
      marginBottom: theme.spacing(2),
    },
  })
);

const EditUser = ({
  openForm,
  closeCreatepop,
  successCallback,
  userToEdit,
}) => {
  const { user, allUsers } = useContext(AppContext);
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
    const allnames = allUsers
      .map((user) => user.username)
      .filter((name) => name !== userObj.username);
    if (allnames.indexOf(userObj.username) !== -1) {
      setErr("User alerady exists");
      setCreating(false);
      return;
    }
    const entered = parseInt(userObj.limit);
    if (entered <= 0) {
      setChLimitErr("Invalid channel limit");
      setCreating(false);
      return;
    }
    if (user.usertype === "a") {
      const consumed = allUsers.reduce((prev, cur) => prev + cur.limit, 0);
      const total = consumed + entered;
      if (total > parseInt(user.limit)) {
        setChLimitErr("Channel limit exceeded.");
        setCreating(false);
        return;
      }
    }
    await service.editUser(user, userObj, password);
    closePopup();
    successCallback();
  };

  const closePopup = () => {
    setCreating(false);
    setErr(null);
    closeCreatepop();
  };
  const classes = useStyles();
  return (
    <Dialog
      open={openForm}
      TransitionComponent={Transition}
      keepMounted
      onClose={closePopup}
      aria-labelledby="create-user-form"
      fullWidth
    >
      <DialogTitle id="create-user-form-title">{"Edit user"}</DialogTitle>
      <DialogContent>
        <DialogContentText id="create-user-form-title-description">
          <TextField
            className={classes.txtfield}
            fullWidth
            id="username"
            label="Name"
            name="username"
            value={userObj.username}
            disabled={creating}
            onChange={handleChange}
            error={err}
            helperText={err}
          />
          <TextField
            className={classes.txtfield}
            fullWidth
            id="password"
            name="password"
            label="Password"
            value={password}
            disabled={creating}
            onChange={(ev) => setPassword(ev.target.value)}
          />
          <TextField
            className={classes.txtfield}
            fullWidth
            id="server"
            name="server"
            label="Server"
            value={userObj.server}
            disabled={creating}
            onChange={handleChange}
          />
          <TextField
            className={classes.txtfield}
            fullWidth
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
          {/* <FormLabel style={{ marginTop: "8px" }} component="legend">
            PlayUrl
          </FormLabel>
          <RadioGroup
            aria-label="preview"
            name="preview"
            value={userObj.preview ? "show" : "hide"}
            onChange={(e) => {
              handleChange({
                target: {
                  name: "preview",
                  value: e.target.value === "show" ? true : false,
                },
              });
            }}
            style={{ display: "flex", flexDirection: "row" }}
          >
            <FormControlLabel
              value={"show"}
              control={<Radio />}
              label="Show"
              disabled={creating}
            />
            <FormControlLabel
              value={"hide"}
              control={<Radio />}
              label="Hide"
              disabled={creating}
            />
          </RadioGroup> */}
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
