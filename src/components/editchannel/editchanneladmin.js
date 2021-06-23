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
import AppContext from "../../context/context";
import channelservice from "../../service/channel.service";

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

const EditChannelAdmin = ({
  openForm,
  closeForm,
  successCallback,
  channel,
}) => {
  const { actions } = useContext(AppContext);
  const [chnl, setChnl] = useState(channel);
  const [chnameerror, setchnameerror] = useState(false);
  const [creating, setcreating] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setChnl({
      ...chnl,
      [name]: value,
    });
  };

  const editChannel = async () => {
    if (chnl.name.length > 0) {
      const alltokens = channelservice.getAllTokens();
      if (alltokens.length > 0) {
        if (alltokens.indexOf(chnl.name.toLowerCase()) !== -1) {
          setchnameerror(true);
          return;
        }
        // if (alltokens.indexOf(chkey.toLowerCase()) !== -1) {
        //   setchkeyerror(true);
        //   return;
        // }
      }
      setcreating(true);
      const toedit = {
        ...chnl,
        key: chnl.name,
      };
      const editedchannel = await channelservice.editchannelAdmin(toedit);
      if (editedchannel !== null) {
        actions.setChannles([]);
        successCallback();
        closeDialog();
      }
    }
  };

  const closeDialog = () => {
    setchnameerror(false);
    setcreating(false);
    closeForm();
  };

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
      <DialogTitle id="create-channel-form-title">{"Edit channel"}</DialogTitle>
      <DialogContent>
        <DialogContentText id="create-channel-form-title-description">
          <TextField
            className={classes.txtfield}
            fullWidth
            id="name"
            name="name"
            label="Name"
            value={chnl.name}
            disabled={creating}
            onChange={handleChange}
          />
          {chnameerror && <p style={{ color: "red" }}>Name already exists.</p>}
          <TextField
            className={classes.txtfield}
            fullWidth
            id="server"
            name="server"
            label="Server"
            value={chnl.server}
            disabled={creating}
            onChange={handleChange}
          />
          <TextField
            className={classes.txtfield}
            fullWidth
            id="displayStreamLink"
            name="displayStreamLink"
            label="Stream url"
            value={chnl.displayStreamLink}
            disabled={creating}
            onChange={handleChange}
          />
          <TextField
            className={classes.txtfield}
            fullWidth
            id="rtmpLink"
            name="rtmpLink"
            label="Rtmp play url"
            value={chnl.rtmpLink}
            disabled={creating}
            onChange={handleChange}
          />
          <TextField
            className={classes.txtfield}
            fullWidth
            id="httpLink"
            name="httpLink"
            label="Hls play url"
            value={chnl.httpLink}
            disabled={creating}
            onChange={handleChange}
          />
          <TextField
            className={classes.txtfield}
            fullWidth
            id="token"
            name="token"
            label="Token"
            value={chnl.token}
            disabled={creating}
            onChange={handleChange}
          />
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

export default EditChannelAdmin;
