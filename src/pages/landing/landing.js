import React, { useState, useContext } from "react";
import { AppBar, Toolbar, Button, Typography } from "@material-ui/core";
import Ourservices from "./ourservices";
import PlayArrowRoundedIcon from "@material-ui/icons/PlayArrowRounded";
import useStyles from "./landing.styles";

const Landing = () => {
  const classes = useStyles();
  return (
    <div className={classes.landing}>
      <div className={classes.segment}>
        <AppBar elevation={0} position="static" className={classes.appbar}>
          <Toolbar className={classes.toolbar}>
            <Typography variant="h6" className={classes.title}>
              StreamWell
            </Typography>
            <div className={classes.navbar}>
              <Typography className={classes.navlink} variant="p">
                Services
              </Typography>
              <Typography className={classes.navlink} variant="p">
                Features
              </Typography>
              <Typography className={classes.navlink} variant="p">
                About Us
              </Typography>
              <Button
                className={classes.navlink}
                color="primary"
                variant="outlined"
              >
                Login
              </Button>
            </div>
          </Toolbar>
        </AppBar>
        <div className={classes.greeter}>
          <div className={classes.gleft}>
            <div className={classes.content}>
              <p className={classes.appdesc}>
                Streamwell is an cloud platform for streaming service with low
                latency rtmp streaming servers located in india for different
                users according to their requirements.
              </p>
              <Button
                color="primary"
                variant="contained"
                className={classes.demobutton}
              >
                Request a demo
                <PlayArrowRoundedIcon />
              </Button>
            </div>
          </div>
          <div className={classes.gright}></div>
        </div>
      </div>
      <div className={classes.segment}>
        <Ourservices />
      </div>
    </div>
  );
};

export default Landing;
