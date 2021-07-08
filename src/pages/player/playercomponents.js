import React, { useState } from "react";
import { Grid, Paper, Snackbar, IconButton } from "@material-ui/core";
import ReactPlayer from "react-player";
import useStyles from "./player.styles";
import FileCopyIcon from "@material-ui/icons/FileCopy";
import HealthIcon from "../../components/healthicon";

const CopyIcon = ({ onClick }) => {
  return (
    <IconButton color="primary" onClick={onClick}>
      <FileCopyIcon fontSize="small" />
    </IconButton>
  );
};

const StreamUserInfo = ({ ch }) => {
  const [snack, setSnack] = useState(false);
  const onCopy = (text) => {
    navigator.clipboard.writeText(text).then(function () {
      setSnack(true);
    });
  };
  const classes = useStyles();
  // const previewUrl = `${process.env.REACT_APP_APPURL}/play/${ch.name}`;
  const previewUrl = `https://${ch.server}/play/${ch.name}`;
  return (
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
          <div>
            <p className={classes.urlheader}>Stream URL</p>
            <p className={classes.urlvalue}>{ch.displayStreamLink}</p>
          </div>
          <CopyIcon onClick={() => onCopy(ch.displayStreamLink)} />
        </Paper>
        <Paper elevation={0} square className={classes.paper}>
          <div>
            <p className={classes.urlheader}>Key</p>
            <p className={classes.urlvalue}>{ch.token}</p>
          </div>
          <CopyIcon onClick={() => onCopy(ch.token)} />
        </Paper>
      </Grid>
      <Grid item lg={12} xs={12} className={classes.urls}>
        <Paper elevation={0} square className={classes.paper}>
          <div>
            <p className={classes.urlheader}>RTMP Play URL</p>
            <p className={classes.urlvalue}>{ch.rtmpLink}</p>
          </div>
          <CopyIcon onClick={() => onCopy(ch.rtmpLink)} />
        </Paper>
      </Grid>
      <Grid item lg={12} xs={12} className={classes.urls}>
        <Paper elevation={0} square className={classes.paper}>
          <div>
            <p className={classes.urlheader}>HLS</p>
            <p className={classes.urlvalue}>{ch.httpLink}</p>
          </div>
          <CopyIcon onClick={() => onCopy(ch.httpLink)} />
        </Paper>
      </Grid>
      <Grid item lg={12} xs={12} className={classes.urls}>
        <Paper elevation={0} square className={classes.paper}>
          <div>
            <p className={classes.urlheader}>Player URL</p>
            <p className={classes.urlvalue}>{previewUrl}</p>
          </div>
          <CopyIcon onClick={() => onCopy(previewUrl)} />
        </Paper>
      </Grid>
      <Snackbar
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
        open={snack}
        onClose={() => setSnack(false)}
        autoHideDuration={1000}
        message="Copied to clipboard"
        key={"text-copy-snack"}
      />
    </Grid>
  );
};

const StreamMetadata = ({ metadata }) => {
  const classes = useStyles();
  return (
    <Grid
      container
      style={{ paddingRight: "16px" }}
      className={classes.rtmpinfo}
      spacing={2}
    >
      <Grid item xs={12} sm={12} lg={4} className={classes.urls}>
        <Paper elevation={0} square className={classes.paper}>
          <div>
            <p className={classes.urlheader}>Video Bitrate</p>
            <p className={classes.urlvalue}>{metadata.videoRate}</p>
            <p className={classes.urlheader}>Video Type</p>
            <p className={classes.urlvalue}>{metadata.videoType}</p>
          </div>
        </Paper>
      </Grid>
      <Grid item xs={12} sm={12} lg={4} className={classes.urls}>
        <Paper elevation={0} square className={classes.paper}>
          <div>
            <p className={classes.urlheader}>Audio Bitrate</p>
            <p className={classes.urlvalue}>{metadata.audioRate}</p>
            <p className={classes.urlheader}>Audio Type</p>
            <p className={classes.urlvalue}>{metadata.audioType}</p>
          </div>
        </Paper>
      </Grid>
      <Grid item xs={12} sm={12} lg={4} className={classes.urls}>
        <Paper elevation={0} square className={classes.paper}>
          <div>
            <p className={classes.urlheader}>Frames Per Second</p>
            <p className={classes.urlvalue}>{metadata.fps}</p>
            <p className={classes.urlheader}>Resolution</p>
            <p className={classes.urlvalue}>{metadata.resolution}</p>
          </div>
        </Paper>
      </Grid>
    </Grid>
  );
};

const StreamPlayer = ({ ch, onVideoError, onVideoStart, onVideoPlay }) => {
  const classes = useStyles();
  return (
    <Grid item lg={12} xs={12} sm={12} container justify="center">
      <div className={classes.videoplayer}>
        <ReactPlayer
          id="player-video-player-id"
          url={ch.httpLink}
          controls={true}
          playing={true}
          onError={onVideoError}
          onStart={onVideoStart}
          onPlay={onVideoPlay}
        />
        {/* <div className={classes.iconlive}>
          <HealthIcon status={true} /> Live
        </div> */}
      </div>
    </Grid>
  );
};

export { StreamUserInfo, StreamMetadata, StreamPlayer };
