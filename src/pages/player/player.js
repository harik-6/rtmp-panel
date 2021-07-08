import React, { useState, useEffect, useContext } from "react";
import {
  Grid,
  Button,
  Menu,
  MenuItem,
  Snackbar,
  Chip,
} from "@material-ui/core";
import AppContext from "../../context/context";
import ArrowRightIcon from "@material-ui/icons/ArrowRight";
import ArrowLeftIcon from "@material-ui/icons/ArrowLeft";
import CreateNewChannel from "../../components/createchannel";
import useStyles from "./player.styles";
import RebootConfirmationDialog from "../../components/rebootconfirm";
import FabAddButton from "../../components/fabaddbutton";
import Preloader from "../../components/preloader";
import Nodataloader from "../../components/nodataloader";
import ScrollMenu from "react-horizontal-scrolling-menu";
import {
  StreamUserInfo,
  LiveDotIcon,
  StreamMetadata,
  StreamPlayer,
} from "./playercomponents";
import { getChannels } from "../../service/channel.service";
import { getBitrateMedata, rebootServer } from "../../service/rtmp.service";

const Home = () => {
  const { user, actions, settings } = useContext(AppContext);
  const [channelList, setChannelList] = useState([]);
  const [activeChannel, setActiveChannel] = useState(null);
  const [metadata, setMetadata] = useState({
    audioType: "N/A",
    audioRate: "0 kbps",
    videoType: "N/A",
    videoRate: "0 kbps",
    fps: "0 FPS",
    resolution: "N/A",
  });
  // preloaders and errors
  const [openForm, setOpenForm] = useState(false);
  const [loading, setloading] = useState(false);
  const [errorsnack, seterrorsnack] = useState(false);
  const [openRebootDialog, setOpenRebootDialog] = useState(false);
  const [selectedChip, setSelectedChip] = useState(0);

  const loadChannels = async () => {
    setloading(true);
    const chs = (await getChannels(user)) || [];
    if (chs.length > 0) {
      setChannelList(chs);
      setActiveChannel(chs[0]);
      setSelectedChip(chs[0].name);
    } else {
      _changeActiveChannel(null);
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
    };
    return channelList.map((chl) => {
      if (chl.name === selectedChip) {
        return (
          <Chip style={style} color="primary" key={chl.name} label={chl.name} />
        );
      }
      return <Chip variant="outlined" style={style} key={chl.name} label={chl.name} />;
    });
  };

  const closeCreatepop = () => {
    setOpenForm(false);
  };

  const openCreateChannelForm = () => {
    if (settings.limit === channelList.length) {
      seterrorsnack(true);
      return;
    } else {
      setOpenForm(true);
    }
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
          <div className={classes.carousel}>
            <ScrollMenu
              scrollToSelected={true}
              arrowRight={<ArrowRightIcon fontSize="small" />}
              arrowLeft={<ArrowLeftIcon fontSize="small" />}
              data={_renderChipItems()}
              selected={selectedChip}
              onSelect={_changeActiveChannel}
            />
          </div>
          <StreamPlayer
            ch={activeChannel}
            onVideoError={onVideoError}
            onVideoStart={onVideoStart}
            onVideoPlay={onVideoPlay}
          />
          <StreamMetadata metadata={metadata} />
          <StreamUserInfo ch={activeChannel} />
        </>
      )}
      <CreateNewChannel
        openForm={openForm}
        closeCreatepop={closeCreatepop}
        successCallback={() => {
          closeCreatepop();
          loadChannels(true);
        }}
      />
      <Snackbar
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
        open={errorsnack}
        onClose={() => seterrorsnack(false)}
        autoHideDuration={5000}
        message="Channel limit exceeded"
        key={"err-snack"}
      />
      <FabAddButton onClickAction={openCreateChannelForm} />
      <RebootConfirmationDialog
        openForm={openRebootDialog}
        closeForm={() => setOpenRebootDialog(false)}
        onYes={_rebootServer}
      />
    </div>
  );
};

export default Home;
