import React, { useState, useContext, useEffect } from "react";
import {
  Grid,
  Paper,
  TextField,
  Button,
  CircularProgress,
  InputAdornment,
} from "@material-ui/core";
// import {Link} from "react-router-dom";
import { useHistory } from "react-router-dom";
import EyeOn from "@material-ui/icons/Visibility";
import EyeOff from "@material-ui/icons/VisibilityOff";
import LockIcon from "@material-ui/icons/Lock";
import AppConext from "../../context/context";
import useStyles from "./login.styles";
import CacheService from "../../service/cache.service";
import Actions from "../../context/actions";

// services
import { getUser } from "../../service/user.service";

const Login = () => {
  const classes = useStyles();
  const history = useHistory();

  // store varibles
  const {
    dispatch,
    store: { appDesc, appName },
  } = useContext(AppConext);

  // state variables
  const [username, setusername] = useState("admin@streamwell");
  const [password, setpassword] = useState("@dm1n@$tream248well");
  const [logingin, setloginin] = useState(false);
  const [error, seterror] = useState(false);
  const [showPass, setShowPass] = useState(false);

  const handleusername = (e) => {
    setusername(e.target.value);
  };

  const handlepass = (e) => {
    setpassword(e.target.value);
  };

  const _loginUser = async () => {
    setloginin(true);
    CacheService.clear();
    if (username.length > 0 && password.length > 0) {
      const user = await getUser(username, password);
      if (user === null) {
        setloginin(false);
        seterror(true);
        return;
      } else {
        dispatch({
          type: Actions.SET_USER,
          payload: user,
        });
        history.push("/");
      }
    }
  };

  const _dispatchAppData = (name, desc) => {
    dispatch({
      type: Actions.SET_APPNAME,
      payload: {
        appName: name,
        appDesc: desc,
      },
    });
  };

  const togglePassword = () => {
    setShowPass(!showPass);
  };

  const _setAppName = () => {
    const location = window.location.href;
    if (location.includes("localhost")) {
      _dispatchAppData(
        "Localhost",
        "Dedicated Streaming Server Provider.<n>For contact +91 79040 37932."
      );
      return;
    }
    if (location.includes("iptelevision")) {
      _dispatchAppData(
        "IPtelevision",
        "Dedicated Streaming Server Provider.<n>For contact +91 97154 42908."
      );
      return;
    }
    if (location.includes("teluguwebsolutions")) {
      _dispatchAppData(
        "Telugu Web Solutions",
        "Dedicated Streaming Server Provider.<n>For contact +91 70757 57910."
      );
      return;
    }
  };

  useEffect(() => {
    _setAppName();
    // _loginUser();
    // eslint-disable-next-line
  }, []);

  return (
    <div className={classes.login}>
      <div className={classes.leftgrid}>
        <div className={classes.txtcontainer}>
          <p className={classes.maintxt}>{appName}</p>
          <>
            {appDesc.split("<n>").map((text, i) => (
              <p key={i} className={classes.subtxt}>
                {text}
              </p>
            ))}
          </>
        </div>
      </div>
      <div className={classes.rightgrid}>
        <Grid item xs={10} sm={10} lg={6}>
          <form
            onSubmit={(e) => {
              e.preventDefault();
            }}
          >
            <Paper elevation={4} className={classes.loginform}>
              <p className={classes.welcomemsg}>Welcome back</p>
              <p className={classes.loginmessage}>Login to continue</p>
              <p
                style={{
                  textAlign: "center",
                }}
              >
                <LockIcon color="primary" fontSize="large" />
              </p>
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
                  onClick={_loginUser}
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
      </div>
    </div>
  );
};

export default Login;
