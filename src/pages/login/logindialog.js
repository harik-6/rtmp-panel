import React, { useState, useContext } from "react";
import {
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  Grid,
  Paper,
  TextField,
  CircularProgress,
  InputAdornment,
} from "@material-ui/core";
import { useHistory } from "react-router-dom";
import EyeOn from "@material-ui/icons/Visibility";
import EyeOff from "@material-ui/icons/VisibilityOff";
import AppConext from "../../context/context";
import service from "../../service/user.service";
import useStyles from "./login.styles";
import CacheService from "../../service/cache.service";

const LoginDialog = ({ openForm, closeForm }) => {
  const classes = useStyles();
  const history = useHistory();
  const [username, setusername] = useState("");
  const [password, setpassword] = useState("");
  const [logingin, setloginin] = useState(false);
  const [error, seterror] = useState(false);
  const [showPass, setShowPass] = useState(false);
  const { actions } = useContext(AppConext);

  const handleusername = (e) => {
    setusername(e.target.value);
  };

  const handlepass = (e) => {
    setpassword(e.target.value);
  };

  const loginUser = async () => {
    setloginin(true);
    CacheService.clear();
    if (username.length > 0 && password.length > 0) {
      const userAndSettings = await service.getUser(username, password);
      if (userAndSettings == null) {
        setloginin(false);
        seterror(true);
        return;
      } else {
        actions.loginUser(userAndSettings);
        history.push("/");
      }
    }
  };

  const togglePassword = () => {
    setShowPass(!showPass);
  };
  return (
    <Dialog
      open={openForm}
      keepMounted
      onClose={closeForm}
      aria-labelledby="login-dialog"
    >
      <DialogTitle id="login-dialog">
        <p className={classes.welcomemsg}>Welcome back</p>
        <p className={classes.loginmessage}>Login to continue</p>
      </DialogTitle>
      <DialogContent style={{ width: "400px" }}>
        <Grid item xs={12} sm={6} lg={12}>
          <form
            onSubmit={(e) => {
              e.preventDefault();
            }}
          >
            <Paper elevation={0} className={classes.loginform}>
              {error && (
                <p style={{ color: "red" }}>Username or Password incorrect.</p>
              )}
              <TextField
                className={classes.txtfield}
                fullWidth
                variant="outlined"
                id="username"
                label="Username"
                value={username}
                onChange={handleusername}
              />
              <TextField
                className={classes.txtfield}
                fullWidth
                variant="outlined"
                id="password"
                label="Password"
                type={showPass ? "text" : "password"}
                value={password}
                onChange={handlepass}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      {!showPass ? (
                        <EyeOff
                          className={classes.eyeIcon}
                          onClick={togglePassword}
                        />
                      ) : (
                        <EyeOn
                          className={classes.eyeIcon}
                          onClick={togglePassword}
                        />
                      )}
                    </InputAdornment>
                  ),
                }}
              />
              {logingin ? (
                <div className={classes.preloadercnt}>
                  <CircularProgress className={classes.preloader} />
                </div>
              ) : (
                <Button
                  onClick={loginUser}
                  variant="contained"
                  color="primary"
                  disableElevation
                  fullWidth
                  className={classes.loginbtn}
                >
                  Login
                </Button>
              )}
            </Paper>
          </form>
        </Grid>
      </DialogContent>
    </Dialog>
  );
};

export default LoginDialog;
