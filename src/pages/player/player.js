import React, { useState, useEffect, useContext } from "react";
import { makeStyles, createStyles } from "@material-ui/core/styles";
import {
  Grid,
  Paper,
  Button,
  CircularProgress,
  Menu,
  MenuItem,
  Snackbar,
  IconButton,
  Avatar,
} from "@material-ui/core";
import ReactPlayer from "react-player";
import AppContext from "../../context/context";
import channelservice from "../../service/channel.service";
import DownArrowIcon from "@material-ui/icons/ExpandMoreRounded";
import PlusIcon from "@material-ui/icons/AddRounded";
import CreateNewChannel from "../../components/createchannel";
import RoundIcon from "@material-ui/icons/FiberManualRecordRounded";
import RebootConfirmationDialog from "../../components/rebootconfirm";

const player_width = 640 * 1.15;
const player_height = 360 * 1.15;

const useStyles = makeStyles((theme) =>
  createStyles({
    home: {
      paddingLeft: theme.spacing(2),
      paddingRight: theme.spacing(2),
    },
    videoplayer: {
      height: player_height + "px",
      width: player_width + "px",
      backgroundColor: "#000000",
    },
    rtmpinfo: {
      marginTop: theme.spacing(3),
    },
    urls: {
      marginTop: theme.spacing(1),
      marginBottom: theme.spacing(1),
    },
    urlheader: {
      fontWeight: "bold",
    },
    urlvalue: {
      padding: "8px",
    },
    paper: {
      height: "auto",
      padding: theme.spacing(1),
    },
    actioncnt: {
      height: "48px",
      marginTop: theme.spacing(2),
      marginBottom: theme.spacing(1),
    },
    txtfield: {
      marginTop: theme.spacing(2),
      marginBottom: theme.spacing(2),
    },
    preloadercnt: {
      height: "700px",
      width: "100%",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
    },
    preloadertxt: { fontSize: "20px", marginTop: "16px" },
    avatar: {
      backgroundColor: "#121858",
      width: theme.spacing(4.5),
      height: theme.spacing(4.5),
      cursor: "pointer",
    },
    profilemenu: {
      marginTop: "32px",
      marginLeft: "-48px",
    },
    iconlive: {
      color: "#32CD32",
      marginRight: "4px",
    },
    iconidle: {
      color: "red",
      marginRight: "4px",
    },
  })
);

const Home = () => {
  const { user, channels, actions } = useContext(AppContext);
  const [chlist, setchlist] = useState([]);
  const [ch, setCh] = useState(null);
  // preloaders and errors
  const [anchorEl, setAnchorEl] = useState(null);
  const [anchorProfileEl, setProfileAnchorEl] = useState(null);
  const [openForm, setOpenForm] = useState(false);
  const [openRebootDialog, setOpenRebootDialog] = useState(false);
  const [loading, setloading] = useState(false);
  const [errorsnack, seterrorsnack] = useState(false);
  const [isLive, setChannelLive] = useState(false);

  const changeRtmp = (index) => {
    setCh(chlist[index]);
    closeMenu();
  };

  const openProfileMenu = (event) => {
    setProfileAnchorEl(event.currentTarget);
  };

  const closeProfieMenu = () => {
    setProfileAnchorEl(null);
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

  const logoutUser = () => {
    actions.logout();
  };

  const loadChannels = async (forceload) => {
    setloading(true);
    let chs = [];
    if (forceload) {
      chs = await channelservice.getChannels(user);
      actions.setChannles(chs);
    } else {
      if (channels.length === 0) {
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

  const onVideoStart = () => {
    setChannelLive(true);
  };

  const onVideoError = () => {
    setChannelLive(false);
  };

  const askRebootComfirmation = () => {
    closeProfieMenu();
    setOpenRebootDialog(true);
  };

  const rebootRtmp = async () => {
    await channelservice.rebootServer(ch);
    logoutUser();
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
          <Grid
            item
            lg={12}
            container
            direction="row"
            justify="flex-end"
            className={classes.actioncnt}
          >
            <Grid item container alignItems="center" lg={5}>
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
              <Grid item container justify="flex-end" lg={4}>
                <Grid lg={6}>
                  <Button
                    aria-controls="change-channel-menu"
                    aria-haspopup="true"
                    onClick={openMenu}
                    disableElevation
                  >
                    {ch.name}
                    <DownArrowIcon />
                  </Button>
                </Grid>
              </Grid>
            )}
            <Grid item lg={1}>
              <Avatar onClick={openProfileMenu} className={classes.avatar}>
                {(user.username || "S")[0].toUpperCase()}
              </Avatar>
            </Grid>
          </Grid>
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
              <Grid item lg={12} container justify="center">
                <div className={classes.videoplayer}>
                  <ReactPlayer
                    width={player_width}
                    height={player_height}
                    url={ch.httpLink}
                    controls={true}
                    playing={true}
                    onError={onVideoError}
                    onStart={onVideoStart}
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
              </Grid>
              <Menu
                id="profile-avatar-menu"
                anchorEl={anchorProfileEl}
                keepMounted
                open={Boolean(anchorProfileEl)}
                onClose={closeProfieMenu}
                className={classes.profilemenu}
              >
                <MenuItem onClick={askRebootComfirmation}>Reboot</MenuItem>
                <MenuItem onClick={logoutUser}>Logout</MenuItem>
              </Menu>
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
        onYes={rebootRtmp}
      />
    </div>
  );
};

export default Home;