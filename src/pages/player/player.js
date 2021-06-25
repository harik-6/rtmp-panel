import React, { useState, useEffect, useContext } from "react";
import { Grid, Button, Menu, MenuItem, Snackbar } from "@material-ui/core";
import AppContext from "../../context/context";
import channelservice from "../../service/channel.service";
import DownArrowIcon from "@material-ui/icons/ExpandMoreRounded";
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

const Home = () => {
  const { user, channels, actions } = useContext(AppContext);
  const [chlist, setchlist] = useState([]);
  const [ch, setCh] = useState(null);
  const [metadata, setMetadata] = useState({
    audioType: "N/A",
    audioRate: "0 kbps",
    videoType: "N/A",
    videoRate: "0 kbps",
    fps: "0 FPS",
    resolution: "N/A",
  });
  // preloaders and errors
  const [anchorEl, setAnchorEl] = useState(null);
  const [openForm, setOpenForm] = useState(false);
  const [loading, setloading] = useState(false);
  const [errorsnack, seterrorsnack] = useState(false);
  const [isLive, setChannelLive] = useState(false);
  const [openRebootDialog, setOpenRebootDialog] = useState(false);

  const changeRtmp = (index) => {
    setCh(chlist[index]);
    closeMenu();
    getMetadata();
  };

  const closeMenu = () => {
    setAnchorEl(null);
  };

  const loadChannels = async (forceload) => {
    setloading(true);
    let chs = [];
    if (forceload) {
      chs = await channelservice.getChannels(user);
      actions.setChannles(chs);
    } else {
      if (channels === null) {
        chs = await channelservice.getChannels(user);
        actions.setChannles(chs);
      } else {
        chs = channels;
      }
    }
    if (chs.length > 0) {
      setchlist(chs);
      setCh(chs[0]);
    } else {
      setCh(null);
    }
    setloading(false);
  };

  const closeCreatepop = () => {
    setOpenForm(false);
    closeMenu();
  };

  const openCreateChannelForm = () => {
    if (user.channelLimit === channels.length) {
      seterrorsnack(true);
      return;
    } else {
      setOpenForm(true);
    }
  };

  const getMetadata = async () => {
    try {
      const bitratemetadata = await channelservice.getBitrateMedata(
        ch.httpLink
      );
      if (bitratemetadata !== null) {
        setMetadata(bitratemetadata);
      }
    } catch (error) {}
  };

  const onVideoStart = () => {
    setChannelLive(true);
    getMetadata();
  };

  const onVideoPlay = () => {
    setChannelLive(true);
    getMetadata();
  };

  const onVideoError = () => {
    setChannelLive(false);
    setMetadata({
      audioType: "N/A",
      audioRate: "0 kbps",
      videoType: "N/A",
      videoRate: "0 kbps",
      fps: "0 FPS",
      resolution: "N/A",
    });
  };

  const rebootServer = async () => {
    if (channels !== null && channels.length > 0) {
      await channelservice.rebootServer(channels[0]);
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
          <Grid
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
          <StreamUserInfo ch={ch} />
          <Menu
            id="switch-channel-menu"
            anchorEl={anchorEl}
            keepMounted
            open={Boolean(anchorEl)}
            onClose={closeMenu}
          >
            {chlist.map((channel, index) => (
              <MenuItem key={channel.name} onClick={() => changeRtmp(index)}>
                {channel.name}
              </MenuItem>
            ))}
          </Menu>
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
        onYes={rebootServer}
      />
    </div>
  );
};

export default Home;
