import React, { useState, useEffect, useContext } from "react";
import { makeStyles, createStyles } from "@material-ui/core/styles";
import {
  Grid,
  Paper,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  TextField,
  CircularProgress,
  Menu,
  MenuItem,
} from "@material-ui/core";
import ReactPlayer from "react-player";
import Slide from "@material-ui/core/Slide";
import AppContext from "../context/context";
import service from "../service/user.service";
import DownArrowIcon from "@material-ui/icons/ExpandMoreRounded";

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

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
      height: "80px",
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
  })
);

const Home = () => {
  const { user, channels, actions } = useContext(AppContext);
  const [chlist, setchlist] = useState([]);
  const [chname, setchname] = useState("");
  const [chkey, setchkey] = useState("");
  const [ch, setCh] = useState(null);
  // preloaders and errors
  const [anchorEl, setAnchorEl] = useState(null);
  const [openForm, setOpenForm] = useState(false);
  const [loading, setloading] = useState(false);
  const [creating, setcreating] = useState(false);
  const [chnameerror, setchnameerror] = useState(false);
  const [chkeyerror, setchkeyerror] = useState(false);

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

  const handleChName = (e) => {
    setchname(e.target.value);
  };

  const handleChKey = (e) => {
    setchkey(e.target.value);
  };

  const createNewChannel = async () => {
    if (user.channelLimit === channels.length) {
      alert("Channel limit exceeded");
      return;
    } else {
      if (chname.length > 0 && chkey.length > 0) {
        const existname = chlist.map((ch) => ch.name);
        const existkey = chlist.map((ch) => ch.key);
        if (existname.indexOf(chname.toLowerCase()) !== -1) {
          setchnameerror(true);
          return;
        }
        if (existkey.indexOf(chkey.toLowerCase()) !== -1) {
          setchkeyerror(true);
          return;
        }
        setcreating(true);
        const channel = await service.createChannel(user, chname, chkey);
        if (channel !== null) {
          setcreating(false);
          setOpenForm(false);
          loadChannels();
        }
      }
    }
  };

  const loadChannels = async () => {
    setloading(true);
    const chs = await service.getChannels(user);
    actions.loadChannels(chs);
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
    setchkeyerror(false);
    setchnameerror(false);
  };

  useEffect(() => {
    loadChannels();
  }, []);

  const classes = useStyles();
  return (
    <div className={classes.home}>
      {loading ? (
        <div className={classes.preloadercnt}>
          <CircularProgress />
          <p className={classes.preloadertxt}>Loading profile</p>
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
            {chlist.length > 0 && (
              <Grid item lg={2}>
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
            )}
            <Grid item lg={2}>
              <Button
                onClick={() => setOpenForm(true)}
                variant="contained"
                color="primary"
                disableElevation
              >
                Create channel
              </Button>
            </Grid>
          </Grid>
          {ch === null ? (
            <>
              <div className={classes.preloadercnt}>
                <p className={classes.preloadertxt}>
                  You don't have any channel.Create one
                </p>
              </div>
            </>
          ) : (
            <>
              <Grid item lg={12} container justify="center">
                <div className={classes.videoplayer}>
                  <ReactPlayer
                    width={player_width}
                    height={player_height}
                    playing={true}
                    url=""
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
                <Grid item lg={6} xs={12} className={classes.urls}>
                  <Paper elevation={0} square className={classes.paper}>
                    <p className={classes.urlheader}>Rtmp</p>
                    <p
                      className={classes.urlvalue}
                    >{`rtmp://${ch.server}:1935/${ch.key}`}</p>
                  </Paper>
                </Grid>
                <Grid item lg={6} xs={12} className={classes.urls}>
                  <Paper elevation={0} square className={classes.paper}>
                    <p className={classes.urlheader}>Stream link</p>
                    <p
                      className={classes.urlvalue}
                    >{`http://${ch.server}:8080/${ch.key}`}</p>
                  </Paper>
                </Grid>
              </Grid>
              <Grid item lg={12} xs={12} className={classes.urls}>
                <Paper elevation={0} square className={classes.paper}>
                  <p className={classes.urlheader}>Iframe source</p>
                  <p>{`<iframe src=http://${ch.server}:8080/${ch.key} width='400px'
                  height='400px' allowfullscreen mozallowfullscreen msallowfullscreen allow='autoplay' ></iframe>`}</p>
                </Paper>
              </Grid>
            </>
          )}
        </Grid>
      )}
      <Dialog
        open={openForm}
        TransitionComponent={Transition}
        keepMounted
        onClose={closeCreatepop}
        aria-labelledby="create-channel-form"
        fullWidth
      >
        <DialogTitle id="create-channel-form-title">
          {"Create a new channel"}
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="create-channel-form-title-description">
            <TextField
              className={classes.txtfield}
              fullWidth
              id="chname"
              label="Chanel Name"
              value={chname}
              disabled={creating}
              onChange={handleChName}
            />
            {chnameerror && (
              <p style={{ color: "red" }}>Name already exists.</p>
            )}
            <TextField
              className={classes.txtfield}
              fullWidth
              id="chkey"
              label="Chanel Key"
              value={chkey}
              disabled={creating}
              onChange={handleChKey}
            />
            {chkeyerror && <p style={{ color: "red" }}>Key already exists.</p>}
            <TextField
              className={classes.txtfield}
              fullWidth
              id="trmp"
              label="RTMP"
              disabled
              value={`rtmp://ec2-3-6-93-227.ap-south-1.compute.amazonaws.com:1935/${chkey}`}
            />
          </DialogContentText>
          {creating && (
            <div style={{ display: "flex", justifyContent: "center" }}>
              <CircularProgress />
            </div>
          )}
        </DialogContent>
        <DialogActions>
          {!creating && (
            <Button
              onClick={createNewChannel}
              variant="contained"
              color="primary"
              disableElevation
            >
              Create
            </Button>
          )}
        </DialogActions>
      </Dialog>
      <Menu
        id="switch-channel-menu"
        anchorEl={anchorEl}
        keepMounted
        open={Boolean(anchorEl)}
        onClose={closeMenu}
      >
        {chlist.map((channel, index) => (
          <MenuItem onClick={() => changeRtmp(index)}>{channel.name}</MenuItem>
        ))}
      </Menu>
    </div>
  );
};

export default Home;
