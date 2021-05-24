import React, { useState, useContext } from "react";
import { Switch, Route, Redirect, Link } from "react-router-dom";
import {
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  AppBar,
  Toolbar,
  IconButton,
  Avatar,
  Menu,
  MenuItem,
} from "@material-ui/core";
import HomeIcon from "@material-ui/icons/HomeRounded";
import ChannelIcon from "@material-ui/icons/VideocamRounded";
import UsersIcon from "@material-ui/icons/SupervisorAccount";
import RebootConfirmationDialog from "../../components/rebootconfirm";
import DownIcon from "@material-ui/icons/ExpandMoreRounded";
import Player from "../player/player";
import Channels from "../channels/channels";
import useStyles from "./main.styles";
import AppContext from "../../context/context";
import Users from "../users/users";
import channelservice from "../../service/channel.service";

const Main = () => {
  const classes = useStyles();
  const { user, actions, channels } = useContext(AppContext);
  const [activeTab, setActiveTab] = useState(1);
  const [rebootActiveChannel, setRebootActiveChannel] = useState(null);
  const [openRebootDialog, setOpenRebootDialog] = useState(false);

  const [anchorProfileEl, setProfileAnchorEl] = useState(null);

  const logoutUser = () => {
    actions.logout();
  };

  const changePage = (page) => {
    setActiveTab(page);
  };
  const openProfileMenu = (event) => {
    setProfileAnchorEl(event.currentTarget);
  };

  const closeProfieMenu = () => {
    setProfileAnchorEl(null);
  };
  const askRebootComfirmation = () => {
    closeProfieMenu();
    setOpenRebootDialog(true);
  };
  const rebootRtmp = async () => {
    if (channels !== null && channels.length > 0) {
      await channelservice.rebootServer(channels[0]);
    }
    logoutUser();
  };

  const isAdmin = user.userid === process.env.REACT_APP_ADMINID;

  return (
    <div className={classes.appmain}>
      <div className={classes.sidenav}>
        <p className={classes.appname}>{process.env.REACT_APP_NAME}</p>
        <List className={classes.navlist} aria-label="navigation-list">
          <Link to="/home">
            <ListItem
              className={classes.navbtn}
              disableGutters={true}
              onClick={() => changePage(1)}
              button
            >
              <ListItemIcon
                className={activeTab === 1 ? classes.iconactive : classes.icon}
              >
                <HomeIcon />
              </ListItemIcon>
              <ListItemText
                disableTypography={true}
                className={
                  activeTab === 1 ? classes.navtextactive : classes.navtext
                }
                primary="Home"
              />
            </ListItem>
          </Link>
          <Link to="/channels">
            <ListItem
              disableGutters={true}
              onClick={() => changePage(2)}
              button
            >
              <ListItemIcon
                className={activeTab === 2 ? classes.iconactive : classes.icon}
              >
                <ChannelIcon />
              </ListItemIcon>
              <ListItemText
                disableTypography={true}
                className={
                  activeTab === 2 ? classes.navtextactive : classes.navtext
                }
                primary="Channels"
              />
            </ListItem>
          </Link>
          {isAdmin && (
            <Link to="/users">
              <ListItem
                disableGutters={true}
                onClick={() => changePage(3)}
                button
              >
                <ListItemIcon
                  className={
                    activeTab === 3 ? classes.iconactive : classes.icon
                  }
                >
                  <UsersIcon />
                </ListItemIcon>
                <ListItemText
                  disableTypography={true}
                  className={
                    activeTab === 3 ? classes.navtextactive : classes.navtext
                  }
                  primary="Users"
                />
              </ListItem>
            </Link>
          )}
        </List>
      </div>
      <div className={classes.routes}>
        <AppBar
          className={classes.appbar}
          elevation={0}
          color="inherit"
          position="static"
        >
          <Toolbar>
            <div className={classes.grow} />
            <div>
              <IconButton
                style={{
                  marginTop: "-4px",
                }}
                onClick={openProfileMenu}
              >
                <Avatar className={classes.avatar}>
                  {(user.username || "S")[0].toUpperCase()}
                </Avatar>
                <DownIcon />
              </IconButton>
            </div>
          </Toolbar>
        </AppBar>
        <Switch>
          <Route path="/home" component={() => <Player />} />
          <Route path="/channels" component={Channels} />
          {isAdmin && <Route path="/users" component={Users} />}
          <Route path="" exact>
            {" "}
            <Redirect to="/home" />{" "}
          </Route>
        </Switch>
      </div>
      <Menu
        id="profile-avatar-menu"
        anchorEl={anchorProfileEl}
        keepMounted
        open={Boolean(anchorProfileEl)}
        onClose={closeProfieMenu}
        className={classes.profilemenu}
      >
        <MenuItem onClick={askRebootComfirmation}>Reboot</MenuItem>
        <MenuItem onClick={logoutUser}>Logout</MenuItem>
      </Menu>
      <RebootConfirmationDialog
        openForm={openRebootDialog}
        closeForm={() => setOpenRebootDialog(false)}
        onYes={rebootRtmp}
      />
    </div>
  );
};

export default Main;
