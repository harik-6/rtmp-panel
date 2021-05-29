import React, { useContext, useState, useEffect } from "react";
import {
  Grid,
  Table,
  TableHead,
  TableRow,
  TableBody,
  TableCell,
  TableContainer,
  CircularProgress,
  Snackbar,
  IconButton,
  TablePagination,
  Button,
} from "@material-ui/core";
import channelservice from "../../service/channel.service";
import AppContext from "../../context/context";
import PlusIcon from "@material-ui/icons/AddRounded";
import EditIcon from "@material-ui/icons/EditRounded";
import HealthIcon from "@material-ui/icons/FiberManualRecordRounded";
import DeleteIcon from "@material-ui/icons/Delete";
import PreviewIcon from "@material-ui/icons/PlayArrow";
import CreateNewChannel from "../../components/createchannel";
import EditChannel from "../../components/editchannel";
import DeleteConfirmationDialog from "../../components/deletechannel";
import useStyles from "./channels.styles";

const Channels = () => {
  const classes = useStyles();
  const { user, channels, actions, healthList } = useContext(AppContext);
  const [chnl, setChannel] = useState(null);
  const [msg, setMsg] = useState("Loading channels...");
  const [healthStatus, setHealthStatus] = useState([]);
  const [activeChannelCount, setActiveChannelCount] = useState(-1);
  const [pageSize, setPageSize] = useState(10);
  const [page, setPage] = useState(0);
  // loaders and errors
  const [loading, setLoading] = useState(false);
  const [action, setAction] = useState(null);
  const [openDeleteConfirm, setDeleteConfirm] = useState(false);
  const [snack, setSnack] = useState({ open: false, message: "" });

  const setActiveChanel = (index) => {
    const actchannel = channels[index];
    setChannel(actchannel);
  };

  const openSnack = () => {
    setSnack({
      open: true,
      message: "Channel limit exceeded.",
    });
  };

  const closeSnack = () => {
    setSnack({
      open: false,
      message: "",
    });
  };

  const openCreateChannelForm = () => {
    if (user.channelLimit === channels.length) {
      openSnack();
      return;
    } else {
      openActionDialog("add");
    }
  };

  const openActionDialog = (action) => {
    setAction(action);
  };

  const closeActionDialog = () => {
    setChannel(null);
    setAction(null);
  };

  const askConfirmation = () => {
    setDeleteConfirm(true);
  };

  const recheckChannelHealth = async () => {
    await checkHealth(channels);
    setSnack({
      open: true,
      message: "Chanel health recheked.",
    });
  };

  const deleteChannel = async () => {
    setDeleteConfirm(false);
    setMsg("Deleting channel " + chnl.name);
    setLoading(true);
    await channelservice.deleteChannel(chnl);
    setSnack({
      open: true,
      message: "Channel successfully deleted.",
    });
    loadChannels();
  };

  const loadChannels = async () => {
    actions.setChannles(null);
    setMsg("Loading channels...");
    setLoading(true);
    setTimeout(async () => {
      const chs = await channelservice.getChannels(user);
      actions.setChannles(chs);
      const htharray = new Array(chs.length);
      for (let i = 0; i < htharray.length; i++) {
        htharray[i] = false;
      }
      checkHealth(chs);
      setLoading(false);
    }, 1000);
  };

  const openPreview = (chnllll) => {
    const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
    if (isMobile) {
      window.open(
        `${process.env.REACT_APP_APPURL}?page=play&channel=${chnllll.name}`
      );
    } else {
      window.open(
        `${process.env.REACT_APP_APPURL}?page=webplay&channel=${chnllll.name}`
      );
    }
  };
  const updateActiveCount = (hlthList) => {
    const act = hlthList.filter((value) => value === true);
    setActiveChannelCount(act.length);
  };

  const checkHealth = async (channelslist) => {
    let healthArr = new Array(channelslist.length);
    for (let i = 0; i < channelslist.length; i++) {
      const health = await channelservice.checkChannelHealth(channelslist[i]);
      healthArr[i] = health;
    }
    const arr = [...healthArr];
    setHealthStatus(arr);
    updateActiveCount(arr);
    actions.setHealth(arr);
  };

  const handleChangePage = (event, pagenumber) => {
    setPage(pagenumber);
  };

  const handleChangeRowsPerPage = (event) => {
    setPageSize(event.target.value);
  };
  const offSet = page * pageSize;
  const spliceddata = (channels || []).slice(offSet, (page + 1) * pageSize);

  useEffect(() => {
    if (
      channels !== null &&
      channels.length > 0 &&
      (healthList === null || healthList === undefined)
    ) {
      checkHealth(channels);
    } else {
      if ((healthList || []).length > 0) {
        setHealthStatus([...healthList]);
        updateActiveCount(healthList);
      }
    }
    //eslint-disable-next-line
  }, [channels]);

  return (
    <div className={classes.channels}>
      {loading ? (
        <div className={classes.preloadercntloader}>
          <CircularProgress />
          <p className={classes.preloadertxtloader}>{msg}</p>
        </div>
      ) : (
        <Grid className={classes.chcardcnt} container>
          <Grid
            style={{ marginBottom: "24px" }}
            item
            container
            justify="flex-end"
            lg={12}
          >
            <Grid item lg={2}>
              <Button
                onClick={recheckChannelHealth}
                variant="contained"
                color="primary"
              >
                Health check
              </Button>
            </Grid>
          </Grid>
          <Grid item lg={12}>
            {(channels || []).length <= 0 ? (
              <>
                <div className={classes.preloadercnt}>
                  <p className={classes.preloadertxt}>
                    You don't have any channel.Create one
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
                      lg={5}
                    >
                      <p className={classes.countHeader}>Total channels</p>
                      <p className={classes.countValue}>{channels.length}</p>
                    </Grid>
                    <Grid
                      className={classes.countCnt}
                      item
                      sm={5}
                      xs={5}
                      lg={5}
                    >
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
                <TableContainer className={classes.tablecnt}>
                  <TablePagination
                    rowsPerPageOptions={[10, 15, 25]}
                    component="div"
                    count={channels.length}
                    rowsPerPage={pageSize}
                    page={page}
                    onChangePage={handleChangePage}
                    onChangeRowsPerPage={handleChangeRowsPerPage}
                  />
                  <Table aria-label="channel-list">
                    <TableHead>
                      <TableRow>
                        <TableCell align="left">S.No</TableCell>
                        <TableCell align="left">Name</TableCell>
                        <TableCell align="left">Key</TableCell>
                        <TableCell align="left">Hls</TableCell>
                        <TableCell align="left">{""}</TableCell>
                        <TableCell align="left">{""}</TableCell>
                        <TableCell align="left">{""}</TableCell>
                        <TableCell align="left">{""}</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {spliceddata.map((channel, index) => (
                        <TableRow key={channel.key + " " + index}>
                          <TableCell
                            className={classes.tbcell}
                            align="left"
                          >{`${offSet + index + 1}.`}</TableCell>
                          <TableCell className={classes.tbcell} align="left">
                            {channel.name}
                          </TableCell>
                          <TableCell className={classes.tbcell} align="left">
                            {channel.key}
                          </TableCell>
                          <TableCell className={classes.tbcell} align="left">
                            {channel.httpLink}
                          </TableCell>
                          <TableCell className={classes.tbcell} align="left">
                            <IconButton size="small">
                              <HealthIcon
                                fontSize="small"
                                style={{
                                  color: healthStatus[index]
                                    ? "#32CD32"
                                    : "red",
                                }}
                              />
                            </IconButton>
                          </TableCell>
                          <TableCell className={classes.tbcell} align="left">
                            <IconButton
                              onClick={() => {
                                setActiveChanel(index);
                                openActionDialog("edit");
                              }}
                            >
                              <EditIcon />
                            </IconButton>
                          </TableCell>
                          <TableCell className={classes.tbcell} align="left">
                            <IconButton
                              onClick={() => {
                                setActiveChanel(index);
                                askConfirmation();
                              }}
                            >
                              <DeleteIcon fontSize="small" />
                            </IconButton>
                          </TableCell>
                          <TableCell className={classes.tbcell} align="left">
                            <IconButton
                              disabled={!healthStatus[index]}
                              onClick={() => {
                                openPreview(channel);
                              }}
                            >
                              <PreviewIcon
                                style={{
                                  color: healthStatus[index]
                                    ? "#32CD32"
                                    : "grey",
                                }}
                                fontSize="small"
                              />
                            </IconButton>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              </React.Fragment>
            )}
          </Grid>
        </Grid>
      )}
      <CreateNewChannel
        openForm={action === "add"}
        closeCreatepop={closeActionDialog}
        successCallback={() => {
          closeActionDialog();
          loadChannels();
        }}
      />
      {chnl !== null && (
        <EditChannel
          openForm={action === "edit"}
          closeForm={closeActionDialog}
          successCallback={loadChannels}
          channel={chnl}
        />
      )}
      {chnl !== null && (
        <DeleteConfirmationDialog
          openForm={openDeleteConfirm}
          closeForm={() => setDeleteConfirm(false)}
          onDeleteYes={deleteChannel}
          channel={chnl}
        />
      )}
      <Snackbar
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
        open={snack.open}
        autoHideDuration={3000}
        message={snack.message}
        onClose={closeSnack}
        key={"snack"}
      />
      <IconButton
        style={{
          position: "fixed",
          right: "24px",
          bottom: "24px",
          background: "#121858",
        }}
        onClick={openCreateChannelForm}
      >
        <PlusIcon style={{ color: "white", fontSize: "32px" }} />
      </IconButton>
    </div>
  );
};

export default Channels;
