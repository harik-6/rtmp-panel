import React, { useState, useContext, useEffect } from "react";
import { Switch, Route, Redirect, Link } from "react-router-dom";
import { useHistory } from "react-router-dom";
import { List, ListItem, ListItemText, ListItemIcon } from "@material-ui/core";
import HomeIcon from "@material-ui/icons/HomeRounded";
import ChannelIcon from "@material-ui/icons/VideocamRounded";
import UsersIcon from "@material-ui/icons/SupervisorAccount";
import LogoutIcon from "@material-ui/icons/ExitToApp";
import UsageIcon from "@material-ui/icons/DataUsage";
import Usage from "../usage/usage";
import Player from "../player/player";
import Channels from "../channels/channels";
import useStyles from "./main.styles";
import AppContext from "../../context/context";
import Users from "../users/users";

const Main = () => {
  const classes = useStyles();
  const history = useHistory();
  const { user, actions, settings } = useContext(AppContext);
  const [activeTab, setActiveTab] = useState(1);
  const [isAdmin, setAdmin] = useState(false);

  const changePage = (page) => {
    setActiveTab(page);
  };

  const logoutUser = () => {
    actions.logout();
  };

  useEffect(() => {
    if (user === null) {
      history.replace("/login");
    } else {
      setAdmin(user.userid === process.env.REACT_APP_ADMINID);
    }
    // eslint-disable-next-line
  }, [user]);

  return (
    <div className={classes.appmain}>
      <div className={classes.sidenav}>
        <p className={classes.appname}>{process.env.REACT_APP_NAME}</p>
        <List className={classes.navlist} aria-label="navigation-list">
          <Link to="/player">
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
          {settings.usage && (
            <Link to="/usage">
              <ListItem
                className={classes.navbtn}
                disableGutters={true}
                onClick={() => changePage(3)}
                button
              >
                <ListItemIcon
                  className={
                    activeTab === 3 ? classes.iconactive : classes.icon
                  }
                >
                  <UsageIcon />
                </ListItemIcon>
                <ListItemText
                  disableTypography={true}
                  className={
                    activeTab === 3 ? classes.navtextactive : classes.navtext
                  }
                  primary="Usage"
                />
              </ListItem>
            </Link>
          )}
          {isAdmin && (
            <Link to="/users">
              <ListItem
                disableGutters={true}
                onClick={() => changePage(4)}
                button
              >
                <ListItemIcon
                  className={
                    activeTab === 4 ? classes.iconactive : classes.icon
                  }
                >
                  <UsersIcon />
                </ListItemIcon>
                <ListItemText
                  disableTypography={true}
                  className={
                    activeTab === 4 ? classes.navtextactive : classes.navtext
                  }
                  primary="Users"
                />
              </ListItem>
            </Link>
          )}
          <ListItem disableGutters={true} onClick={logoutUser} button>
            <ListItemIcon className={classes.icon}>
              <LogoutIcon />
            </ListItemIcon>
            <ListItemText
              disableTypography={true}
              className={classes.navtext}
              primary="Logout"
            />
          </ListItem>
        </List>
      </div>
      <div className={classes.routes}>
        <Switch>
          <Route path="/player" component={Player} />
          <Route path="/channels" component={Channels} />
          {settings.usage && <Route path="/usage" component={Usage} />}
          {isAdmin && <Route path="/users" component={Users} />}
          <Route path="" exact>
            {" "}
            <Redirect to="/player" />{" "}
          </Route>
        </Switch>
      </div>
    </div>
  );
};

export default Main;
