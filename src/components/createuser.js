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

const CreateNewUser = ({ openForm, closeCreatepop, successCallback }) => {
  const { user, allUsers } = useContext(AppContext);
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
      server: "",
    });
    closeCreatepop();
  };

  const consumed = allUsers.reduce((prev, cur) => prev + cur.limit, 0);
  const max = user.limit;
  let chLimitErr = false;
  if(user.usertype === "s") {
    chLimitErr = false; 
  } else {  
     chLimitErr = max - consumed < 1;
  }
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
          {chLimitErr ? (
            <>
              <DialogTitle id="limit-excedded">
                {"Channel limit exceeded."}
              </DialogTitle>
            </>
          ) : (
            <>
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
            </>
          )}
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
