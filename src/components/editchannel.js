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
} from "@material-ui/core";
import Slide from "@material-ui/core/Slide";
import AppContext from "../context/context";
import channelservice from "../service/channel.service";

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

const EditChannel = ({
  openForm,
  closeForm,
  successCallback,
  channel
}) => {
  const { user, actions } = useContext(AppContext);
  const [chname, setchname] = useState(channel.name);
  const [chkey, setchkey] = useState(channel.key);
  const [creating, setcreating] = useState(false);
  const [chnameerror, setchnameerror] = useState(false);
  const [chkeyerror, setchkeyerror] = useState(false);

  const handleChName = (e) => {
    setchname(e.target.value);
  };

  const handleChKey = (e) => {
    setchkey(e.target.value);
  };

  const editChannel = async () => {
    if (chname.length > 0 && chkey.length > 0) {
      const alltokens = channelservice.getAllTokens();
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
      const editedchannel = await channelservice.editchannel({
        ...channel,
        name: chname.toLowerCase(),
        key: chkey.toLowerCase(),
      },user);
      if (editedchannel !== null) {
        actions.setChannles([]);
        successCallback();
        closeDialog();
      }
    }
  };

  const closeDialog = () => {
    setchnameerror(false);
    setchkeyerror(false);
    setcreating(false);
    setchname("");
    setchkey("");
    closeForm();
  }

  const classes = useStyles();
  return (
    <Dialog
      open={openForm}
      TransitionComponent={Transition}
      keepMounted
      onClose={closeDialog}
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
          {chnameerror && <p style={{ color: "red" }}>Name already exists.</p>}
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
  );
};

export default EditChannel;
