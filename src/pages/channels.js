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
  Menu,
  MenuItem,
  Snackbar,
  IconButton,
} from "@material-ui/core";
// import LiveIcon from "@material-ui/icons/FiberManualRecordRounded";
import MenuIcon from "@material-ui/icons/MoreVertRounded";
import channelservice from "../service/channel.service";
import AppContext from "../context/context";
import PlusIcon from "@material-ui/icons/AddRounded";
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
  })
);

const Channels = () => {
  const classes = useStyles();

  const { user, channels, actions } = useContext(AppContext);
  const [chnl, setChannel] = useState(null);
  const [msg, setMsg] = useState("Loading channels...");
  // loaders and errors
  const [loading, setLoading] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const [deletesnack, setdeletesnack] = useState(false);
  const [openEditForm, setOpenEditForm] = useState(false);
  const [openDeleteConfirm, setDeleteConfirm] = useState(false);
  const [openCreateForm, setOpenCreateForm] = useState(false);
  const [errorsnack, seterrorsnack] = useState(false);

  const setActiveChanel = (index) => {
    const actchannel = channels[index];
    setChannel(actchannel);
  };

  const openMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const closeMenu = () => {
    setAnchorEl(null);
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
    closeMenu();
  };

  const closeEditChannelForm = () => {
    setOpenEditForm(false);
  };

  const askConfirmation = () => {
    setDeleteConfirm(true);
    closeMenu();
  };

  const deleteChannel = async () => {
    setDeleteConfirm(false);
    setMsg("Deleting channel " + chnl.name);
    setLoading(true);
    closeMenu();
    await channelservice.deleteChannel(chnl);
    setdeletesnack(true);
    loadChannels();
  };

  const loadChannels = async () => {
    actions.setChannles([]);
    setMsg("Loading channels...");
    setLoading(true);
    const chs = await channelservice.getChannels(user);
    actions.setChannles(chs);
    setTimeout(() => setLoading(false), 500);
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
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {channels.map((channel, index) => (
                      <TableRow key={channel.key}>
                        <TableCell align="left">{`${index + 1}.`}</TableCell>
                        <TableCell align="left">{channel.key}</TableCell>
                        <TableCell align="left">{channel.httpLink}</TableCell>
                        <TableCell align="right">
                          <MenuIcon
                            onClick={(event) => {
                              setActiveChanel(index);
                              openMenu(event);
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
      <Menu
        id="edit-channel-menu"
        anchorEl={anchorEl}
        keepMounted
        open={Boolean(anchorEl)}
        onClose={closeMenu}
      >
        <MenuItem onClick={openEditChannelForm}>Edit channel </MenuItem>
        <MenuItem onClick={askConfirmation}>Delete channel</MenuItem>
      </Menu>
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
