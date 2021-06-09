import React from "react";
import { Grid, Paper } from "@material-ui/core";
import ReactPlayer from "react-player";
import RoundIcon from "@material-ui/icons/FiberManualRecordRounded";
import useStyles from "./player.styles";

const StreamUserInfo = ({ ch }) => {
  const classes = useStyles();
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
  );
};

const LiveDotIcon = ({ isLive }) => {
  const classes = useStyles();
  return (
    <Grid item container alignItems="center" sm={12} xs={12} lg={3}>
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
          <p className={classes.urlheader}>Video Bitrate</p>
          <p className={classes.urlvalue}>{metadata.videoRate}</p>
          <p className={classes.urlheader}>Video Type</p>
          <p className={classes.urlvalue}>{metadata.videoType}</p>
        </Paper>
      </Grid>
      <Grid item xs={12} sm={12} lg={4} className={classes.urls}>
        <Paper elevation={0} square className={classes.paper}>
          <p className={classes.urlheader}>Audio Bitrate</p>
          <p className={classes.urlvalue}>{metadata.audioRate}</p>
          <p className={classes.urlheader}>Audio Type</p>
          <p className={classes.urlvalue}>{metadata.audioType}</p>
        </Paper>
      </Grid>
      <Grid item xs={12} sm={12} lg={4} className={classes.urls}>
        <Paper elevation={0} square className={classes.paper}>
          <p className={classes.urlheader}>Frames Per Second</p>
          <p className={classes.urlvalue}>{metadata.fps}</p>
          <p className={classes.urlheader}>Resolution</p>
          <p className={classes.urlvalue}>{metadata.resolution}</p>
        </Paper>
      </Grid>
    </Grid>
  );
};

const StreamPlayer = ({ch,onVideoError,onVideoStart,onVideoPlay}) => {
  const classes = useStyles();
  return <Grid item lg={12} xs={12} sm={12} container justify="center">
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
  </div>
</Grid>
}

export { StreamUserInfo, LiveDotIcon, StreamMetadata,StreamPlayer };