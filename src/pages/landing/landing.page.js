import React, { useState, useContext } from "react";
import { makeStyles, createStyles } from "@material-ui/core/styles";
import { Grid, Button } from "@material-ui/core";

const useStyles = makeStyles((theme) =>
  createStyles({
    login: {
      margin : 0,
      padding : 0,
      height: "100%",
      width: "100%",
      backgroundImage: `url(${process.env.PUBLIC_URL}/bg2.jpg)`,
      overflowX: "hidden",
      display : "flex",
      flexDirection:"column"
    },
    topnav: {
      height: "48px",
      backgroundColor: "purple",
    },
    landinggrid: {
        flex : 1,
      },
    maintxt: {
      fontSize: "100px",
      color: "#ffffff",
      fontWeight: "bold",
    },
    subtxt: {
      fontSize: "16px",
      color: "#ffffff",
    },
    txtcnt: {
      paddingLeft: theme.spacing(6),
    },
  })
);

const LandingPage = () => {
  const classes = useStyles();

  return (
    <div className={classes.login}>
      <Grid className={classes.topnav}></Grid>
      <Grid container className={classes.landinggrid}>
        <Grid
          item
          xs={12}
          sm={12}
          lg={12}
          alignItems="center"
          container
          spacing={1}
        >
          <Grid item xs={7} sm={6} lg={7}>
            <div className={classes.txtcnt}>
              <p className={classes.maintxt}>{process.env.REACT_APP_NAME}</p>
              <p className={classes.subtxt}>
                A cloud base streaming platform for fast and smooth live
                streaming.
              </p>
            </div>
          </Grid>
        </Grid>
      </Grid>
    </div>
  );
};

export default LandingPage;
