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
import { getAllTokens, editchannelAdmin } from "../service/channel.service";

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
  const { actions,user } = useContext(AppContext);
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
      const alltokens = getAllTokens();
      if (alltokens.length > 0) {
        if (alltokens.indexOf(chnl.name.toLowerCase()) !== -1) {
          setchnameerror(true);
          return;
        }
      }
      setcreating(true);
      const toedit = {
        ...chnl,
        key: chnl.name,
      };
      const editedchannel = await editchannelAdmin(toedit,user);
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
            id="stream"
            name="stream"
            label="Stream url"
            value={chnl.stream}
            disabled={creating}
            onChange={handleChange}
          />
          <TextField
            className={classes.txtfield}
            fullWidth
            id="rtmp"
            name="rtmp"
            label="Rtmp play url"
            value={chnl.rtmp}
            disabled={creating}
            onChange={handleChange}
          />
          <TextField
            className={classes.txtfield}
            fullWidth
            id="hls"
            name="hls"
            label="Hls play url"
            value={chnl.hls}
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
          <TextField
            className={classes.txtfield}
            fullWidth
            id="preview"
            name="preview"
            label="Preview play url"
            value={chnl.preview}
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
