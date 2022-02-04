import React, { useEffect, useContext, useState } from "react";
import { useQuery } from "react-query";
import styled from "styled-components";
import AppContext from "../../context/context";

// mui
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Button from "@mui/material/Button";
import AddIcon from "@mui/icons-material/Add";

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
import CreateNewChannel from "../../components/Channel/Createchannel";

// services
import { getChannels } from "../../service/channel.service";
import { getViews } from "../../service/rtmp.service";

// vars
import Actions from "../../context/actions";
import Constants from "../../constants";
import Devices from "../../Devices";
import KEYS from "../cachekey";
// import { fetchChannels } from "../../queries/channel.queries";

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
  const [_opencreate, setOpencreate] = useState(false);
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
      payload: servers,
    });
    dispatch({
      type: Actions.SET_CHANNEL_LIST,
      payload: data,
    });
  };

  useEffect(() => {
    _fetchChannels();
  }, [user]);

  if (_loading) {
    return <Preloader message={"Loading channels..."} />;
  }

  const _filterServer = _server || "All";
  let _channels = data;
  if (_filterServer !== "All") {
    _channels = data
      .filter((d) => d.server === _filterServer)
      .sort((a, b) => a.name.localeCompare(b.name));
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
          <Button
            sx={{ marginLeft: "16px" }}
            size="small"
            variant="contained"
            endIcon={<AddIcon />}
            onClick={() => setOpencreate(true)}
          >
            New Channel
          </Button>
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
      <CreateNewChannel
        open={_opencreate}
        onClose={() => setOpencreate(false)}
        callback={_fetchChannels}
      />
    </>
  );
};

export default Home;
