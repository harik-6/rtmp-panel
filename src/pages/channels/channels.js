import React, { useContext, useState, useEffect } from "react";
import { Grid, Snackbar, Button, Menu, MenuItem } from "@material-ui/core";
import { ChannelTable, Insights } from "./channelcomponent";
import AppContext from "../../context/context";
import CreateNewChannel from "../../components/createchannel";
import DeleteConfirmationDialog from "../../components/deletechannel";
import useStyles from "./channels.styles";
import EditChannel from "../../components/editchannel/index";
import RtmpStatusConfirmationDialog from "../../components/rtmpstatusconfirm";
import DownArrowIcon from "@material-ui/icons/ExpandMoreRounded";
import Preloader from "../../components/preloader";
import Nodataloader from "../../components/nodataloader";
import FabAddButton from "../../components/fabaddbutton";
import { getChannels, deleteChannel } from "../../service/channel.service";
import {
  rebootServer,
  checkChannelHealth,
  changeRtmpStatus,
  getRtmpCount,
} from "../../service/rtmp.service";

const Channels = () => {
  const classes = useStyles();
  const { user, settings } = useContext(AppContext);
  const [channelList, setChannelList] = useState([]);
  const [activeChannel, setActiveChannel] = useState(null);
  const [healthMap, setHealthMap] = useState({});
  const [viewMap, setViewMap] = useState({});
  const [healthCount, setHealthCount] = useState(-1);
  const [msg, setMsg] = useState("Loading channels...");
  const [isAdmin, setAdmin] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const [activeOwnerId, setActiveOwnerId] = useState(
    process.env.REACT_APP_ADMINSERVER
  );
  // loaders and errors
  const [loading, setLoading] = useState(false);
  const [action, setAction] = useState(null);
  const [openDeleteConfirm, setDeleteConfirm] = useState(false);
  const [snack, setSnack] = useState({ open: false, message: "" });
  const [openStatusDialog, setOpenStatusDialog] = useState(false);

  const loadChannels = async () => {
    setMsg("Loading channels...");
    setLoading(true);
    const chs = (await getChannels(user)) || [];
    setChannelList(chs);
    if (chs.length === 0) {
      setActiveChannel(null);
    }
    setLoading(false);
    _checkHealthStatus(chs);
    _countTotalRtmp(chs);
  };

  const _checkHealthStatus = async (allchannels = [], recheck = false) => {
    setHealthCount(-1);
    const hmap = await checkChannelHealth(allchannels, recheck);
    setHealthMap(hmap);
    setHealthCount(
      allchannels.filter((channel) => hmap[channel.name] === true).length
    );
    setSnack({
      open: true,
      message: "Channel Health Rechecked.",
    });
  };

  const _countTotalRtmp = async (allchannels = []) => {
    const channelnames = allchannels.map((ch) => ch.name);
    const countmap = await getRtmpCount(channelnames);
    setViewMap(countmap);
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
    if (settings.limit === channelList.length) {
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
    setActiveChannel(null);
    setAction(null);
  };

  const askConfirmation = () => {
    setDeleteConfirm(true);
  };

  const _deleteChannel = async () => {
    setDeleteConfirm(false);
    setMsg("Deleting channel " + activeChannel.name);
    setLoading(true);
    await deleteChannel(activeChannel);
    setSnack({
      open: true,
      message: "Channel successfully deleted.",
    });
    loadChannels();
  };

  const _changeRtmpStatus = async () => {
    setOpenStatusDialog(false);
    await changeRtmpStatus(activeChannel);
    await rebootServer(activeChannel);
    setMsg("Loading channels...");
    setLoading(true);
    setTimeout(() => loadChannels(), 2000);
  };

  const filterChannel_Admin = (ownerinfo) => {
    setAnchorEl(null);
    setActiveOwnerId(ownerinfo);
  };

  useEffect(() => {
    loadChannels();
    if (user !== null) {
      setAdmin(user["_id"] === process.env.REACT_APP_ADMINID);
    }
    //eslint-disable-next-line
  }, []);

  if (loading) {
    return <Preloader message={msg} />;
  }

  let filtereddata = [];
  if (isAdmin) {
    filtereddata =
      channelList.filter((ch) => ch.server === activeOwnerId) || [];
  } else {
    filtereddata = channelList || [];
  }
  // filtereddata.sort((a, b) => a.name.localeCompare(b.name));

  return (
    <div className={classes.channels}>
      {channelList.length <= 0 ? (
        <Nodataloader message="You don't have any channel.Create one" />
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
                onClick={() => _checkHealthStatus(channelList, true)}
                variant="contained"
                color="primary"
              >
                Health check
              </Button>
            </Grid>
            {/* <Grid item lg={2}>
              <Button
                // onClick={recheckChannelHealth}
                variant="contained"
                color="primary"
              >
                Backup channels
              </Button>
            </Grid> */}
          </Grid>
          <Insights channels={channelList} activeChannelCount={healthCount} />
          {isAdmin && (
            <Grid container justify="flex-end">
              <Grid sm={12} xs={12} lg={3}>
                <Button
                  aria-controls="change-ownwer-menu"
                  aria-haspopup="true"
                  onClick={(event) => setAnchorEl(event.currentTarget)}
                  disableElevation
                  style={{ marginTop: "16px", marginBottom: "-16px" }}
                >
                  {activeOwnerId}
                  <DownArrowIcon />
                </Button>
              </Grid>
            </Grid>
          )}
          <ChannelTable
            spliceddata={filtereddata}
            healthStatus={healthMap}
            viewCount={viewMap}
            setActiveChanel={setActiveChannel}
            openActionDialog={openActionDialog}
            askConfirmation={askConfirmation}
            setOpenStatusDialog={setOpenStatusDialog}
          />
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
      <EditChannel
        openForm={action === "edit"}
        closeForm={closeActionDialog}
        successCallback={() => {
          closeActionDialog();
          loadChannels();
        }}
        channel={activeChannel}
        user={user}
      />
      {activeChannel !== null && (
        <DeleteConfirmationDialog
          openForm={openDeleteConfirm}
          closeForm={() => setDeleteConfirm(false)}
          onDeleteYes={_deleteChannel}
          channel={activeChannel}
        />
      )}
      {activeChannel !== null && (
        <RtmpStatusConfirmationDialog
          openForm={openStatusDialog}
          onYes={_changeRtmpStatus}
          closeForm={() => setOpenStatusDialog(false)}
          status={activeChannel.status}
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
      <FabAddButton onClickAction={openCreateChannelForm} />
      {isAdmin && channelList.length > 0 && (
        <Menu
          id="switch-channel-admin-menu"
          anchorEl={anchorEl}
          keepMounted
          open={Boolean(anchorEl)}
          onClose={() => setAnchorEl(null)}
        >
          {[...new Set([...channelList.map((ch) => ch.server)])].map(
            (servername) => (
              <MenuItem
                key={servername}
                onClick={() => filterChannel_Admin(servername)}
              >
                {servername}
              </MenuItem>
            )
          )}
        </Menu>
      )}
    </div>
  );
};

export default Channels;
