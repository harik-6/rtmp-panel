import React, { useEffect, useContext, useState } from "react";
import styled from "styled-components";
import AppContext from "../../context/context";

// mui
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";

// components
import Channeltile from "./Channeltile";
import ReactPlayer from "react-player";
import UtilDiv from "../../components/Utildiv";
import ServerSelect from "../../components/Serverselect";
import ChannelAction from "./Channelaction";
import ChannelLinks from "./Channellinks";
import ChannelNumbers from "./Channelnumbers";
import Preloader from "../../components/Preloader";
import Nodata from "../../components/Nodata";

// services
import { getChannels } from "../../service/channel.service";

// vars
import Actions from "../../context/actions";
import Devices from "../../Devices";

// styled
const Page = styled.div`
  display: flex;
  flex-direction: row;
  gap: 32px;

  //responsive
  @media ${Devices.tablet} {
    flex-direction: column;
  }
`;

const DetailDiv = styled.div`
  flex: 1;
  margin-top: 8px;
  border-radius: 16px;
`;

const PlayerDiv = styled.div`
  flex: 1;
  display: flex;
  justify-content: center;
  margin-top: 16px;
`;

const PlayerClipper = styled.div`
  width: 600px;
  overflow: hidden;
  border-radius: 16px;
`;

const ChannelListDiv = styled.div`
  height: 515px;
  overflow-y: scroll;
  border-radius: 16px;

  //responsive
  @media ${Devices.tablet} {
    display: flex;
    flex-direction: row;
    height: 120px;
    gap: 16px;
    overflow-x: scroll;
  }
`;

const LegendDiv = styled.div`
  display: flex;
  flex-direction: row;
  align-items: flex-end;
  gap: 8px;
`;

const NoChannelSelected = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`;

const SelectChannelInfo = styled.p`
  font-size: 22px;
`;

const Home = () => {
  // store variables
  const { dispatch, store } = useContext(AppContext);
  const { user } = store;

  const [data, setData] = useState([]);
  const [_selected, setSelected] = useState(null);
  const [_server, setServer] = useState();
  const [_servers, setServersList] = useState([]);
  const [_loading, setLoading] = useState(true);

  const _fetchChannels = async () => {
    setLoading(true);
    const { data, servers } = await getChannels(user);
    setData(data);
    setServersList(["All", ...servers]);
    setServer(servers[0]);
    setLoading(false);
    dispatch({
      type: Actions.SET_SERVER_LIST,
      payload: [...new Set([...servers,user.server])],
    });
    dispatch({
      type: Actions.SET_CHANNEL_LIST,
      payload: data,
    });
  };

  useEffect(() => {
    _fetchChannels();
    // eslint-disable-next-line
  }, [user]);

  if (_loading) {
    return <Preloader message={"Loading channels..."} />;
  }

  const _filterServer = _server || "All";
  let _channels = data.sort((a, b) => a.name.localeCompare(b.name));
  if (_filterServer !== "All") {
    _channels = data.filter((d) => d.server === _filterServer);
  }

  return (
    <>
      <UtilDiv>
        <ServerSelect
          serverNames={_servers}
          onSelect={(s) => {
            setSelected(null);
            setServer(s);
          }}
          selectedServer={_filterServer}
          labelVisible={false}
        />
        <LegendDiv>
          <ChannelNumbers channels={_channels} />
        </LegendDiv>
      </UtilDiv>
      {_channels.length === 0 ? (
        <Nodata message={"You have not created channels."} />
      ) : (
        <Page>
          <ChannelListDiv className="channel-list-div">
            {_channels.map((c, index) => (
              <Channeltile
                key={index + "-" + c.name}
                selected={_selected?.name === c.name}
                channel={c}
                onClick={() => setSelected(c)}
              />
            ))}
          </ChannelListDiv>
          {_selected === null ? (
            <NoChannelSelected>
              <SelectChannelInfo>
                Select any channel from list to see Preview and Links
              </SelectChannelInfo>
            </NoChannelSelected>
          ) : (
            <DetailDiv>
              <Card sx={{ borderRadius: "16px" }} elevation={0}>
                <CardContent>
                  <ChannelAction
                    channel={_selected}
                    user={user}
                    callback={_fetchChannels}
                  />
                  <PlayerDiv>
                    <PlayerClipper>
                      <ReactPlayer
                        id="channel-preview-player"
                        url={_selected?.hls}
                        controls={true}
                        playing={false}
                      />
                    </PlayerClipper>
                  </PlayerDiv>
                  <ChannelLinks channel={_selected} access={user.access} />
                </CardContent>
              </Card>
            </DetailDiv>
          )}
        </Page>
      )}
    </>
  );
};

export default Home;
