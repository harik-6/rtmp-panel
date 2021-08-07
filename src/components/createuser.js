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

const CreateNewUser = ({ openForm, closeCreatepop, successCallback }) => {
  const { user, allUsers } = useContext(AppContext);
  const [creating, setCreating] = useState(false);
  const [err, setErr] = useState(null);
  const [chLimitErr, setChLimitErr] = useState(null);
  const [userObj, setUserObj] = useState({
    username: "",
    password: "",
    limit: 1,
    server: "",
    owner: user["_id"],
    usage: false,
    bitrate: false,
    preview: false,
  });

  const handleChange = (e) => {
    setUserObj({
      ...userObj,
      [e.target.name]: e.target.value,
    });
  };

  const addNewUser = async () => {
    setCreating(true);
    setErr(null);
    const allnames = allUsers.map((user) => user.username);
    const chCountsofar = allUsers.reduce((prev, cur) => prev + cur.limit, 0);
    if (parseInt(user.limit) <= 0) {
      setChLimitErr("Invalid channel limit");
      setCreating(false);
      return;
    }
    console.log("Consumed overall limit",chCountsofar);
    console.log("Current limit",userObj.limit);
    console.log("Maximum allowed",user.limit);
    if (chCountsofar + userObj.limit > user.limit) {
      setChLimitErr("Channel limit exceeded.");
      setCreating(false);
      return;
    }
    if (allnames.indexOf(userObj.username) === -1) {
      await service.createUser(user, userObj);
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
    setChLimitErr(null);
    setUserObj({
      username: "",
      password: "",
      limit: 1,
      server: "",
      owner: user["_id"],
      usage: false,
      bitrate: false,
      preview: false,
    });
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
      <DialogTitle id="create-user-form-title">{"Create new user"}</DialogTitle>
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
            value={userObj.password}
            disabled={creating}
            onChange={handleChange}
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
          <FormLabel style={{ marginTop: "8px" }} component="legend">
            Usage
          </FormLabel>
          <RadioGroup
            aria-label="usage"
            name="usage"
            value={userObj.usage ? "show" : "hide"}
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
            onClick={addNewUser}
            variant="contained"
            color="primary"
            disableElevation
          >
            Create
          </Button>
        )}
      </DialogActions>
    </Dialog>
  );
};

export default CreateNewUser;
