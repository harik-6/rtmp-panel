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
import { getViews, getHealth } from "../../service/rtmp.service";

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

const Home = () => {
  // store variables
  const { dispatch, store } = useContext(AppContext);
  const { user } = store;

  const [_views, setViews] = useState({});
  const [_health, setHealth] = useState({});
  const [_selected, setSelected] = useState({});
  const [_server, setServer] = useState();
  const [_opencreate, setOpencreate] = useState(false);

  const { isLoading, data } = useQuery(
    [KEYS.FETCH_CHANNELS, user],
    async () => {
      const d = await getChannels(user);
      setServer(d[0].server);
      return d;
    }
  );

  const _setViews = async (list = []) => {
    const views = await getViews(list, user);
    setViews(views);
  };

  const _setHealth = async (list = []) => {
    const health = await getHealth(list, user);
    setHealth(health);
  };

  const _openCreateChannel = () => {
    const _ul = user.limit;
    const _cl = _channels.length;
    if (_cl >= _ul) {
      dispatch({
        type: Actions.SHOW_ALERT,
        payload: {
          type: Constants.alert_error,
          message: "Error : Channel limit exceeded",
        },
      });
    } else {
      setOpencreate(true);
    }
  };

  if (isLoading) {
    return <Preloader message={"Loading channels..."} />;
  }

  const _servers = [...new Set(data.map((c) => c.server))];
  const _filterServer = _server || _servers[0];
  const _channels = data.filter((d) => d.server === _filterServer);

  return (
    <>
      <UtilDiv>
        <ServerSelect
          serverNames={_servers}
          onSelect={setServer}
          selectedServer={_filterServer}
          labelVisible={false}
        />
        <LegendDiv>
          <ChannelNumbers channels={_channels} health={_health} />
          <Button
            sx={{ marginLeft: "16px" }}
            size="small"
            variant="contained"
            endIcon={<AddIcon />}
            onClick={_openCreateChannel}
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
                view={_views[c.name]}
                health={_health[c.name]}
                onClick={() => setSelected(c)}
              />
            ))}
          </ChannelListDiv>
          <DetailDiv>
            <Card sx={{ borderRadius: "16px" }} elevation={0}>
              <CardContent>
                <ChannelAction
                  channel={_selected}
                  health={_health[_selected?.name]}
                  user={user}
                  callback={() => {}}
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
        </Page>
      )}
      <CreateNewChannel
        open={_opencreate}
        onClose={() => setOpencreate(false)}
        callback={() => {}}
      />
    </>
  );
};

export default Home;
