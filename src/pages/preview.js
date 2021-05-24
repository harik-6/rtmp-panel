import React, { useState, useEffect } from "react";
import { makeStyles, createStyles } from "@material-ui/core/styles";
import { IconButton } from "@material-ui/core";
import ReactPlayer from "react-player";
import RefreshIcon from "@material-ui/icons/RefreshRounded";
import channelService from "../service/channel.service";

const player_width = 400;
const player_height = 300;

const useStyles = makeStyles((theme) =>
  createStyles({
    preview: {
      width: "100vw",
      height: "100vh",
      display: "flex",
      flexDirection: "column",
      justifyContent: "center",
      alignItems: "center",
      backgroundColor: "black",
    },
    viderrormsg: {
      paddingBottom: "8px",
      fontSize: "24px",
      color: "#ffffff",
    },
  })
);

const Preview = () => {
  const [videoError, setVideoError] = useState(false);
  const [httpLink, setHttpLink] = useState("http://errorurl.m3u8");
  const [playerDimension, setPlayerDimension] = useState({
    height: 360 * 1.75,
    width: 640 * 1.75,
  });

  const onVideoError = () => {
    setVideoError(true);
  };
  const playVideoAgain = () => {
    setVideoError(false);
  };

  const setHlsLink = async () => {
    const url = window.location.href;
    const splitted = url.split("&channel=");
    const channelName = splitted[1];
    const pageview = splitted[0].split("?page=")[1];
    
    if (pageview === "mplay") {
      setPlayerDimension({
        height: 300,
        width: 400,
      });
    }
    if ((channelName || "").length === 0) {
      window.location.href = process.env.REACT_APP_APPURL;
    }
    const hlsLink = await channelService.getChannelDetailsByName(channelName);
    if (hlsLink === null) {
      window.location.href = process.env.REACT_APP_APPURL;
    }
    setHttpLink(hlsLink);
  };
  useEffect(() => {
    setHlsLink();
  }, []);

  const classes = useStyles();
  return (
    <div className={classes.preview}>
      <div
        style={{
          height: playerDimension.height + "px",
          width: playerDimension.width + "px",
          backgroundColor: "#000000",
        }}
      >
        {videoError ? (
          <div
            className={classes.viderrcnt}
            style={{
              height: playerDimension.height + "px",
              width: playerDimension.width + "px",
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <p className={classes.viderrormsg}> </p>
            <IconButton
              color="primary"
              aria-label="retry video"
              component="span"
              onClick={playVideoAgain}
            >
              <RefreshIcon style={{ color: "white", fontSize: "48px" }} />
            </IconButton>
          </div>
        ) : (
          <ReactPlayer
            width={playerDimension.width}
            height={playerDimension.height}
            url={httpLink}
            controls={true}
            loop={true}
            onError={onVideoError}
          />
        )}
      </div>
    </div>
  );
};

export default Preview;
