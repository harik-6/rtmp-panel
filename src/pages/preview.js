import React, { useState, useEffect } from "react";
import { makeStyles, createStyles } from "@material-ui/core/styles";
import { IconButton } from "@material-ui/core";
import ReactPlayer from "react-player";
import RefreshIcon from "@material-ui/icons/RefreshRounded";

const player_width = 640 * 1.75;
const player_height = 360 * 1.75;

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
    videoplayer: {
      height: player_height + "px",
      width: player_width + "px",
      backgroundColor: "#000000",
    },
    viderrcnt: {
      display: "flex",
      height: player_height + "px",
      width: player_width + "px",
      flexDirection: "column",
      justifyContent: "center",
      alignItems: "center",
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

  const onVideoError = () => {
    setVideoError(true);
  };
  const playVideoAgain = () => {
    setVideoError(false);
  };

  useEffect(() => {
      const url = window.location.href;
      const replaced = url.replace("preview","hls")+".m3u8";
      console.log(replaced);
      setHttpLink(replaced)
  }, []);

  const classes = useStyles();
  return (
    <div className={classes.preview}>
      <div className={classes.videoplayer}>
        {videoError ? (
          <div className={classes.viderrcnt}>
            <p className={classes.viderrormsg}>
              Video is unavailabe right now.Try again.{" "}
            </p>
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
            width={player_width}
            height={player_height}
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
