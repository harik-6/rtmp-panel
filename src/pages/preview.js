import React, { useState, useEffect, useRef } from "react";
import ReactPlayer from "react-player";
import channelService from "../service/channel.service";
// import ReactDOM from "react-dom";
// import screenfull from "screenfull";

const Preview = () => {
  const [httpLink, setHttpLink] = useState("http://errorurl.m3u8");
  const previewPlayer = useRef();
  // const [playerDimension, setPlayerDimension] = useState({
  //   height: 390 * 1.75,
  //   width: 375,
  // });

  // const goFullScreen = async () => {
  //   try {
  //     await screenfull.request(ReactDOM.findDOMNode(previewPlayer.current));
  //   } catch (error) {
  //     console.log(error.message);
  //   }
  // };

  const setHlsLink = async () => {
    const url = window.location.href;
    const splitted = url.split("&channel=");
    const channelName = splitted[1];
    if ((channelName || "").length === 0) {
      window.location.href = process.env.REACT_APP_APPURL;
    }
    // const pageview = splitted[0].split("?page=")[1];
    // if (pageview === "webplay") {
    //   setPlayerDimension({
    //     height: 400 * 1.75,
    //     width: 800,
    //   });
    // }
    const hlsLink = await channelService.getChannelDetailsByName(channelName);
    if (hlsLink === null) {
      window.location.href = process.env.REACT_APP_APPURL;
    }
    setHttpLink(hlsLink);
  };
  useEffect(() => {
    setHlsLink();
  }, []);

  return (
    <ReactPlayer
      ref={previewPlayer}
      width="100%"
      height="100%"
      url={httpLink}
      controls={true}
      playing={true}
      style={{
        position: "absolute",
        top: 0,
        left: 0,
      }}
    />
  );
};

export default Preview;
