import React, { useEffect, useContext, useState } from "react";
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

// services
import { getChannels } from "../../service/channel.service";
import { getViews, getHealth } from "../../service/rtmp.service";

// vars
import Actions from "../../context/actions";
import ChannelAction from "./Channelaction";
import ChannelLinks from "./Channellinks";

// styled
const Page = styled.div`
  display: flex;
  flex-direction: row;
  gap: 32px;
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
`;

const Home = () => {
  // store variables
  const { dispatch, store } = useContext(AppContext);
  const { user } = store;

  // state variables
  const [_channels, setChannels] = useState([]);
  const [_views, setViews] = useState({});
  const [_health, setHealth] = useState({});
  const [_loading, setLoading] = useState(false);
  const [_selected, setSelected] = useState({});
  const [_servers, setServers] = useState([]);
  const [_filtered, setFiltered] = useState([]);
  const [_selectedServer, setSelectedserver] = useState();

  const _setServers = (list = []) => {
    let set = [...new Set(list.map((c) => c.server))];
    set.sort();
    setServers(set);
    setSelectedserver("All");
    dispatch({
      type: Actions.SET_SERVER_LIST,
      payload: set,
    });
    return set;
  };

  const _setViews = async (list = []) => {
    const views = await getViews(list, user);
    setViews(views);
  };

  const _setHealth = async (list = []) => {
    const health = await getHealth(list, user);
    setHealth(health);
  };

  const _changeSeletedServer = (_s) => {
    setSelectedserver(_s);
    let fil = [];
    fil = _channels.filter((c) => c.server === _s);
    setFiltered(fil);
    setSelected(fil[0]);
  };

  const _loadChannels = async () => {
    setLoading(true);
    let list = await getChannels(user);
    list.sort((a, b) => a.name.localeCompare(b.name));
    setChannels(list);
    setSelected(list[0]);
    setFiltered(list);
    dispatch({
      type: Actions.SET_CHANNEL_LIST,
      payload: list,
    });
    const servers = _setServers(list);
    _setViews(servers);
    _setHealth(servers);
    setLoading(false);
  };

  useEffect(() => {
    _loadChannels();
  }, [user]);

  if (_loading) {
    return <h1>Loading...</h1>;
  }

  return (
    <>
      <UtilDiv>
        <ServerSelect
          serverNames={_servers}
          onSelect={_changeSeletedServer}
          selectedServer={_selectedServer}
          labelVisible={false}
        />
        <Button
          sx={{ marginLeft: "16px" }}
          size="small"
          variant="contained"
          endIcon={<AddIcon />}
        >
          New Channel
        </Button>
      </UtilDiv>
      <Page>
        <ChannelListDiv className="channel-list-div">
          {_filtered.map((c, index) => (
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
              <ChannelAction channel={_selected} />
              <PlayerDiv>
                <PlayerClipper>
                  <ReactPlayer
                    id="channel-preview-player"
                    url={_selected.hls}
                    controls={true}
                    playing={true}
                  />
                </PlayerClipper>
              </PlayerDiv>
              <ChannelLinks channel={_selected} />
            </CardContent>
          </Card>
        </DetailDiv>
      </Page>
    </>
  );
};

export default Home;
