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
  FormLabel,
  FormControlLabel,
  RadioGroup,
  Radio,
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
    if (allnames.indexOf(userObj.username) === -1) {
      await service.editUser(user, userObj, password);
      closePopup();
      successCallback();
    } else {
      setErr("User alerady exists");
      setCreating(false);
    }
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
          />
          <FormLabel style={{ marginTop: "8px" }} component="legend">
            Usage
          </FormLabel>
          <RadioGroup
            aria-label="usage"
            name="usage"
            value={userObj.usage === true ? "show" : "hide"}
            onChange={(e) => {
              handleChange({
                target: {
                  name: "usage",
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
          </RadioGroup>
          <FormLabel style={{ marginTop: "8px" }} component="legend">
            Bitrate
          </FormLabel>
          <RadioGroup
            aria-label="bitrate"
            name="bitrate"
            value={userObj.bitrate ? "show" : "hide"}
            onChange={(e) => {
              handleChange({
                target: {
                  name: "bitrate",
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
          </RadioGroup>
          <FormLabel style={{ marginTop: "8px" }} component="legend">
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
          </RadioGroup>
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
