import React, { useContext } from "react";
import { makeStyles, createStyles } from "@material-ui/core/styles";
import {
  Grid,
  Paper,
  Table,
  TableHead,
  TableRow,
  TableBody,
  TableCell,
  TableContainer,
} from "@material-ui/core";
import LiveIcon from "@material-ui/icons/FiberManualRecordRounded";
import AppContext from "../context/context";

const useStyles = makeStyles((theme) =>
  createStyles({
    channels: {
      paddingLeft: theme.spacing(2),
      paddingRight: theme.spacing(2),
    },
    chcardcnt: {
      marginTop: theme.spacing(5),
    },
    paper: {
      height: "160px",
      padding: theme.spacing(1),
    },
    tablecnt: {
      marginTop: theme.spacing(3),
      backgroundColor: "#FFFFFF",
    },
    paperhead: {
      textAlign: "center",
      fontSize: "18px",
      fontWeight: "bold",
      marginBottom: theme.spacing(3),
    },
    paperbody: {
      textAlign: "center",
      fontSize: "56px",
    },
    preloadercnt: {
      height: "400px",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
    },
    preloadertxt: { fontSize: "20px", marginTop: "16px" },
  })
);

const Channels = () => {
  const { channels } = useContext(AppContext);
  const classes = useStyles();
  return (
    <div className={classes.channels}>
      <Grid className={classes.chcardcnt} container>
        <Grid item lg={12} container justify="space-between" spacing={2}>
          <Grid item lg={6}>
            <Paper elevation={0} className={classes.paper}>
              <p className={classes.paperhead}>Total channels</p>
              <p className={classes.paperbody}>{channels.length}</p>
            </Paper>
          </Grid>
          <Grid item lg={6}>
            <Paper elevation={0} className={classes.paper}>
              <p className={classes.paperhead}>Active channels</p>
              <p className={classes.paperbody}>{channels.length}</p>
            </Paper>
          </Grid>
        </Grid>
        <Grid item lg={12}>
          {channels.length <= 0 ? (
            <>
              <div className={classes.preloadercnt}>
                <p className={classes.preloadertxt}>
                  You don't have any channel.Create one
                </p>
              </div>
            </>
          ) : (
            <TableContainer className={classes.tablecnt}>
              <Table aria-label="channel-list">
                <TableHead>
                  <TableRow>
                    <TableCell align="left">S.No</TableCell>
                    <TableCell align="left">Name</TableCell>
                    <TableCell align="left">Stream</TableCell>
                    <TableCell align="left">Health</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {channels.map((channel, index) => (
                    <TableRow key={channel.key}>
                      <TableCell align="left">{`${index + 1}.`}</TableCell>
                      <TableCell align="left">{channel.name}</TableCell>
                      <TableCell align="left">
                        {`http://${channel.server}:8080/live/${channel.key}
                        ?channel=${channel.name}&token=${channel.authToken}`}
                      </TableCell>
                      <TableCell align="left">
                        <LiveIcon
                          style={{
                            color: "green",
                          }}
                        />
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          )}
        </Grid>
      </Grid>
    </div>
  );
};

export default Channels;
