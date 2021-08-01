import React, { useState, useContext } from "react";
import { makeStyles, createStyles } from "@material-ui/core/styles";
import {
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
  FormLabel,
} from "@material-ui/core";
import Slide from "@material-ui/core/Slide";
import AppContext from "../context/context";
import { createChannel, getAllTokens } from "../service/channel.service";
import DownArrowIcon from "@material-ui/icons/ExpandMoreRounded";

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const useStyles = makeStyles((theme) =>
  createStyles({
    txtfield: {
      marginTop: theme.spacing(2),
      marginBottom: theme.spacing(2),
    },
  })
);

const CreateNewChannel = ({
  openForm,
  closeCreatepop,
  successCallback,
  channelSet,
}) => {
  const { user, actions } = useContext(AppContext);
  const [chname, setchname] = useState("");
  const [chkey, setchkey] = useState("");
  const [creating, setcreating] = useState(false);
  const [chnameerror, setchnameerror] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const [server, serServer] = useState(user.server);

  const handleChName = (e) => {
    setchname(e.target.value);
  };

  const handleChKey = (e) => {
    setchkey(e.target.value);
    handleChName(e);
  };

  const createNewChannel = async () => {
    if (chname.length > 0 && chkey.length > 0) {
      const alltokens = await getAllTokens(user);
      if (alltokens.length > 0) {
        if (alltokens.indexOf(chname.toLowerCase()) !== -1) {
          setchnameerror(true);
          return;
        }
      }
      setcreating(true);
      const channel = await createChannel(user, chname, server);
      if (channel !== null) {
        actions.setChannles([]);
        setcreating(false);
        successCallback();
      }
    }
  };

  const closePopup = () => {
    setchname("");
    // setchkeyerror(false);
    setchnameerror(false);
    setcreating(false);
    closeCreatepop();
  };

  const classes = useStyles();
  return (
    <Dialog
      open={openForm}
      TransitionComponent={Transition}
      keepMounted
      onClose={closePopup}
      aria-labelledby="create-channel-form"
      fullWidth
    >
      <DialogTitle id="create-channel-form-title">
        {"Create a new channel"}
      </DialogTitle>
      <DialogContent>
        <DialogContentText id="create-channel-form-title-description">
          <FormLabel component="legend">Choose server</FormLabel>
          <Button
            aria-controls="change-ownwer-menu"
            aria-haspopup="true"
            onClick={(event) => setAnchorEl(event.currentTarget)}
            disableElevation
            style={{ marginTop: "16px", marginBottom: "-16px" }}
          >
            {server}
            <DownArrowIcon />
          </Button>
          <Menu
            id="choose-server-menu"
            anchorEl={anchorEl}
            keepMounted
            open={Boolean(anchorEl)}
            onClose={() => setAnchorEl(null)}
          >
            {channelSet.map((servername) => (
              <MenuItem
                key={servername}
                onClick={() => {
                  serServer(servername);
                  setAnchorEl(null);
                }}
              >
                {servername}
              </MenuItem>
            ))}
          </Menu>
          <TextField
            className={classes.txtfield}
            fullWidth
            id="chkey"
            label="Channel name"
            value={chkey}
            disabled={creating}
            onChange={handleChKey}
          />
          {chnameerror && <p style={{ color: "red" }}>Name already exists.</p>}
          {/* <TextField
            className={classes.txtfield}
            fullWidth
            id="chname"
            label="Key"
            value={chname}
            disabled={creating}
            onChange={handleChName}
          />
          {chkeyerror && <p style={{ color: "red" }}>Key already exists.</p>} */}
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
            onClick={createNewChannel}
            variant="contained"
            color="primary"
            disableElevation
          >
            Create
          </Button>
        )}
      </DialogActions>
    </Dialog>
  );
};

export default CreateNewChannel;
