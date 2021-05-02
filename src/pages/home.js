import React, { useState, useEffect } from "react";
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
} from "@material-ui/core";
import ReactPlayer from "react-player";
import Slide from "@material-ui/core/Slide";
import userService from "../service/user.service";

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
  })
);

const Home = () => {
  const [openForm, setOpenForm] = useState(false);
  const [user, setUser] = useState(null);
  const createNewChannel = async () => {};

  const classes = useStyles();
  return (
    <div className={classes.home}>
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
              <p></p>
            </Paper>
          </Grid>
          <Grid item lg={6} xs={12} className={classes.urls}>
            <Paper elevation={0} square className={classes.paper}>
              <p className={classes.urlheader}>Stream link</p>
              <p></p>
            </Paper>
          </Grid>
        </Grid>
        <Grid item lg={12} xs={12} className={classes.urls}>
          <Paper elevation={0} square className={classes.paper}>
            <p className={classes.urlheader}>Iframe source</p>
            <p></p>
          </Paper>
        </Grid>
      </Grid>
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
            />
            <TextField
              className={classes.txtfield}
              fullWidth
              id="chkey"
              label="Chanel Key"
            />
            <TextField
              className={classes.txtfield}
              fullWidth
              id="trmp"
              label="RTMP"
              disabled
              value={"rtmp://dnsaddress:1935/key"}
            />
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={createNewChannel}
            variant="contained"
            color="primary"
            disableElevation
          >
            Create
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default Home;
