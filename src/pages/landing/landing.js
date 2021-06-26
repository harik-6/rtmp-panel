import React, { useState } from "react";
import { AppBar, Toolbar, Button, Typography } from "@material-ui/core";
import PlayArrowRoundedIcon from "@material-ui/icons/PlayArrowRounded";
import LoginDialog from "../login/logindialog";
import Ourservices from "./ourservices";
import Aboutus from "./aboutus";
import useStyles from "./landing.styles";

const Landing = () => {
  const classes = useStyles();
  const [openLogin, setOpenLogin] = useState(false);

  const _scrollTo = (idName) => {
    document.getElementById(idName).scrollIntoView();
  };

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
                Home
              </Typography>
              <Typography
                onClick={() => _scrollTo("services")}
                className={classes.navlink}
                variant="p"
              >
                Services
              </Typography>
              <Typography
                onClick={() => _scrollTo("aboutus")}
                className={classes.navlink}
                variant="p"
              >
                About us
              </Typography>
              <Button
                onClick={() => setOpenLogin(true)}
                className={classes.navlink}
                color="primary"
                variant="outlined"
                style={{
                  color: "#ffffff",
                  border: "2px solid white",
                }}
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
      <div id="services" className={classes.segment}>
        <Ourservices />
      </div>
      <div id="aboutus" className={classes.segment}>
        <Aboutus />
      </div>
      <LoginDialog openForm={openLogin} closeForm={() => setOpenLogin(false)} />
    </div>
  );
};

export default Landing;
