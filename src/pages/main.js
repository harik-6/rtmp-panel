import React, { useState } from "react";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Redirect,
  Link,
} from "react-router-dom";
import { makeStyles, createStyles } from "@material-ui/core/styles";
import { List, ListItem, ListItemText, ListItemIcon } from "@material-ui/core";
import HomeIcon from "@material-ui/icons/HomeRounded";
import ChannelIcon from "@material-ui/icons/VideocamRounded";
import Home from "./home";
import Channels from "./channels";

const useStyles = makeStyles((theme) =>
  createStyles({
    appmain: {
      height: "100%",
      width: "100%",
      display: "flex",
      flexDirection: "row",
    },
    sidenav: {
      width: "200px",
      height: "100%",
      backgroundColor: "#121858",
    },
    routes: {
      flex: 1,
    },
    navlist: {
      marginTop: theme.spacing(3),
    },
    navtextactive: {
      color: "#FFFFFF",
      fontSize: "18px",
      opacity: "1",
    },
    navtext: {
      color: "#FFFFFF",
      fontSize: "18px",
      opacity: "0.3",
    },
    iconactive: {
      color: "#FFFFFF",
      minWidth: "24px",
      marginRight: "8px",
      marginLeft: "8px",
      opacity: "1",
    },
    icon: {
      color: "#FFFFFF",
      minWidth: "24px",
      opacity: "0.3",
      marginRight: "8px",
      marginLeft: "8px",
    },
    navbtn: {
      marginBottom: "8px",
    },
  })
);

const Main = () => {
  const classes = useStyles();
  const [activeTab, setActiveTab] = useState(1);
  const changePage = (page) => {
    setActiveTab(page);
  };
  return (
    <div className={classes.appmain}>
      <Router>
        <div className={classes.sidenav}>
          <List className={classes.navlist} aria-label="navigation-list">
            <Link to="/home">
              <ListItem
                className={classes.navbtn}
                disableGutters={true}
                onClick={() => changePage(1)}
                button
              >
                <ListItemIcon
                  className={
                    activeTab === 1 ? classes.iconactive : classes.icon
                  }
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
                  className={
                    activeTab === 2 ? classes.iconactive : classes.icon
                  }
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
          </List>
        </div>
        <div className={classes.routes}>
          <Switch>
            <Route path="/home" component={Home} />
            <Route path="/channles" component={Channels} />
            <Route path="" exact>
              {" "}
              <Redirect to="/channles" />{" "}
            </Route>
          </Switch>
        </div>
      </Router>
    </div>
  );
};

export default Main;
