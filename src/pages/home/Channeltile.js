import React, { useEffect, useState } from "react";
import styled from "styled-components";

// components
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Legend from "../../components/Legend";
import RefreshIcon from "@mui/icons-material/Refresh";
import Constants from "../../constants";

//service
import { getViewsByChannel } from "../../service/view.service";

const Name = styled.p`
  font-size: 16px;
  margin-bottom: 6px;
  font-weight: bold;
`;

const Server = styled.p`
  opacity: 0.6;
`;

const Indicators = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  margin-top: 8px;
  gap: 8px;
`;

const Div = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 4px;
  font-size: 12px;
`;

const ChannelHeader = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
`;

const ChannelContent = ({ server, rtmp, hls, health }) => {
  return (
    <>
      <Server>{server}</Server>
      <Indicators>
        <Div>
          {health ? <Legend type="live" /> : <Legend type="idle" />}
          <p>{health ? "Live" : "Idle"}</p>
        </Div>
        <Div>
          <Legend type="rtmpcount" />
          <p>{health ? rtmp : "N/A"}</p>
        </Div>
        <Div>
          <Legend type="hlscount" />
          <p>{health ? hls : "N/A"}</p>
        </Div>
      </Indicators>
    </>
  );
};

const ChannelTileContainer = ({ channel, selected, onClick }) => {
  const [_view, setViews] = useState({
    rtmp: "N/A",
    hls: "N/A",
    health: false,
  });

  const _fetchView = async (refresh = false) => {
    if (channel?.name) {
      const view = await getViewsByChannel(
        {
          name: channel.name,
          hls: channel.hls,
        },
        refresh
      );
      setViews(view);
    }
  };

  useEffect(() => {
    _fetchView();
  }, []);

  return (
    <Card
      elevation={0}
      sx={{
        minWidth: 275,
        margin: "8px 0",
        borderRadius: "8px",
        paddingBottom: "0",
        borderRight: selected && `5px solid ${Constants.primary_color}`,
      }}
    >
      <CardContent>
        <ChannelHeader>
          <Name>{channel?.name}</Name>
          <RefreshIcon
            onClick={() => _fetchView(true)}
            style={{ cursor: "pointer" }}
            fontSize="small"
          />
        </ChannelHeader>
        <div style={{ cursor: "pointer" }} onClick={() => onClick(channel)}>
          <ChannelContent
            server={channel?.server}
            health={_view.health}
            rtmp={_view.rtmp}
            hls={_view.hls}
          />
        </div>
      </CardContent>
    </Card>
  );
};

export default ChannelTileContainer;
