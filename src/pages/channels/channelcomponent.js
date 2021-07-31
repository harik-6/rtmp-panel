import React from "react";
import {
  Grid,
  Table,
  TableRow,
  TableBody,
  TableCell,
  TableContainer,
  CircularProgress,
  IconButton,
  // TablePagination,
  Switch,
} from "@material-ui/core";
import EditIcon from "@material-ui/icons/EditRounded";
import DeleteIcon from "@material-ui/icons/Delete";
import HealthIcon from "../../components/healthicon";
import useStyles from "./channels.styles";

const Insights = ({ channels, activeChannelCount }) => {
  const classes = useStyles();
  return (
    <Grid container>
      <Grid item container justify="space-around" lg={12}>
        <Grid className={classes.countCnt} item sm={5} xs={5} lg={5}>
          <p className={classes.countHeader}>Total channels</p>
          <p className={classes.countValue}>{channels.length}</p>
        </Grid>
        <Grid className={classes.countCnt} item sm={5} xs={5} lg={5}>
          <p className={classes.countHeader}>Active channels</p>
          <p className={classes.countValue}>
            {activeChannelCount === -1 ? (
              <CircularProgress />
            ) : (
              activeChannelCount
            )}
          </p>
        </Grid>
      </Grid>
    </Grid>
  );
};

const ChannelTable = ({
  spliceddata,
  healthStatus,
  setActiveChanel,
  openActionDialog,
  askConfirmation,
  setOpenStatusDialog,
  viewCount,
  isSuperAdmin,
}) => {
  const classes = useStyles();
  return (
    <TableContainer className={classes.tablecnt}>
      <Table aria-label="channel-list">
        <TableRow>
          <TableCell align="left">Name</TableCell>
          <TableCell align="left">Hls</TableCell>
          <TableCell align="center">Rtmp Count</TableCell>
          <TableCell align="left">Health</TableCell>
          {isSuperAdmin && <TableCell align="left">Edit</TableCell>}
          <TableCell align="left">Delete</TableCell>
          <TableCell align="left">On/Off</TableCell>
        </TableRow>
        <TableBody>
          {spliceddata.map((channel, index) => (
            <TableRow key={channel.key + " " + index}>
              <TableCell className={classes.tbcell} align="left">
                {channel.name}
              </TableCell>
              <TableCell className={classes.tbcell} align="left">
                {channel.httpLink}
              </TableCell>
              <TableCell className={classes.tbcell} align="center">
                {viewCount[channel.name] === undefined ||
                !healthStatus[channel.name]
                  ? 0
                  : viewCount[channel.name].rtmpCount}
              </TableCell>
              <TableCell className={classes.tbcell} align="left">
                <IconButton size="small">
                  <HealthIcon status={healthStatus[channel.name]} />
                </IconButton>
              </TableCell>
              {isSuperAdmin && (
                <TableCell className={classes.tbcell} align="left">
                  <IconButton
                    onClick={() => {
                      setActiveChanel(channel);
                      openActionDialog("edit");
                    }}
                  >
                    <EditIcon />
                  </IconButton>
                </TableCell>
              )}
              <TableCell className={classes.tbcell} align="left">
                <IconButton
                  onClick={() => {
                    setActiveChanel(channel);
                    askConfirmation();
                  }}
                >
                  <DeleteIcon fontSize="small" />
                </IconButton>
              </TableCell>
              <TableCell className={classes.tbcell} align="left">
                <Switch
                  size="small"
                  checked={channel.status}
                  onChange={() => {
                    setActiveChanel(channel);
                    setOpenStatusDialog(true);
                  }}
                  name="Channel on-off"
                />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export { ChannelTable, Insights };
