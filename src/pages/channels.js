import React from "react";
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
  })
);

const Channels = () => {
  const classes = useStyles();
  return (
    <div className={classes.channels}>
      <Grid className={classes.chcardcnt} container>
        <Grid item lg={12} container justify="space-between" spacing={2}>
          <Grid item lg={6}>
            <Paper elevation={0} className={classes.paper}>
              <p className={classes.paperhead}>Total channels</p>
              <p className={classes.paperbody}>4</p>
            </Paper>
          </Grid>
          <Grid item lg={6}>
            <Paper elevation={0} className={classes.paper}>
              <p className={classes.paperhead}>Active channels</p>
              <p className={classes.paperbody}>2</p>
            </Paper>
          </Grid>
        </Grid>
        <Grid item lg={12}>
          <TableContainer className={classes.tablecnt}>
            <Table aria-label="channel-list">
              <TableHead>
                <TableRow>
                  <TableCell align="left">S.No</TableCell>
                  <TableCell align="left">Name</TableCell>
                  <TableCell align="left">Rtmp</TableCell>
                  <TableCell align="left">Health</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                <TableRow key={"1"}>
                  <TableCell align="left">1.</TableCell>
                  <TableCell align="left">Test</TableCell>
                  <TableCell align="left">
                    http://livechannel.live/test
                  </TableCell>
                  <TableCell align="left">
                    <LiveIcon
                      style={{
                        color: "green",
                      }}
                    />
                  </TableCell>
                </TableRow>
                <TableRow key={"2"}>
                  <TableCell align="left">2.</TableCell>
                  <TableCell align="left">Test</TableCell>
                  <TableCell align="left">
                    http://livechannel.live/test
                  </TableCell>
                  <TableCell align="left">
                    <LiveIcon
                      style={{
                        color: "grey",
                      }}
                    />
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </TableContainer>
        </Grid>
      </Grid>
    </div>
  );
};

export default Channels;
