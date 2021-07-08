import React, { useState, useEffect, useRef } from "react";
import ReactPlayer from "react-player";
import { getChannelDetailsByName } from "../service/channel.service";

const Preview = (props) => {
  const [httpLink, setHttpLink] = useState(
    "https://rtmp.streamwell.in/novideo.m3u8"
  );
  const previewPlayer = useRef();

  const _redirectToHome = () => {
    window.location.href = process.env.REACT_APP_APPURL;
  };

  const setHlsLink = async () => {
    const channelName = props.match.params.channel;
    if ((channelName || "").length === 0) {
      _redirectToHome();
    }
    const hlsLink = await getChannelDetailsByName(channelName);
    if (hlsLink === null) {
      _redirectToHome();
    }
    setHttpLink(hlsLink);
  };
  useEffect(() => {
    setHlsLink();
    // eslint-disable-next-line
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
