import React from "react";
import styled from "styled-components";
import { getViewsByChannel } from "../../service/view.service";

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

const ChannelNumbers = ({ channels }) => {
  const [_count, setCount] = React.useState(0);
  const _countHealthyChannels = async () => {
    let count = 0;
    for (let i = 0; i < (channels || []).length; i++) {
      const c = channels[i];
      const view = await getViewsByChannel({ name: c.name, hls: c.hls });
      if (view.health) {
        count += 1;
      }
    }
    setCount(count);
  };

  React.useEffect(() => {
    _countHealthyChannels();
  }, [channels]);

  return (
    <Div>
      <Count>Total {channels.length} </Count>
      <Count>Live {_count} </Count>
      <p>/</p>
      <Legend type="rtmpcount" />
      <Text>RTMP Count</Text>
      <Legend type="hlscount" />
      <Text>HLS Count</Text>
    </Div>
  );
};

export default ChannelNumbers;
