import React, { useContext, useState, useEffect } from "react";
import Grid from "@material-ui/core/Grid";
import ReactHighcharts from "react-highcharts";
import Preloader from "../../components/preloader";
import UsageAdmin from "./usage.admin";
import AppContext from "../../context/context";
import useStyles from "./usage.styles";
import { getUsageData } from "../../service/rtmp.service";
import { formatDataFormVizualisation } from "./usage.utils";

const Usage = () => {
  const classes = useStyles();
  const { user } = useContext(AppContext);
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

  const formatVizData = (map) => {
    const resultObj = formatDataFormVizualisation(map);
    setTotalData(resultObj.usageDataObj);
    setGraphData(resultObj.graphDataObj);
  };

  const loadUsageData = async () => {
    setLoading(true);
    const usage = await getUsageData(user);
    if (usage === null) {
      setNoData(true);
    } else {
      formatVizData(usage);
    }
    setLoading(false);
  };

  useEffect(() => {
    if (!(user || { admin: false }).admin) {
      loadUsageData();
    }
    //eslint-disable-next-line
  }, []);

  if (loading) {
    return <Preloader message={"Loading data..."} />;
  }

  return (user || { admin: false }).admin ? (
    <UsageAdmin />
  ) : (
    <>
      <div className={classes.usage}>
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
                <DataViz totalData={totalData} graphData={graphData} />
              </React.Fragment>
            )}
          </Grid>
        </Grid>
      </div>
    </>
  );
};

const DataViz = ({ totalData, graphData }) => {
  const classes = useStyles();
  return (
    <Grid container>
      <Grid item container justify="space-around" sm={12} xs={12} lg={12}>
        <Grid className={classes.countCnt} item sm={12} xs={12} lg={3}>
          <p className={classes.countHeader}>Total Bandwidth Usage</p>
          <div className={classes.countValueUnit}>
            <p className={classes.countValue}>{totalData.total.value}</p>
            <p className={classes.countUnit}>{totalData.total.unit}</p>
          </div>
        </Grid>
        <Grid className={classes.countCnt} item sm={12} xs={12} lg={3}>
          <p className={classes.countHeader}>Inbound Bandwidth</p>
          <div className={classes.countValueUnit}>
            <p className={classes.countValue}>{totalData.inBand.value}</p>
            <p className={classes.countUnit}>{totalData.inBand.unit}</p>
          </div>
        </Grid>
        <Grid className={classes.countCnt} item sm={12} xs={12} lg={3}>
          <p className={classes.countHeader}>Outband Bandwidth</p>
          <div className={classes.countValueUnit}>
            <p className={classes.countValue}>{totalData.outBand.value}</p>
            <p className={classes.countUnit}>{totalData.outBand.unit}</p>
          </div>
        </Grid>
      </Grid>
      <Grid
        className={classes.graphSpace}
        style={{ marginTop: "48px" }}
        lg={12}
      >
        <ReactHighcharts config={graphData} />
      </Grid>
    </Grid>
  );
};

export default Usage;
