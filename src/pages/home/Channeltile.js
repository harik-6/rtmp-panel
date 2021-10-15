import React from "react";
import styled from "styled-components";

// components
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CircleIcon from "@mui/icons-material/FiberManualRecord";
import Legend from "../../components/Legend";

import Constants from "../../constants";


const Name = styled.p`
  font-size: 15px;
  margin-bottom: 4px;
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


const Channeltile = ({ channel, view, selected, health, onClick }) => {
  return (
    <Card
      elevation={0}
      sx={{
        width: 275,
        margin: "8px 0",
        borderRadius: "8px",
        paddingBottom: "0",
        borderRight: selected && `5px solid ${Constants.primary_color}`,
        cursor: "pointer",
      }}
      onClick={() => onClick(channel)}
    >
      <CardContent>
        <Name>{channel.name}</Name>
        <Server>{channel.server}</Server>
        <Indicators>
          <Div>
            {health ? <Legend type="live" /> : <Legend type="idle" />}
            <p>{health ? "Live" : "Idle"}</p>
          </Div>
          <Div>
            <Legend type="rtmpcount" />
            <p>{view?.rtmpCount}</p>
          </Div>
          <Div>
            <Legend type="hlscount" />
            <p>{view?.hlsCount}</p>
          </Div>
        </Indicators>
      </CardContent>
    </Card>
  );
};

export default Channeltile;
