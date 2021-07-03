import React, { useState } from "react";
import { AppBar, Toolbar, Button, Typography } from "@material-ui/core";
import PlayArrowRoundedIcon from "@material-ui/icons/PlayArrowRounded";
import Ourservices from "./ourservices";
import Aboutus from "./aboutus";
import RequestDemo from "./demorequest";
import useStyles from "./landing.styles";

const Landing = () => {
  const [openReq, setopeReq] = useState(false);

  const classes = useStyles();

  const openPanel = () => {
    window.open(process.env.REACT_APP_APPURL + "/login", "_blank");
  };

  const _scrollTo = (idName) => {
    document.getElementById(idName).scrollIntoView();
  };

  return (
    <div className={classes.landing}>
      <RequestDemo openForm={openReq} closeForm={() => setopeReq(false)} />
      <div id="home" className={classes.segment}>
        <AppBar elevation={0} position="static" className={classes.appbar}>
          <Toolbar className={classes.toolbar}>
            <Typography variant="h6" className={classes.title}>
              <img
                src="logotrans.png"
                alt=""
                width="36"
                height="36"
                style={{
                  marginRight: "8px",
                  marginTop: "4px",
                }}
              />
              StreamWell
            </Typography>
            <div className={classes.navbar}>
              <Typography
                onClick={() => _scrollTo("home")}
                className={classes.navlink}
                variant="p"
              >
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
                onClick={openPanel}
                className={classes.navlinkbtn}
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
                <strong>Streamwell</strong> is an cloud platform for streaming
                service with low latency rtmp streaming servers located in india
                for different users according to their requirements.
              </p>
              <Button
                color="primary"
                variant="contained"
                className={classes.demobutton}
                onClick={() => setopeReq(true)}
              >
                Request a free demo
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
    </div>
  );
};

export default Landing;
