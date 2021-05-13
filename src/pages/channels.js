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
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  TextField,
  CircularProgress,
  Menu,
  MenuItem,
  Snackbar,
  IconButton
} from "@material-ui/core";
// import LiveIcon from "@material-ui/icons/FiberManualRecordRounded";
import MenuIcon from "@material-ui/icons/MoreVertRounded";
import Slide from "@material-ui/core/Slide";
import service from "../service/user.service";
import AppContext from "../context/context";
import PlusIcon from "@material-ui/icons/AddRounded";
import CreateNewChannel from "../components/createchannel";

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

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
    txtfield: {
      marginTop: theme.spacing(2),
      marginBottom: theme.spacing(2),
    },
  })
);

const Channels = () => {
  const classes = useStyles();

  const { user, channels, actions } = useContext(AppContext);
  const [chname, setchname] = useState("");
  const [chkey, setchkey] = useState("");
  const [chnl, setChannel] = useState(null);
  const [msg, setMsg] = useState("Loading channels...");
  // loaders and errors
  const [openForm, setOpenForm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const [chnameerror, setchnameerror] = useState(false);
  const [chkeyerror, setchkeyerror] = useState(false);
  const [creating, setcreating] = useState(false);
  const [deletesnack, setdeletesnack] = useState(false);
  const [openDeleteConfirm, setDeleteConfirm] = useState(false);
  const [openCreateForm,setOpenCreateForm] = useState(false);
  const [errorsnack, seterrorsnack] = useState(false);

  const handleChName = (e) => {
    setchname(e.target.value);
  };

  const handleChKey = (e) => {
    setchkey(e.target.value);
  };

  const setActiveChanel = (index) => {
    const actchannel = channels[index];
    setChannel(actchannel);
    setchname(actchannel.name);
    setchkey(actchannel.key);
  };

  const openMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const closeMenu = () => {
    setAnchorEl(null);
  };

  const closeEditpop = () => {
    setOpenForm(false);
    setchkeyerror(false);
    setchnameerror(false);
    setchname("");
    setchkey("");
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
    setOpenForm(true);
    closeMenu();
  };

  const editChannel = async () => {
    if (chname.length > 0 && chkey.length > 0) {
      const alltokens = service.getAllTokens();
      if(alltokens.length > 0) {
        if (alltokens.indexOf(chname.toLowerCase()) !== -1) {
          setchnameerror(true);
          return;
        }
        if (alltokens.indexOf(chkey.toLowerCase()) !== -1) {
          setchkeyerror(true);
          return;
        }
      }
      setcreating(true);
      const channel = await service.editchannel({
        ...chnl,
        name: chname.toLowerCase(),
        key: chkey.toLowerCase(),
      },user);
      if (channel !== null) {
        actions.setChannles([]);
        setcreating(false);
        setOpenForm(false);
        loadChannels();
      }
    }
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
    await service.deleteChannel(chnl);
    setdeletesnack(true);
    loadChannels();
  };

  const loadChannels = async () => {
    setMsg("Loading channels...");
    setLoading(true);
    const chs = await service.getChannels(user);
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
                      {/* <TableCell align="left">Health</TableCell> */}
                      <TableCell align="left">{""}</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {channels.map((channel, index) => (
                      <TableRow key={channel.key}>
                        <TableCell align="left">{`${index + 1}.`}</TableCell>
                        <TableCell align="left">{channel.key}</TableCell>
                        <TableCell align="left">
                          {channel.httpLink}
                        </TableCell>
                        {/* <TableCell align="left">
                          <LiveIcon
                            style={{
                              color: "green",
                            }}
                          />
                        </TableCell> */}
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
      <Dialog
        open={openForm}
        TransitionComponent={Transition}
        keepMounted
        onClose={closeEditpop}
        aria-labelledby="create-channel-form"
        fullWidth
      >
        <DialogTitle id="create-channel-form-title">
          {"Create a new channel"}
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="create-channel-form-title-description">
            <TextField
              className={classes.txtfield}
              fullWidth
              id="chname"
              label="Chanel Name"
              value={chname}
              disabled={creating}
              onChange={handleChName}
            />
            {chnameerror && (
              <p style={{ color: "red" }}>Name already exists.</p>
            )}
            <TextField
              className={classes.txtfield}
              fullWidth
              id="chkey"
              label="Chanel Key"
              value={chkey}
              disabled={creating}
              onChange={handleChKey}
            />
            {chkeyerror && <p style={{ color: "red" }}>Key already exists.</p>}
          </DialogContentText>
          {creating && (
            <div style={{ display: "flex", justifyContent: "center" }}>
              <CircularProgress />
            </div>
          )}
        </DialogContent>
        <DialogActions>
          {!creating && (
            <Button
              onClick={editChannel}
              variant="contained"
              color="primary"
              disableElevation
            >
              Save changes
            </Button>
          )}
        </DialogActions>
      </Dialog>
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
      {/* Delete a channel confirmation dialog */}
      <Dialog
        open={openDeleteConfirm}
        keepMounted
        onClose={() => setDeleteConfirm(false)}
        aria-labelledby="delete-channel-confirmation"
        fullWidth
      >
        <DialogTitle id="create-channel-form-title">
          {`Are you sure you want to delete ${chnl === null ? "" : chnl.name}?`}
        </DialogTitle>
        <DialogActions>
          <Button
            onClick={() => setDeleteConfirm(false)}
            variant="outlined"
            color="primary"
            disableElevation
          >
            Close
          </Button>
          <Button
            onClick={deleteChannel}
            variant="contained"
            color="primary"
            disableElevation
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>
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
      <CreateNewChannel
        openForm={openCreateForm}
        closeCreatepop={() => setOpenCreateForm(false)}
        successCallback={() => {
          setOpenCreateForm(false)
          loadChannels();
        }}
      />
      <Snackbar
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
        open={errorsnack}
        onClose={closeSnack}
        autoHideDuration={5000}
        message="Channel limit exceeded"
        key={"err-snack"}
      />
    </div>
  );
};

export default Channels;
