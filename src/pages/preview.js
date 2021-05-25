import React, { useState, useEffect } from "react";
import { makeStyles, createStyles } from "@material-ui/core/styles";
import ReactPlayer from "react-player";
import channelService from "../service/channel.service";

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
      position:"fixed",
      [theme.breakpoints.down("sm")]: {
        width: "400px",
        height: "400px",
        display: "block",
      },
    }
  })
);

const Preview = () => {
  const [httpLink, setHttpLink] = useState("http://errorurl.m3u8");
  const [playerDimension, setPlayerDimension] = useState({
    height: 260 * 1.75,
    width: 540 * 1.75,
  });

  const setHlsLink = async () => {
    const url = window.location.href;
    const splitted = url.split("&channel=");
    const channelName = splitted[1];
    const pageview = splitted[0].split("?page=")[1];
    if (pageview === "mplay") {
      setPlayerDimension({
        height: 400,
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
        <ReactPlayer
          width={playerDimension.width}
          height={playerDimension.height}
          url={httpLink}
          controls={true}
          playing={true}
        />
      </div>
    </div>
  );
};

export default Preview;
