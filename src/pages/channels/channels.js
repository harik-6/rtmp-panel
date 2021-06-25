import React, { useContext, useState, useEffect } from "react";
import { Grid, Snackbar, Button, Menu, MenuItem } from "@material-ui/core";
import { ChannelTable, Insights } from "./channelcomponent";
import channelservice from "../../service/channel.service";
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

const Channels = () => {
  const classes = useStyles();
  const { user, channels, actions, healthList } = useContext(AppContext);
  const [chnl, setChannel] = useState(null);
  const [msg, setMsg] = useState("Loading channels...");
  const [healthStatus, setHealthStatus] = useState({});
  const [activeChannelCount, setActiveChannelCount] = useState(-1);
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

  const setActiveChanel = (channneeelll) => {
    setChannel(channneeelll);
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
      message: "Channel health recheked.",
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
    window.open(
      `${process.env.REACT_APP_APPURL}?page=play&channel=${chnllll.name}`
    );
  };
  const updateActiveCount = (hlthList) => {
    let count = 0;
    Object.keys(hlthList).forEach((key) => {
      if (hlthList[key]) {
        count += 1;
      }
    });
    setActiveChannelCount(count);
  };

  const checkHealth = async (channelslist) => {
    let healthArr = new Array(channelslist.length);
    for (let i = 0; i < channelslist.length; i++) {
      const health = await channelservice.checkChannelHealth(channelslist[i]);
      healthArr[channelslist[i].name] = health;
    }
    const arr = { ...healthArr };
    setHealthStatus(arr);
    updateActiveCount(arr);
    actions.setHealth(arr);
  };

  const changeRtmpStatus = async () => {
    setOpenStatusDialog(false);
    await channelservice.changeRtmpStatus(chnl);
    await channelservice.rebootServer(chnl);
    setMsg("Loading channels...");
    setLoading(true);
    setTimeout(() => loadChannels(), 2000);
  };

  const filterChannel_Admin = (ownerinfo) => {
    setAnchorEl(null);
    setActiveOwnerId(ownerinfo);
  };

  useEffect(() => {
    if (
      channels !== null &&
      channels.length > 0 &&
      (healthList === null || healthList === undefined)
    ) {
      checkHealth(channels);
    } else {
      if (Object.keys(healthList || []).length > 0) {
        setHealthStatus({ ...healthList });
        updateActiveCount(healthList);
      }
    }
    if (user !== null) {
      setAdmin(user["_id"] === process.env.REACT_APP_ADMINID);
    }
    //eslint-disable-next-line
  }, [channels]);

  if (loading) {
    return <Preloader message={msg} />;
  }

  let filtereddata = [];
  if (isAdmin) {
    filtereddata = channels === null
      ? []
      : channels.filter((ch) => ch.server === activeOwnerId) || [];
  } else {
    filtereddata = channels || [];
    
  }

  return (
    <div className={classes.channels}>
      {(channels || []).length <= 0 ? (
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
                onClick={recheckChannelHealth}
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
          <Insights
            channels={channels}
            activeChannelCount={activeChannelCount}
          />
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
            healthStatus={healthStatus}
            setActiveChanel={setActiveChanel}
            openActionDialog={openActionDialog}
            askConfirmation={askConfirmation}
            openPreview={openPreview}
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
        channel={chnl}
        user={user}
      />
      {chnl !== null && (
        <DeleteConfirmationDialog
          openForm={openDeleteConfirm}
          closeForm={() => setDeleteConfirm(false)}
          onDeleteYes={deleteChannel}
          channel={chnl}
        />
      )}
      {chnl !== null && (
        <RtmpStatusConfirmationDialog
          openForm={openStatusDialog}
          onYes={changeRtmpStatus}
          closeForm={() => setOpenStatusDialog(false)}
          status={chnl.status}
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
      {isAdmin && channels !== null && (
        <Menu
          id="switch-channel-admin-menu"
          anchorEl={anchorEl}
          keepMounted
          open={Boolean(anchorEl)}
          onClose={() => setAnchorEl(null)}
        >
          {[...new Set([...channels.map((ch) => ch.server)])].map(
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
