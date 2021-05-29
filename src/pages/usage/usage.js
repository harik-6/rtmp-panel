import React, { useContext, useState, useEffect } from "react";
import { Grid, CircularProgress } from "@material-ui/core";
import ReactHighcharts from "react-highcharts";
import userservice from "../../service/user.service";
import AppContext from "../../context/context";
import useStyles from "./usage.styles";

const defaultConfiguration = {
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
    categories: [],
  },
  plotOptions: {
    line: {
      color: "#3f51b5",
    },
  },
  credits: {
    enabled: false,
  },
  series: [
    {
      showInLegend: false,
      name: "Usage",
      data: [],
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
  const [graphData, setGraphData] = useState([]);
  const [totalData, setTotalData] = useState({
    total: {
      value: 0,
      unit: "GB",
    },
    inBand: {
      value: 0,
      unit: "Mb/s",
    },
    outBand: {
      value: 0,
      unit: "Mb/s",
    },
  });

  const getBoundUsageFormattedData = (map, key, type) => {
    const usage = map.usage[type];
    const splitted = usage[key].split(" ");
    let value = parseFloat(splitted[0]);
    const unit = splitted[1];
    switch (unit) {
      case "kBit/s":
        value /= 8000;
        break;
      case "GBit":
        value /= 8;
        break;
      default:
    }
    return {
      value,
      unit,
    };
  };

  const getFormattedData = (map, key, section) => {
    const inbound = getBoundUsageFormattedData(map, key, "inboundUsage");
    const outbound = getBoundUsageFormattedData(map, key, "outboundUsage");
    let total = 0;
    if (section === "in") {
      total = inbound.value;
    }
    if (section === "out") {
      total = outbound.value;
    }
    if (section === "total") {
      total = inbound.value + outbound.value;
    }
    return total;
  };

  const formatVizData = (map) => {
    let bw = 0;
    let inb = 0;
    let outb = 0;
    let len = 0;
    let dateids = [];
    let usageperdate = [];
    for (const key in map) {
      len += 1;
      const upd = getFormattedData(map[key], "ttl", "total");
      dateids.push(key);
      usageperdate.push(upd);
      bw += upd;
      inb += getFormattedData(map[key], "avg", "in");
      outb += getFormattedData(map[key], "avg", "out");
    }
    inb /= len;
    outb /= len;
    setTotalData({
      total: {
        value: bw.toFixed(2),
        unit: "GB",
      },
      inBand: {
        value: inb.toFixed(2),
        unit: "Mb/s",
      },
      outBand: {
        value: outb.toFixed(2),
        unit: "Mb/s",
      },
    });
    setGraphData({
      ...defaultConfiguration,
      xAxis: {
        categories: dateids,
      },
      series: [
        {
          showInLegend: false,
          name: "Usage",
          data: usageperdate,
        },
      ],
    });
  };

  const loadUsageData = async () => {
    setLoading(true);
    if (usageData === null) {
      const usage = await userservice.getUsageData(user);
      console.log(usage);
      if (usage === null) {
        setNoData(true);
      }
      actions.setUsageData(usage);
      formatVizData(usage);
    } else {
      formatVizData(usageData);
    }
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
                      <p className={classes.countHeader}>
                        Total Bandwidth Usage
                      </p>
                      <div className={classes.countValueUnit}>
                        <p className={classes.countValue}>
                          {totalData.total.value}
                        </p>
                        <p className={classes.countUnit}>
                          {totalData.total.unit}
                        </p>
                      </div>
                    </Grid>
                    <Grid
                      className={classes.countCnt}
                      item
                      sm={5}
                      xs={5}
                      lg={3}
                    >
                      <p className={classes.countHeader}>Inbound Bandwidth</p>
                      <div className={classes.countValueUnit}>
                        <p className={classes.countValue}>
                          {totalData.inBand.value}
                        </p>
                        <p className={classes.countUnit}>
                          {totalData.inBand.unit}
                        </p>
                      </div>
                    </Grid>
                    <Grid
                      className={classes.countCnt}
                      item
                      sm={5}
                      xs={5}
                      lg={3}
                    >
                      <p className={classes.countHeader}>Outband Bandwidth</p>
                      <div className={classes.countValueUnit}>
                        <p className={classes.countValue}>
                          {totalData.outBand.value}
                        </p>
                        <p className={classes.countUnit}>
                          {totalData.outBand.unit}
                        </p>
                      </div>
                    </Grid>
                  </Grid>
                  <Grid style={{ marginTop: "48px" }} lg={12}>
                    <ReactHighcharts config={graphData} />
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
