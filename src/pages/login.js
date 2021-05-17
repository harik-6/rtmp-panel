import React, { useState, useContext } from "react";
import { makeStyles, createStyles } from "@material-ui/core/styles";
import {
  Grid,
  Paper,
  TextField,
  Button,
  CircularProgress,
} from "@material-ui/core";
import {Link} from "react-router-dom";
import AppConext from "../context/context";
import service from "../service/user.service";

const useStyles = makeStyles((theme) =>
  createStyles({
    login: {
      height: "100%",
      width: "100%",
      backgroundImage: `url(${process.env.PUBLIC_URL}/bg2.jpg)`,
      overflowX: "hidden",
    },
    loginform: {
      height: "auto",
      paddingLeft: theme.spacing(3),
      paddingRight: theme.spacing(3),
    },
    txtfield: {
      marginTop: theme.spacing(2),
      marginBottom: theme.spacing(2),
    },
    welcomemsg: {
      textAlign: "center",
      fontSize: "20px",
      fontWeight: "bold",
      paddingTop: theme.spacing(3),
    },
    loginmessage: {
      textAlign: "center",
      fontSize: "14px",
      paddingBottom: theme.spacing(4),
    },
    loginbtn: {
      marginTop: theme.spacing(5),
      marginBottom: theme.spacing(6),
    },
    maintxt: {
      fontSize: "100px",
      color: "#ffffff",
      fontWeight: "bold",
    },
    subtxt: {
      fontSize: "18px",
      color: "#ffffff",
    },
    txtcnt: {
      padding: theme.spacing(6),
    },
    preloadercnt: {
      display: "flex",
      flexDirection: "row",
      justifyContent: "center",
    },
    preloader: {
      marginTop: theme.spacing(5),
      marginBottom: theme.spacing(6),
    },
  })
);

const Login = () => {
  const classes = useStyles();
  const [username, setusername] = useState("");
  const [password, setpassword] = useState("");
  const [logingin, setloginin] = useState(false);
  const [error, seterror] = useState(false);
  const { actions } = useContext(AppConext);

  const handleusername = (e) => {
    setusername(e.target.value);
  };

  const handlepass = (e) => {
    setpassword(e.target.value);
  };
  const loginUser = async () => {
    setloginin(true);
    if (username.length > 0 && password.length > 0) {
      const user = await service.getUser(username, password);
      if (user == null) {
        setloginin(false);
        seterror(true);
        return;
      } else {
        actions.loginUser(user);
      }
    }
  };
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
              <Link to={`${process.env.PUBLIC_URL}/streamwell_pricing.pdf`} target="_blank" download>
                Download Pricing
              </Link>
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
          style={{ marginTop: "32px" }}
        >
          <Grid item xs={7} sm={6} lg={7}>
            <div className={classes.txtcnt}>
              <p className={classes.maintxt}>{process.env.REACT_APP_NAME}</p>
              <p className={classes.subtxt}>
                While Stream is well, All is Well.
              </p>
            </div>
          </Grid>
          <Grid item xs={12} sm={6} lg={3}>
            <Paper className={classes.loginform}>
              <p className={classes.welcomemsg}>Welcome back</p>
              <p className={classes.loginmessage}>Login to continue</p>
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
                type="password"
                value={password}
                onChange={handlepass}
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
          </Grid>
        </Grid>
      </Grid>
    </div>
  );
};

export default Login;
