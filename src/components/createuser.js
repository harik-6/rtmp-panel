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
  const [userObj, setUserObj] = useState({
    username: "",
    password: "",
    channelLimit: 1,
    billinDate: 15,
    showUsage: true,
    userStub: "live",
    userServer: "",
    streamExt: "m3u8",
    httpProtocol: "http",
    httpPort: "8080",
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
    setUserObj({
      username: "",
      password: "",
      channelLimit: 1,
      userStub: "live",
      userServer: "",
      streamExt: "m3u8",
      httpProtocol: "http",
      httpPort: "8080",
      billinDate: 15,
      showUsage: true,
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
            id="userServer"
            name="userServer"
            label="Server"
            value={userObj.userServer}
            disabled={creating}
            onChange={handleChange}
          />
          <TextField
            className={classes.txtfield}
            fullWidth
            id="userStub"
            name="userStub"
            label="Stream sufffux"
            value={userObj.userStub}
            disabled={creating}
            onChange={handleChange}
          />
          <TextField
            className={classes.txtfield}
            fullWidth
            id="channelLimit"
            name="channelLimit"
            label="Limit"
            value={userObj.channelLimit}
            type="number"
            disabled={creating}
            onChange={handleChange}
          />
          <TextField
            className={classes.txtfield}
            fullWidth
            id="billinDate"
            name="billinDate"
            label="Billing Date"
            value={userObj.billinDate}
            type="number"
            disabled={creating}
            onChange={handleChange}
          />
          <FormLabel component="legend">Security</FormLabel>
          <RadioGroup
            aria-label="httpProtocol"
            name="httpProtocol"
            value={userObj.httpProtocol}
            onChange={handleChange}
            style={{ display: "flex", flexDirection: "row" }}
          >
            <FormControlLabel
              value="http"
              control={<Radio />}
              label="HTTP"
              disabled={creating}
            />
            <FormControlLabel
              value="https"
              control={<Radio />}
              label="HTTPS"
              disabled={creating}
            />
          </RadioGroup>
          <FormLabel style={{marginTop : "8px"}} component="legend">Usage</FormLabel>
          <RadioGroup
            aria-label="showUsage"
            name="showUsage"
            value={userObj.showUsage}
            onChange={handleChange}
            style={{ display: "flex", flexDirection: "row" }}
          >
            <FormControlLabel
              value={true}
              control={<Radio />}
              label="Show"
              disabled={creating}
            />
            <FormControlLabel
              value={false}
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
