import React from "react";
import styled from "styled-components";

// components
import IconButton from "@mui/material/IconButton";
import CopyIcon from "@mui/icons-material/FileCopy";

const Links = styled.div`
  margin-top: 16px;
`;

const CopyDiv = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  padding: 8px;
  margin-top: 18px;
`;

const Header = styled.p`
  padding-bottom: 4px;
  font-weight: bold;
`;

const Text = styled.p``;

const links = [
  {
    name: "Stream Url",
    selector: "stream",
  },
  {
    name: "Key",
    selector: "token",
  },
  {
    name: "RTMP Play Url",
    selector: "rtmp",
  },
  {
    name: "HLS",
    selector: "hls",
  },
];

const ChannelLinks = ({ channel, access }) => {
  console.log(channel);
  const _onCopy = (text) => {
    navigator.clipboard.writeText(text).then(function () {
      //   setSnack(true);
    });
  };

  return (
    <Links>
      {links.map((l) => {
        const text = channel?.[l.selector];
        return (
          <CopyDiv key={l.name}>
            <div>
              <Header>{l.name}</Header>
              <Text>{text}</Text>
            </div>
            <IconButton onClick={() => _onCopy(text)}>
              <CopyIcon fontSize="small" />
            </IconButton>
          </CopyDiv>
        );
      })}
      {access.indexOf("preview") !== -1 && (
        <CopyDiv key={"preview"}>
          <div>
            <Header>Preview URL</Header>
            <Text>{channel?.preview}</Text>
          </div>
          <IconButton onClick={() => _onCopy(channel?.preview)}>
            <CopyIcon fontSize="small" />
          </IconButton>
        </CopyDiv>
      )}
    </Links>
  );
};

export default ChannelLinks;
