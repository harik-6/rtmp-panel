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
} from "@material-ui/core";
import ReactPlayer from "react-player";
import Slide from "@material-ui/core/Slide";
import AppContext from "../context/context";
import service from "../service/user.service";

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
    urlvalue: {},
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
  const [chindex, setChIndex] = useState(0);
  const [openForm, setOpenForm] = useState(false);
  const [loading, setloading] = useState(false);
  const [creating, setcreating] = useState(false);
  const [chname, setchname] = useState("");
  const [chkey, setchkey] = useState("");
  const [ch, setCh] = useState(null);

  const handleChName = (e) => {
    setchname(e.target.value);
  };

  const handleChKey = (e) => {
    setchkey(e.target.value);
  };

  const createNewChannel = async () => {
    setcreating(true);
    const channel = await service.createChannel(user, chname, chkey);
    if (channel !== null) {
      setcreating(false);
      setOpenForm(false);
      this.loadChannels();
    }
  };

  const loadChannels = async () => {
    if (channels.length === 0) {
      setloading(true);
      const channels = await service.getChannels(user);
      actions.loadChannels(channels);
      if (channels.length > 0) {
        setCh(channels[0]);
      } else {
        setCh(null);
      }
      setloading(false);
    } else {
      setCh(channels[chindex]);
    }
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
                    <p>{`rtmp://${ch.server}:1935/${ch.key}`}</p>
                  </Paper>
                </Grid>
                <Grid item lg={6} xs={12} className={classes.urls}>
                  <Paper elevation={0} square className={classes.paper}>
                    <p className={classes.urlheader}>Stream link</p>
                    <p>{`http://${ch.server}:8080/${ch.key}`}</p>
                  </Paper>
                </Grid>
              </Grid>
              <Grid item lg={12} xs={12} className={classes.urls}>
                <Paper elevation={0} square className={classes.paper}>
                  <p className={classes.urlheader}>Iframe source</p>
                  <p></p>
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
        onClose={() => setOpenForm(false)}
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
            <TextField
              className={classes.txtfield}
              fullWidth
              id="chkey"
              label="Chanel Key"
              value={chkey}
              disabled={creating}
              onChange={handleChKey}
            />
            <TextField
              className={classes.txtfield}
              fullWidth
              id="trmp"
              label="RTMP"
              disabled
              value={`rtmp://dnsaddress:1935/${chkey}`}
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
    </div>
  );
};

export default Home;
