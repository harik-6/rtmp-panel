import React, { useState } from "react";
import {
  Grid,
  Table,
  TableRow,
  TableBody,
  TableCell,
  TableContainer,
  CircularProgress,
  IconButton,
  TablePagination,
  Switch,
} from "@material-ui/core";
import EditIcon from "@material-ui/icons/EditRounded";
import DeleteIcon from "@material-ui/icons/Delete";
import HealthIcon from "../../components/healthicon";
import EyeIcon from "@material-ui/icons/VisibilityRounded";
import useStyles from "./channels.styles";

const Insights = ({ channels, activeChannelCount, loading }) => {
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
            {loading ? <CircularProgress /> : activeChannelCount}
          </p>
        </Grid>
      </Grid>
    </Grid>
  );
};

const ChannelTable = ({
  tabledata,
  healthStatus,
  setActiveChanel,
  openActionDialog,
  askConfirmation,
  onViewClick,
  setOpenStatusDialog,
  viewCount,
  isSuperAdmin,
}) => {
  const [pageSize, setPageSize] = useState(10);
  const [page, setPage] = useState(0);

  const handleChangePage = (event, pagenumber) => {
    setPage(pagenumber);
  };

  const handleChangeRowsPerPage = (event) => {
    setPageSize(event.target.value);
  };

  const offSet = page * pageSize;
  const spliceddata = tabledata.slice(offSet, (page + 1) * pageSize);

  const classes = useStyles();
  return (
    <TableContainer className={classes.tablecnt}>
      <TablePagination
        rowsPerPageOptions={[10, 15, 25]}
        component="div"
        count={tabledata.length}
        rowsPerPage={pageSize}
        page={page}
        onChangePage={handleChangePage}
        onChangeRowsPerPage={handleChangeRowsPerPage}
      />
      <Table aria-label="channel-list">
        <TableRow>
          <TableCell align="left">Name</TableCell>
          <TableCell align="left">Hls</TableCell>
          <TableCell align="center">Rtmp Count</TableCell>
          <TableCell align="center">Hls Count</TableCell>
          <TableCell align="left">Health</TableCell>
          <TableCell align="left">View</TableCell>
          {isSuperAdmin && <TableCell align="left">Edit</TableCell>}
          <TableCell align="left">On/Off</TableCell>
          <TableCell align="left">Delete</TableCell>
        </TableRow>
        <TableBody>
          {spliceddata.map((channel, index) => (
            <TableRow key={channel.key + " " + index}>
              <TableCell className={classes.tbcell} align="left">
                {channel.name}
              </TableCell>
              <TableCell className={classes.tbcell} align="left">
                {channel.hls}
              </TableCell>
              <TableCell className={classes.tbcell} align="center">
                {viewCount[channel.name] === undefined ||
                !healthStatus[channel.name]
                  ? 0
                  : viewCount[channel.name].rtmpCount}
              </TableCell>
              <TableCell className={classes.tbcell} align="center">
              {viewCount[channel.name] === undefined ||
                !healthStatus[channel.name]
                  ? 0
                  : viewCount[channel.name].hlsCount}
              </TableCell>
              <TableCell className={classes.tbcell} align="left">
                <IconButton size="small">
                  <HealthIcon status={healthStatus[channel.name]} />
                </IconButton>
              </TableCell>
              <TableCell className={classes.tbcell} align="left">
                <IconButton
                  onClick={() => onViewClick(channel.name)}
                  disabled={!healthStatus[channel.name]}
                  size="small"
                >
                  <EyeIcon />
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
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export { ChannelTable, Insights };
