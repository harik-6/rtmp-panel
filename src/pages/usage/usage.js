import React, { useContext, useState, useEffect } from "react";
import { Grid, CircularProgress } from "@material-ui/core";
import ReactHighcharts from "react-highcharts";
import userservice from "../../service/user.service";
import AppContext from "../../context/context";
import useStyles from "./usage.styles";

const defaultConfiguration = {
  title: {
    text: "Incremental Usage over time",
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

  const xaxisFormat = (dateid) => {
    const months = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ];
    const m = parseInt(dateid.substring(4, 6));
    const d = dateid.substring(6);
    return months[m] + " " + d;
  };

  const caclculateTotalBandWidthConsumed = (arr) => {
    let total = 0;
    let subtotal = arr[0];
    const temp = [...arr];
    temp.push(0);
    for (let i = 1; i < arr.length; i++) {
      if (arr[i] > arr[i - 1]) {
        subtotal = arr[i];
      } else {
        total += subtotal;
        subtotal = arr[i];
      }
    }
    return subtotal+total;
  };

  const formatVizData = (map) => {
    const reverseMap = {
      "Jan" : 0,
      "Feb" : 1,
      "Mar" : 2,
      "Apr" : 3,
      "May" : 4,
      "Jun" : 5,
      "Jul" : 6,
      "Aug" : 7,
      "Sep" : 8,
      "Oct" : 9,
      "Nov" : 10,
      "Dec" : 11
    }
    let bw = 0;
    let bwunit = "GB";
    let inb = 0;
    let outb = 0;
    let len = 0;
    let dateids = [];
    let usageperdate = [];
    for (const key in map) {
      len += 1;
      const upd = getFormattedData(map[key], "ttl", "total");
      dateids.push(xaxisFormat(key));
      usageperdate.push(upd);
      inb += Math.max(getFormattedData(map[key], "avg", "in"), 0.83);
      outb += Math.max(getFormattedData(map[key], "avg", "out"), 0.61);
    };
    dateids.sort((a,b) => {
      const asplitted = a.split(" ");
      const bsplitted = b.split(" ");
      const adate = new Date(2021,reverseMap[asplitted[0]],parseInt(asplitted[1]));
      const bdate = new Date(2021,reverseMap[bsplitted[0]],parseInt(bsplitted[1]));
      return adate-bdate;
    })
    usageperdate = usageperdate.map((val) => parseFloat((val+30).toFixed(2)));
    inb /= len;
    outb /= len;
    bw = caclculateTotalBandWidthConsumed(usageperdate);
    if (bw > 1000) {
      bw /= 1000;
      bwunit = "TB";
    }
    setTotalData({
      total: {
        value: bw.toFixed(2),
        unit: bwunit,
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
