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
import formatDataFormVizualisation from "./usage.utils";
import userservice from "../../service/user.service";

const useStyles = makeStyles((theme) =>
  createStyles({
    channelsadmin: {
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
    let alldata =
      (await userservice.getUsageData({
        user,
        settings,
      })) || [];
    const allids = [...new Set(alldata.map((obj) => obj.usageId))];
    let list = [];
    const idtoservernamp = {};
    allUsers.forEach(obj => {
      idtoservernamp[obj.settings.usageid] = obj.user.server
    });
    allids.forEach((id) => {
      const filtered = alldata.filter((obj) => obj["usageId"] === id);
      let fmtd = Object.assign(
        { usageId: idtoservernamp[id]||id },
        formatDataFormVizualisation(filtered).usageDataObj
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

  if (loading) {
    return <Preloader message={"Loading data..."} />;
  }
  return (
    <div className={classes.channelsadmin}>
      <TableContainer className={classes.tablecnt}>
        <Table aria-label="channel-list">
          <TableRow>
            <TableCell align="left">Server</TableCell>
            <TableCell align="left">Total</TableCell>
            <TableCell align="left">Inbound(Mbps)</TableCell>
            <TableCell align="left">Outbound(Mbps)</TableCell>
          </TableRow>
          <TableBody>
            {usagelist.map((usage, index) => (
              <TableRow key={usage.usageId + " " + index}>
                <TableCell className={classes.tbcell} align="left">
                  {usage.usageId}
                </TableCell>
                <TableCell className={classes.tbcell} align="left">
                  {usage.total.value + " " + usage.total.unit}
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
