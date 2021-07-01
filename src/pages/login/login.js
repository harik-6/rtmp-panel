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
import AppConext from "../../context/context";
import service from "../../service/user.service";
import useStyles from "./login.styles";
import CacheService from "../../service/cache.service";

const Login = () => {
  const classes = useStyles();
  const history = useHistory();
  const [username, setusername] = useState("manikandan");
  const [password, setpassword] = useState("iptelevision@2021");
  const [logingin, setloginin] = useState(false);
  const [error, seterror] = useState(false);
  const [showPass, setShowPass] = useState(false);
  const { actions, appName, appDesc } = useContext(AppConext);

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

  const _setAppName = () => {
    const location = window.location.href;
    if (location.includes("localhost")) {
      actions.setAppName({
        name: "Localhost",
        desc: `Test.<n> New line1.<n> New line2.`,
      });
      return;
    }
    if (location.includes("iptelevision")) {
      actions.setAppName({
        name: "IPtelevision",
        desc: `Dedicated Streaming Server.<n>For contact +91 97154 42908.`,
      });
      return;
    }
  };

  useEffect(() => {
    _setAppName();
    // eslint-disable-next-line
  }, []);

  return (
    <div className={classes.login}>
      <Grid container className={classes.logingrid}>
        <Grid
          style={{ marginTop: "16px", marginBottom: "16px" }}
          item
          xs={12}
          container
          justify="flex-end"
        >
          <Grid item xs={12} lg={2}>
            <Button
              variant="text"
              style={{
                color: "white",
                textTransform: "none",
                textDecoration: "underline",
              }}
            >
              {/* <Link to={`${process.env.PUBLIC_URL}/streamwell_pricing.pdf`} target="_blank" download>
                Download Pricing
              </Link> */}
            </Button>
          </Grid>
        </Grid>
        <Grid
          item
          xs={12}
          sm={12}
          lg={12}
          alignItems="center"
          container
          spacing={1}
          className={classes.gridContainer}
        >
          <Grid item xs={12} sm={12} lg={7}>
            <div className={classes.txtcnt}>
              <p className={classes.maintxt}>{appName}</p>
              <>
                {appDesc.split("<n>").map((text) => (
                  <p className={classes.subtxt}>{text}</p>
                ))}
              </>
            </div>
          </Grid>
          <Grid item xs={12} sm={6} lg={3}>
            <form
              onSubmit={(e) => {
                e.preventDefault();
              }}
            >
              <Paper className={classes.loginform}>
                <p className={classes.welcomemsg}>Welcome back</p>
                <p className={classes.loginmessage}>Login to continue</p>
                {error && (
                  <p style={{ color: "red" }}>
                    Username or Password incorrect.
                  </p>
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
        </Grid>
      </Grid>
    </div>
  );
};

export default Login;
