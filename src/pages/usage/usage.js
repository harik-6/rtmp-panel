import React, { useContext, useState, useEffect } from "react";
import {
  Grid,
  CircularProgress,
  // Button,
  // Menu,
  // MenuItem,
} from "@material-ui/core";
import ReactHighcharts from "react-highcharts";
import userservice from "../../service/user.service";
import AppContext from "../../context/context";
import useStyles from "./usage.styles";
// import DownArrowIcon from "@material-ui/icons/ExpandMoreRounded";
import formatDataFormVizualisation from "./usage.utils";

const Usage = () => {
  const { user, actions, usageData } = useContext(AppContext);
  const [nodata, setNoData] = useState(false);
  const [loading, setLoading] = useState(false);
  const [graphData, setGraphData] = useState([]);
  // const [anchorEl, setAnchorEl] = useState(null);
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

  // const openMenu = (event) => {
  //   setAnchorEl(event.currentTarget);
  // };

  // const closeMenu = () => {
  //   setAnchorEl(null);
  // };

  const formatVizData = (map) => {
    const resultObj = formatDataFormVizualisation(map);
    setTotalData(resultObj.usageDataObj);
    setGraphData(resultObj.graphDataObj);
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
  // const isAdmin = user["_id"] === process.env.REACT_APP_ADMINID;
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
                {/* {isAdmin && (
                  <>
                    <Button
                      aria-controls="change-owner-menu"
                      aria-haspopup="true"
                      onClick={openMenu}
                      disableElevation
                    >
                      {"something"}
                      <DownArrowIcon />
                    </Button>
                    <Menu
                      id="switch-channel-menu"
                      anchorEl={anchorEl}
                      keepMounted
                      open={Boolean(anchorEl)}
                      onClose={closeMenu}
                    >
                      {chlist.map((channel, index) => (
                        <MenuItem
                          key={channel.name}
                          onClick={() => changeRtmp(index)}
                        >
                          {channel.name}
                        </MenuItem>
                      ))}
                    </Menu>
                  </>
                )} */}
                <DataViz totalData={totalData} graphData={graphData} />
              </React.Fragment>
            )}
          </Grid>
        </Grid>
      )}
    </div>
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
