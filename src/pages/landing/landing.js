import React, { useState, useEffect } from "react";
import { AppBar, Toolbar, Button, Typography } from "@material-ui/core";
import PlayArrowRoundedIcon from "@material-ui/icons/PlayArrowRounded";
import Ourservices from "./ourservices";
import Aboutus from "./aboutus";
import RequestDemo from "./demorequest";
import useStyles from "./landing.styles";

const offers = [
  "Exclusive offer to start a tv channel - Rs.700 per rtmp / month for mobile app & website streaming.",
  "Rs.1000 per rtmp / month for one mso decoder,mobile app & website streaming",
];

const Landing = () => {
  const [openReq, setopeReq] = useState(false);
  const [bannerContent, setBannerContent] = useState([]);

  const classes = useStyles();

  const _addBannerConetnt = () => {
    let dummy = [];
    for (let i = 0; i < 5; i++) {
      dummy = [...dummy, ...offers];
    }
    setBannerContent(dummy);
  };

  const openPanel = () => {
    window.open(process.env.REACT_APP_APPURL + "/login", "_blank");
  };

  const _scrollTo = (idName) => {
    document.getElementById(idName).scrollIntoView();
  };

  const _openCall = () => {
    window.open("tel:7904037932", "_blank");
  };

  useEffect(() => {
    _addBannerConetnt();
  }, []);

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
                Contact Us
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
        <ul className={classes.bannerspace}>
          {bannerContent.map((content, index) => {
            return (
              <li key={`offer-${index}`} className={classes.bannercontent}>
                {content} <span style={{ color: "yellow" }}> &#9733; </span>
              </li>
            );
          })}
        </ul>
        <div className={classes.greeter}>
          <div className={classes.gleft}>
            <div className={classes.content}>
              <p className={classes.appmaindesc}>StreamWell</p>
              <p className={classes.appdesc}>
                <span style={{ marginLeft: "40px" }} />
                Cloud platform for rtmp streaming service with low latency servers
                located in india for different users according to their needs and
                requirements.
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
              <p
                onClick={_openCall}
                style={{
                  marginTop: "24px",
                  marginBottom: "8px",
                  textDecoration: "underline",
                  cursor: "pointer",
                  fontWeight: "bold",
                }}
              >
                Call +91 79040 37932
              </p>
              <p>Support in Tamil, Telugu, Kannada and English.</p>
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
