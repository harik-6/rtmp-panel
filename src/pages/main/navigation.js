import React, { useState, useContext, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { useHistory } from "react-router-dom";
import { List, ListItem, ListItemText, ListItemIcon } from "@material-ui/core";
import useStyles from "./main.styles";
import AppContext from "../../context/context";
import { userNavigations, adminNavigations } from "./navigation.config";

const NavigationMenu = ({ isAdmin, logoutUser }) => {
  const classes = useStyles();
  const history = useHistory();
  const location = useLocation();
  const { user, settings } = useContext(AppContext);
  const [activeTab, setActiveTab] = useState(1);

  const changePage = (page) => {
    if (page === -1) {
      logoutUser();
    } else {
      setActiveTab(page);
    }
  };

  const changeActiveTab = () => {
    if (location.pathname === "/profile") {
      changePage(isAdmin ? 5 : 4);
      return;
    }
    if(location.pathname.includes("player")) {
      changePage(1);
    }
  };

  useEffect(() => {
    if (user.token === null) {
      history.replace("/login");
    }
    changeActiveTab();
    // eslint-disable-next-line
  }, [user, isAdmin, location]);

  let navigations = isAdmin ? adminNavigations : userNavigations;

  return (
    <>
      <List className={classes.navlist} aria-label="navigation-list">
        {navigations.map((nav) => (
          <Link to={nav.path}>
            <ListItem
              disableGutters={true}
              onClick={() => changePage(nav.tabIndex)}
              button
              className={classes.mobilenav}
            >
              <ListItemIcon
                className={
                  activeTab === nav.tabIndex ? classes.iconactive : classes.icon
                }
              >
                {nav.icon}
              </ListItemIcon>
              <ListItemText
                disableTypography={true}
                className={
                  activeTab === nav.tabIndex
                    ? classes.navtextactive
                    : classes.navtext
                }
                primary={nav.name}
              />
            </ListItem>
          </Link>
        ))}
      </List>
    </>
  );
};

export default NavigationMenu;
