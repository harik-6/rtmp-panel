import React, { useContext, useState } from "react";
import { makeStyles, createStyles } from "@material-ui/core/styles";
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
} from "@material-ui/core";
import channelservice from "../service/channel.service";
import AppContext from "../context/context";
import PlusIcon from "@material-ui/icons/AddRounded";
import DeleteIcon from "@material-ui/icons/DeleteRounded";
import EditIcon from "@material-ui/icons/EditRounded";
import CreateNewChannel from "../components/createchannel";
import EditChannel from "../components/editchannel";
import DeleteConfirmationDialog from "../components/deletechannel";

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
    preloadercntloader: {
      height: "700px",
      width: "100%",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
    },
    preloadertxtloader: { fontSize: "20px", marginTop: "16px" },
    tbcell: {
      padding: "4px",
    },
  })
);

const Channels = () => {
  const classes = useStyles();

  const { user, channels, actions } = useContext(AppContext);
  const [chnl, setChannel] = useState(null);
  const [msg, setMsg] = useState("Loading channels...");
  // loaders and errors
  const [loading, setLoading] = useState(false);
  const [deletesnack, setdeletesnack] = useState(false);
  const [openEditForm, setOpenEditForm] = useState(false);
  const [openDeleteConfirm, setDeleteConfirm] = useState(false);
  const [openCreateForm, setOpenCreateForm] = useState(false);
  const [errorsnack, seterrorsnack] = useState(false);

  const setActiveChanel = (index) => {
    const actchannel = channels[index];
    setChannel(actchannel);
  };

  const openSnack = () => {
    seterrorsnack(true);
  };

  const closeSnack = () => {
    seterrorsnack(false);
  };

  const openCreateChannelForm = () => {
    if (user.channelLimit === channels.length) {
      openSnack();
      return;
    } else {
      setOpenCreateForm(true);
    }
  };

  const openEditChannelForm = () => {
    setOpenEditForm(true);
  };

  const closeEditChannelForm = () => {
    setOpenEditForm(false);
  };

  const askConfirmation = () => {
    setDeleteConfirm(true);
  };

  const deleteChannel = async () => {
    setDeleteConfirm(false);
    setMsg("Deleting channel " + chnl.name);
    setLoading(true);
    await channelservice.deleteChannel(chnl);
    setdeletesnack(true);
    loadChannels();
  };

  const loadChannels = async () => {
    actions.setChannles([]);
    setMsg("Loading channels...");
    setLoading(true);
    setTimeout(async () => {
      const chs = await channelservice.getChannels(user);
      actions.setChannles(chs);
      setLoading(false);
    }, 1000);
  };

  return (
    <div className={classes.channels}>
      {loading ? (
        <div className={classes.preloadercntloader}>
          <CircularProgress />
          <p className={classes.preloadertxtloader}>{msg}</p>
        </div>
      ) : (
        <Grid className={classes.chcardcnt} container>
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
                      <TableCell align="left">Key</TableCell>
                      <TableCell align="left">Hls</TableCell>
                      <TableCell align="left">{""}</TableCell>
                      <TableCell align="left">{""}</TableCell>
                      <TableCell align="left">{""}</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {channels.map((channel, index) => (
                      <TableRow key={channel.key}>
                        <TableCell className={classes.tbcell} align="left">{`${
                          index + 1
                        }.`}</TableCell>
                        <TableCell className={classes.tbcell} align="left">
                          {channel.key}
                        </TableCell>
                        <TableCell className={classes.tbcell} align="left">
                          {channel.httpLink}
                        </TableCell>
                        <TableCell className={classes.tbcell} align="right">
                          <IconButton
                            onClick={() => {
                              setActiveChanel(index);
                              openEditChannelForm();
                            }}
                          >
                            <EditIcon />
                          </IconButton>
                        </TableCell>
                        <TableCell className={classes.tbcell} align="right">
                          <IconButton
                            onClick={() => {
                              setActiveChanel(index);
                              askConfirmation();
                            }}
                          >
                            <DeleteIcon />
                          </IconButton>
                        </TableCell>
                        {/* <TableCell align="right">
                          <MenuIcon
                            onClick={(event) => {
                              setActiveChanel(index);
                              openMenu(event);
                            }}
                          />
                        </TableCell> */}
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            )}
          </Grid>
        </Grid>
      )}
      <CreateNewChannel
        openForm={openCreateForm}
        closeCreatepop={() => setOpenCreateForm(false)}
        successCallback={() => {
          setOpenCreateForm(false);
          loadChannels();
        }}
      />
      {chnl !== null && (
        <EditChannel
          openForm={openEditForm}
          closeForm={closeEditChannelForm}
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
        open={deletesnack}
        autoHideDuration={5000}
        onClose={() => setdeletesnack(false)}
        message="Channel successfully deleted"
        key={"err-snack"}
      />
      <Snackbar
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
        open={errorsnack}
        onClose={closeSnack}
        autoHideDuration={5000}
        message="Channel limit exceeded"
        key={"err-snack"}
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
