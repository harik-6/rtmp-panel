import React, { useContext, useState, useEffect } from "react";
import { Grid, CircularProgress } from "@material-ui/core";
import ReactHighcharts from "react-highcharts";
import userservice from "../../service/user.service";
import AppContext from "../../context/context";
import useStyles from "./usage.styles";

const configuration = {
  title: {
    text: "Usage over time",
  },
  subtitle: {
    text: "",
  },
  yAxis: {
    title: {
      text: "Usage in GB",
    },
  },
  legend: {},
  xAxis: {
    categories: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug"],
  },
  plotOptions : {
    line : {
      color : "#3f51b5"
    }
  },
  credits: {
    enabled: false,
  },
  series: [
    {
      showInLegend: false,
      name: "Usage",
      data: [43.4, 52.3, 57.7, 69.8, 97.1, 110.1, 130.3, 150.5],
    },
  ],
  responsive: {
    rules: [
      {
        condition: {
          maxWidth: 500,
        },
        chartOptions: {
          legend: {
            layout: "horizontal",
            align: "center",
            verticalAlign: "bottom",
          },
        },
      },
    ],
  },
};

const Usage = () => {
  const { user, actions, usageData } = useContext(AppContext);
  const [nodata, setNoData] = useState(false);
  const [loading, setLoading] = useState(false);

  const loadUsageData = async () => {
    setLoading(true);
    const usage = {};
    if (usage === null) {
      setNoData(true);
    }
    actions.setUsageData(usage);
    setLoading(false);
  };

  useEffect(() => {
    loadUsageData();
    //eslint-disable-next-line
  }, []);
  const classes = useStyles();
  return (
    <div className={classes.usage}>
      {loading ? (
        <div className={classes.preloadercntloader}>
          <CircularProgress />
          <p className={classes.preloadertxtloader}>Loading usage data.</p>
        </div>
      ) : (
        <Grid className={classes.chcardcnt} container>
          <Grid item lg={12}>
            {nodata ? (
              <>
                <div className={classes.preloadercnt}>
                  <p className={classes.preloadertxt}>
                    Your usage data is yet to be processed.
                  </p>
                </div>
              </>
            ) : (
              <React.Fragment>
                <Grid container>
                  <Grid item container justify="space-around" lg={12}>
                    <Grid
                      className={classes.countCnt}
                      item
                      sm={5}
                      xs={5}
                      lg={3}
                    >
                      <p className={classes.countHeader}>Total Usage</p>
                      <p className={classes.countValue}>100GB</p>
                    </Grid>
                    <Grid
                      className={classes.countCnt}
                      item
                      sm={5}
                      xs={5}
                      lg={3}
                    >
                      <p className={classes.countHeader}>Data Transfer</p>
                      <p className={classes.countValue}>2.4MB/s</p>
                    </Grid>
                    <Grid
                      className={classes.countCnt}
                      item
                      sm={5}
                      xs={5}
                      lg={3}
                    >
                      <p className={classes.countHeader}>Peaks</p>
                      <p className={classes.countValue}>2.4MB/s</p>
                    </Grid>
                  </Grid>
                  <Grid style={{ marginTop: "48px" }} lg={12}>
                    <ReactHighcharts config={configuration} />
                  </Grid>
                </Grid>
              </React.Fragment>
            )}
          </Grid>
        </Grid>
      )}
    </div>
  );
};

export default Usage;
