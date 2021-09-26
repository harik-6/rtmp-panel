import React, { useContext, useState } from "react";
import { Switch, Route, Redirect, useLocation } from "react-router-dom";
import NavigationMenu from "./navigation";
import {
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  MenuItem,
} from "@material-ui/core";
import Avatar from "@material-ui/core/Avatar";
import AppContext from "../../context/context";
import Menu from "@material-ui/core/Menu";
import Player from "../player/player";
import Channels from "../channels/channels";
import useStyles from "./main.styles";
import Users from "../users/users";
import Login from "../login/login";
import Profile from "../profile/profile";
import Stat from "../stat/stat";
import RebootConfirmationDialog from "../../components/rebootconfirm";

const Main = () => {
  const classes = useStyles();
  const { user, appName, avatarApi, actions } =
    useContext(AppContext);
  const [openReboot, setOpenReboot] = useState(false);

  const logoutUser = () => {
    actions.logout();
  };

  const toggleReboot = (status) => {
    setOpenReboot(status);
  };

  if (user.token === null) return <Login />;

  return (
    <div className={classes.appmain}>
      <div className={classes.sidenav}>
        <p className={classes.appname}>{appName}</p>
        <NavigationMenu
          isAdmin={user.usertype !== "u"}
          logoutUser={logoutUser}
        />
      </div>
      <div style={{ display: "flex", flexDirection: "column", width: "100%" }}>
        <MenuAppBar
          user={user}
          avatarApi={avatarApi}
          logoutUser={logoutUser}
          rebootServer={toggleReboot}
        />
        <div className={classes.routes}>
          <Switch>
            <Route path="/player" component={Player} />
            <Route path="/channels" component={Channels} />
            <Route path="/profile" component={Profile} />
            {user.usertype !== "u" && <Route path="/users" component={Users} />}
            {user.usertype === "s" && <Route path="/stat" component={Stat} />}
            <Route path="" exact>
              {" "}
              <Redirect to="/player" />{" "}
            </Route>
          </Switch>
        </div>
        <RebootConfirmationDialog
          openForm={openReboot}
          closeForm={() => {
            toggleReboot(false);
          }}
        />
      </div>
    </div>
  );
};

function MenuAppBar({ user, avatarApi, logoutUser, rebootServer }) {
  const classes = useStyles();
  const [anchorEl, setAnchorEl] = useState(null);
  const location = useLocation();
  const open = Boolean(anchorEl);
  const avatarUrl = `${avatarApi}/${user.username}.svg?backgroundColors[]=indigo`;

  const handleMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <div className={classes.appbarroot}>
      <AppBar
        elevation={0}
        position="static"
        style={{ backgroundColor: "#ffffff" }}
      >
        <Toolbar>
          <Typography variant="h6" className={classes.appbartitle}>
            {location.pathname.split("/")[1]}
          </Typography>
          <div>
            <IconButton
              aria-label="account of current user"
              aria-controls="appbar-menu"
              aria-haspopup="true"
              onClick={handleMenu}
            >
              <Avatar src={avatarUrl} className={classes.appbaravatar} />
            </IconButton>
            <Menu
              style={{
                marginTop: "16px",
                marginLeft: "-16px",
                borderRadius: "8px",
              }}
              id="appbar-menu"
              anchorEl={anchorEl}
              keepMounted
              open={open}
              onClose={handleClose}
            >
              <MenuItem
                style={{ textTransform: "capitalize" }}
                onClick={handleClose}
              >
                {user.username}
              </MenuItem>
              {/* <Link
                to={`${process.env.PUBLIC_URL}/profile`}
                style={{ color: "#000000" }}
              >
                {" "}
                <MenuItem onClick={handleClose}>My Account</MenuItem>
              </Link> */}
              {user.usertype !== "u" && (
                <MenuItem
                  onClick={() => {
                    handleClose();
                    rebootServer(true);
                  }}
                >
                  Reboot
                </MenuItem>
              )}
              <MenuItem onClick={logoutUser}>Logout</MenuItem>
            </Menu>
          </div>
        </Toolbar>
      </AppBar>
    </div>
  );
}

export default Main;
