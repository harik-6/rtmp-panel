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
import DownArrowIcon from "@material-ui/icons/ExpandMoreRounded";
import ArrowRightIcon from "@material-ui/icons/ArrowRight";
import ArrowLeftIcon from "@material-ui/icons/ArrowLeft";
import CreateNewChannel from "../../components/createchannel";
import useStyles from "./player.styles";
import RebootConfirmationDialog from "../../components/rebootconfirm";
import FabAddButton from "../../components/fabaddbutton";
import Preloader from "../../components/preloader";
import Nodataloader from "../../components/nodataloader";
import {
  StreamUserInfo,
  LiveDotIcon,
  StreamMetadata,
  StreamPlayer,
} from "./playercomponents";
import { getChannels } from "../../service/channel.service";
import { getBitrateMedata, rebootServer } from "../../service/rtmp.service";

// react-carousel
// import "react-responsive-carousel/lib/styles/carousel.min.css";
// import { Carousel } from "react-responsive-carousel";

import ScrollMenu from "react-horizontal-scrolling-menu";
// import Carousel from "react-multi-carousel";
// import "react-multi-carousel/lib/styles.css";
// import "./carousel-override.css";

const responsive = {
  superLargeDesktop: {
    breakpoint: { max: 4000, min: 3000 },
    items: 10,
  },
  desktop: {
    breakpoint: { max: 3000, min: 1024 },
    items: 27,
  },
  tablet: {
    breakpoint: { max: 1024, min: 464 },
    items: 10,
  },
  mobile: {
    breakpoint: { max: 464, min: 0 },
    items: 10,
  },
};

const Home = () => {
  const { user, channels, actions, settings } = useContext(AppContext);
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

  _changeActiveChannel = (channelName) => {
    setSelectedChip(channelName);
  };

  const loadChannels = async (forceload) => {
    setloading(true);
    const chs = (await getChannels(user)) || [];
    if ((chs || []).length > 0) {
      setChannelList(chs);
      setCh(chs[0]);
    } else {
      setCh(null);
    }
    setloading(false);
  };

  const closeCreatepop = () => {
    setOpenForm(false);
  };

  const openCreateChannelForm = () => {
    if (settings.limit === channels.length) {
      seterrorsnack(true);
      return;
    } else {
      setOpenForm(true);
    }
  };

  const getMetadata = async () => {
    try {
      const bitratemetadata = await getBitrateMedata(ch.httpLink);
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
    if (channels !== null && channels.length > 0) {
      await rebootServer(channels[0]);
      setOpenRebootDialog(false);
      actions.logout();
    }
  };

  useEffect(() => {
    loadChannels(false);
    //eslint-disable-next-line
  }, []);
  const classes = useStyles();

  if (loading) {
    return <Preloader message={"Loading channels..."} />;
  }

  return (
    <div className={classes.home}>
      {ch === null ? (
        <Nodataloader message="You don't have any channel.Create one" />
      ) : (
        <Grid container>
          <Grid item container justify="flex-end" lg={12}>
            <Grid item lg={1}>
              <Button
                onClick={() => setOpenRebootDialog(true)}
                variant="contained"
                color="primary"
              >
                Reboot
              </Button>
            </Grid>
          </Grid>
          <div style={{ width: "57%" }}>
            <ScrollMenu
              scrollToSelected={true}
              arrowRight={<ArrowRightIcon fontSize="small" />}
              arrowLeft={<ArrowLeftIcon fontSize="small" />}
              data={chlist.map((chl) => (
                <Chip key={chl.name} label={chl.name} />
              ))}
              selected={selectedChip}
              onSelect={_changeActiveChannel}
            />
          </div>
          {/* <Grid
            item
            lg={12}
            container
            direction="row"
            alignItems="center"
            className={classes.actioncnt}
          >
            <Grid item lg={3} />
            <LiveDotIcon isLive={isLive} />
            <Grid item lg={2} />
            {chlist.length > 0 && (
              <Grid itemlg={4}>
                <Button
                  aria-controls="change-channel-menu"
                  aria-haspopup="true"
                  onClick={(event) => setAnchorEl(event.currentTarget)}
                  disableElevation
                  style={{ zIndex: "99" }}
                >
                  {ch.name}
                  <DownArrowIcon />
                </Button>
              </Grid>
            )}
          </Grid>
          <StreamPlayer
            ch={ch}
            onVideoError={onVideoError}
            onVideoStart={onVideoStart}
            onVideoPlay={onVideoPlay}
          />
          <StreamMetadata metadata={metadata} />
          <StreamUserInfo ch={ch} /> */}
        </Grid>
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
