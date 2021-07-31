import React, { useState, useEffect, useContext } from "react";
import { Button, Chip } from "@material-ui/core";
import AppContext from "../../context/context";
//icons
import ArrowRightIcon from "@material-ui/icons/ArrowRight";
import ArrowLeftIcon from "@material-ui/icons/ArrowLeft";
//components
import RebootConfirmationDialog from "../../components/rebootconfirm";
import Preloader from "../../components/preloader";
import Nodataloader from "../../components/nodataloader";
import ScrollMenu from "react-horizontal-scrolling-menu";
import HealthIcon from "../../components/healthicon";
import {
  StreamUserInfo,
  StreamMetadata,
  StreamPlayer,
} from "./playercomponents";
//services
import { getChannels } from "../../service/channel.service";
import {
  getBitrateMedata,
  rebootServer,
  checkChannelHealth,
} from "../../service/rtmp.service";
import useStyles from "./player.styles";

const Home = () => {
  const { user, actions } = useContext(AppContext);
  const [channelList, setChannelList] = useState([]);
  const [activeChannel, setActiveChannel] = useState(null);
  const [healthMap, setHealthMap] = useState({});
  const [metadata, setMetadata] = useState({
    audioType: "N/A",
    audioRate: "0 kbps",
    videoType: "N/A",
    videoRate: "0 kbps",
    fps: "0 FPS",
    resolution: "N/A",
  });
  // preloaders and errors
  const [loading, setloading] = useState(false);
  const [openRebootDialog, setOpenRebootDialog] = useState(false);
  const [selectedChip, setSelectedChip] = useState(0);

  const loadChannels = async () => {
    setloading(true);
    const chs = (await getChannels(user)) || [];
    if (chs.length > 0) {
      setChannelList(chs);
      setActiveChannel(chs[0]);
      setSelectedChip(chs[0].name);
      _checkChannelHealth(chs);
    } else {
      setActiveChannel(null);
    }
    setloading(false);
  };

  const _changeActiveChannel = (channelName) => {
    setActiveChannel(
      channelList.find((channel) => channel.name === channelName)
    );
    setSelectedChip(channelName);
  };

  const _renderChipItems = () => {
    const style = {
      marginRight: "8px",
      border: "1px solid grey",
      fontWeight: "bold",
    };
    return channelList.map((chnl) => {
      const { name } = chnl;
      if (name === selectedChip) {
        return <Chip style={style} color="primary" key={name} label={name} />;
      }
      if (!healthMap[name])
        return (
          <Chip
            color="primary"
            variant="outlined"
            style={style}
            key={name}
            label={name}
          />
        );
      return (
        <Chip
          color="primary"
          variant="outlined"
          style={style}
          key={name}
          label={name}
          onDelete={() => {}}
          deleteIcon={<HealthIcon status={true} />}
        />
      );
    });
  };

  const _checkChannelHealth = async (allchannels) => {
    const healthMap = await checkChannelHealth(allchannels);
    setHealthMap(healthMap);
  };

  const getMetadata = async () => {
    try {
      const bitratemetadata = await getBitrateMedata(activeChannel.httpLink);
      if (bitratemetadata !== null) {
        setMetadata(bitratemetadata);
      }
    } catch (error) {}
  };

  const onVideoStart = () => {
    getMetadata();
  };

  const onVideoPlay = () => {
    getMetadata();
  };

  const onVideoError = () => {
    setMetadata({
      audioType: "N/A",
      audioRate: "0 kbps",
      videoType: "N/A",
      videoRate: "0 kbps",
      fps: "0 FPS",
      resolution: "N/A",
    });
  };

  const _rebootServer = async () => {
    if (channelList !== null && channelList.length > 0) {
      await rebootServer(channelList[0]);
      setOpenRebootDialog(false);
      actions.logout();
    }
  };

  useEffect(() => {
    loadChannels();
    //eslint-disable-next-line
  }, []);
  const classes = useStyles();

  if (loading) {
    return <Preloader message={"Loading channels..."} />;
  }
  return (
    <div className={classes.home}>
      {activeChannel === null ? (
        <Nodataloader message="You don't have any channel.Create one" />
      ) : (
        <>
          <div style={{ display: "flex", justifyContent: "flex-end" }}>
            <Button
              onClick={() => setOpenRebootDialog(true)}
              variant="contained"
              color="primary"
            >
              Reboot
            </Button>
          </div>
          <div style={{ display: "flex", justifyContent: "center" }}>
            <div className={classes.carousel}>
              <ScrollMenu
                scrollToSelected={true}
                arrowRight={<ArrowRightIcon fontSize="large" />}
                arrowLeft={<ArrowLeftIcon fontSize="large" />}
                data={_renderChipItems()}
                selected={selectedChip}
                onSelect={_changeActiveChannel}
              />
            </div>
          </div>
          <StreamPlayer
            ch={activeChannel}
            onVideoError={onVideoError}
            onVideoStart={onVideoStart}
            onVideoPlay={onVideoPlay}
            isLive={healthMap[activeChannel.name]}
          />
          {user.bitrate && <StreamMetadata metadata={metadata} />}
          <StreamUserInfo
            ch={activeChannel}
            showPlayUrl={false}
            isLive={healthMap[activeChannel.name]}
          />
        </>
      )}
      <RebootConfirmationDialog
        openForm={openRebootDialog}
        closeForm={() => setOpenRebootDialog(false)}
        onYes={_rebootServer}
      />
    </div>
  );
};

export default Home;
