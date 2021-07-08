import React, { useContext, useEffect, useState } from "react";
import {
  Table,
  TableRow,
  TableBody,
  TableCell,
  TableContainer,
} from "@material-ui/core";
import Preloader from "../../components/preloader";
import { makeStyles, createStyles } from "@material-ui/core/styles";
import AppContext from "../../context/context";
import { formatDataFormVizualisationAdmin } from "./usage.utils";
import { getUsageData } from "../../service/rtmp.service";

const useStyles = makeStyles((theme) =>
  createStyles({
    usageadmin: {
      flex : 1,
      minHeight:"100vh",
      padding: theme.spacing(2),
      backgroundColor: "#ebe9e9",
      [theme.breakpoints.down("sm")]: {
        padding: theme.spacing(0.5),
        marginTop: "48px",
      },
    },
    tablecnt: {
      marginTop: theme.spacing(3),
      backgroundColor: "#FFFFFF",
      marginBottom: theme.spacing(5),
      [theme.breakpoints.down("sm")]: {
        width: "350px",
        zIndex: 999,
      },
    },
    tbcell: {
      paddingTop: "16px",
      paddingBottom: "16px",
    },
  })
);

const UsageAdmin = () => {
  const { user, settings, allUsers } = useContext(AppContext);
  const [loading, setLoading] = useState(false);
  const [usagelist, setUsageList] = useState([]);

  const loadUsageData = async () => {
    setLoading(true);
    let alldata = await getUsageData({
      user,
      settings,
    });
    alldata = alldata || [];
    const allids = [...new Set(alldata.map((obj) => obj.usageId))];
    let list = [];
    const idtoservernamp = {};
    allUsers.forEach((obj) => {
      idtoservernamp[obj.settings.usageid] = obj.user.server;
    });
    allids.forEach((id) => {
      const filtered = alldata.filter((obj) => obj["usageId"] === id);
      let fmtd = Object.assign(
        { usageId: idtoservernamp[id] || id },
        formatDataFormVizualisationAdmin(filtered).usageDataObj
      );
      list.push(fmtd);
    });
    setUsageList(list);
    setLoading(false);
  };

  useEffect(() => {
    loadUsageData();
    //eslint-disable-next-line
  }, []);

  const classes = useStyles();

  const formatDisplayTotal = (value) => {
    if (value > 1000) return (value / 1000).toFixed(2) + " Tb";
    return value + " Gb";
  };

  if (loading) {
    return <Preloader message={"Loading data..."} />;
  }
  return (
    <div className={classes.usageadmin}>
      <TableContainer className={classes.tablecnt}>
        <Table aria-label="channel-list">
          <TableRow>
            <TableCell align="left">Server</TableCell>
            <TableCell align="left">Inbound Usage</TableCell>
            <TableCell align="left">Outbound Usage</TableCell>
            <TableCell align="left">Inbound Transfer(Mbps)</TableCell>
            <TableCell align="left">Outbound Transfer(Mbps)</TableCell>
          </TableRow>
          <TableBody>
            {usagelist.map((usage, index) => (
              <TableRow key={usage.usageId + " " + index}>
                <TableCell className={classes.tbcell} align="left">
                  {usage.usageId}
                </TableCell>
                <TableCell className={classes.tbcell} align="left">
                  {formatDisplayTotal(usage.total.intotal)}
                </TableCell>
                <TableCell className={classes.tbcell} align="left">
                  {formatDisplayTotal(usage.total.outtotal)}
                </TableCell>
                <TableCell className={classes.tbcell} align="left">
                  {usage.inBand.value}
                </TableCell>
                <TableCell className={classes.tbcell} align="left">
                  {usage.outBand.value}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
};

export default UsageAdmin;
