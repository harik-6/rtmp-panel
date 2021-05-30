import React, { useState, useEffect, useContext } from "react";
import {
  Grid,
  Paper,
  Button,
  CircularProgress,
  Menu,
  MenuItem,
  Snackbar,
  IconButton,
} from "@material-ui/core";
import ReactPlayer from "react-player";
import AppContext from "../../context/context";
import channelservice from "../../service/channel.service";
import DownArrowIcon from "@material-ui/icons/ExpandMoreRounded";
import PlusIcon from "@material-ui/icons/AddRounded";
import CreateNewChannel from "../../components/createchannel";
import RoundIcon from "@material-ui/icons/FiberManualRecordRounded";
import useStyles from "./player.styles";
import RebootConfirmationDialog from "../../components/rebootconfirm";

const Home = () => {
  const { user, channels, actions } = useContext(AppContext);
  const [chlist, setchlist] = useState([]);
  const [ch, setCh] = useState(null);
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
  };

  const openMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const closeMenu = () => {
    setAnchorEl(null);
  };

  const openSnack = () => {
    seterrorsnack(true);
  };

  const closeSnack = () => {
    seterrorsnack(false);
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
      openSnack();
      return;
    } else {
      setOpenForm(true);
    }
  };

  const onVideoStart = (e) => {
    setChannelLive(true);
  };

  const onVideoError = () => {
    setChannelLive(false);
  };

  const onVideoChange = (e) => {
    console.log(e.target);
  }

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
  return (
    <div className={classes.home}>
      {loading ? (
        <div className={classes.preloadercnt}>
          <CircularProgress />
          <p className={classes.preloadertxt}>Loading profile...</p>
        </div>
      ) : (
        <Grid container>
          {ch !== null && (
            <>
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
                justify="flex-end"
                className={classes.actioncnt}
              >
                <Grid item container alignItems="center" sm={12} xs={12} lg={5}>
                  {isLive ? (
                    <React.Fragment>
                      <RoundIcon className={classes.iconlive} /> Live
                    </React.Fragment>
                  ) : (
                    <React.Fragment>
                      <RoundIcon className={classes.iconidle} /> Idle
                    </React.Fragment>
                  )}
                </Grid>
                {chlist.length > 0 && (
                  <Grid item container sm={12} xs={12} lg={5}>
                    <Grid sm={12} xs={12} lg={4}>
                      <Button
                        aria-controls="change-channel-menu"
                        aria-haspopup="true"
                        onClick={openMenu}
                        disableElevation
                        style={{ zIndex: "99" }}
                      >
                        {ch.name}
                        <DownArrowIcon />
                      </Button>
                    </Grid>
                  </Grid>
                )}
              </Grid>
            </>
          )}
          {ch === null ? (
            <React.Fragment>
              <div className={classes.preloadercnt}>
                <p className={classes.preloadertxt}>
                  You don't have any channel.Create one
                </p>
              </div>
            </React.Fragment>
          ) : (
            <>
              <Grid item lg={12} xs={12} sm={12} container justify="center">
                <div className={classes.videoplayer}>
                  <ReactPlayer
                    url={ch.httpLink}
                    controls={true}
                    playing={true}
                    onError={onVideoError}
                    onStart={onVideoStart}
                    onPlay={onVideoStart}
                  />
                </div>
              </Grid>
              <Grid
                className={classes.rtmpinfo}
                item
                container
                justify="space-between"
                lg={12}
                spacing={2}
              >
                <Grid item lg={12} xs={12} className={classes.urls}>
                  <Paper elevation={0} square className={classes.paper}>
                    <p className={classes.urlheader}>Stream URL</p>
                    <p className={classes.urlvalue}>{ch.displayStreamLink}</p>
                    <p className={classes.urlheader}>Key</p>
                    <p className={classes.urlvalue}>{ch.token}</p>
                  </Paper>
                </Grid>
                <Grid item lg={12} xs={12} className={classes.urls}>
                  <Paper elevation={0} square className={classes.paper}>
                    <p className={classes.urlheader}>RTMP Play URL</p>
                    <p className={classes.urlvalue}>{ch.rtmpLink}</p>
                  </Paper>
                </Grid>
                <Grid item lg={12} xs={12} className={classes.urls}>
                  <Paper elevation={0} square className={classes.paper}>
                    <p className={classes.urlheader}>HLS</p>
                    <p className={classes.urlvalue}>{ch.httpLink}</p>
                  </Paper>
                </Grid>
                <Grid item lg={12} xs={12} className={classes.urls}>
                  <Paper elevation={0} square className={classes.paper}>
                    <p className={classes.urlheader}>Player URL</p>
                    <p
                      className={classes.urlvalue}
                    >{`${process.env.REACT_APP_APPURL}?page=play&channel=${ch.name}`}</p>
                  </Paper>
                </Grid>
              </Grid>
            </>
          )}
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
      <Snackbar
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
        open={errorsnack}
        onClose={closeSnack}
        autoHideDuration={5000}
        message="Channel limit exceeded"
        key={"err-snack"}
      />
      <IconButton
        style={{
          position: "fixed",
          right: "24px",
          bottom: "24px",
          background: "#121858",
        }}
        onClick={openCreateChannelForm}
      >
        <PlusIcon style={{ color: "white", fontSize: "32px" }} />
      </IconButton>
      <RebootConfirmationDialog
        openForm={openRebootDialog}
        closeForm={() => setOpenRebootDialog(false)}
        onYes={rebootServer}
      />
    </div>
  );
};

export default Home;
