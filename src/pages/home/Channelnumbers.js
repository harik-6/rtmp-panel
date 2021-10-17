import React from "react";
import styled from "styled-components";

// components
import Legend from "../../components/Legend";

// styled
const Div = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 8px;
`;

const Text = styled.p`
  opacity: 0.6;
  font-size: 12px;
`;

const Count = styled.p`
  font-weight: bold;
  font-size: 16px;
`;

const ChannelNumbers = ({ channels, health }) => {
  const _countActive = () => {
    return channels.filter((c) => health[c.name]).length;
  };
  return (
    <Div>
      <Count>Total {channels.length} </Count>
      <Count>Live {_countActive()} </Count>
      <p>/</p>
      <Legend type="rtmpcount" />
      <Text>RTMP Count</Text>
      <Legend type="hlscount" />
      <Text>HLS Count</Text>
    </Div>
  );
};

export default ChannelNumbers;
