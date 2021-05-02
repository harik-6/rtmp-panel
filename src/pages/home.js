import React from "react";
import { makeStyles, createStyles } from "@material-ui/core/styles";
import { Grid, Paper } from "@material-ui/core";
import ReactPlayer from "react-player";

const player_width = 640 * 1.15;
const player_height = 360 * 1.15;

const useStyles = makeStyles((theme) =>
  createStyles({
    home: {
      paddingLeft: theme.spacing(2),
      paddingRight: theme.spacing(2),
    },
    videoplayer: {
      marginTop: theme.spacing(4),
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
  })
);

const Home = () => {
  const classes = useStyles();
  return (
    <div className={classes.home}>
      <Grid container>
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
    </div>
  );
};

export default Home;
