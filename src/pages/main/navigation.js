import React, { useState, useContext, useEffect } from "react";
import { Link } from "react-router-dom";
import { useHistory } from "react-router-dom";
import { List, ListItem, ListItemText, ListItemIcon } from "@material-ui/core";
import useStyles from "./main.styles";
import AppContext from "../../context/context";
import BottomNavigation from "@material-ui/core/BottomNavigation";
import BottomNavigationAction from "@material-ui/core/BottomNavigationAction";
import { userNavigations, adminNavigations } from "./navigation.config";

const NavigationMenu = ({ isAdmin }) => {
  const classes = useStyles();
  const history = useHistory();
  const { user, actions, settings } = useContext(AppContext);
  const [activeTab, setActiveTab] = useState(1);

  const changePage = (page) => {
    if (page === -1) {
      logoutUser();
    } else {
      setActiveTab(page);
    }
  };

  const logoutUser = () => {
    actions.logout();
  };

  useEffect(() => {
    if (user === null || settings === null) {
      history.replace("/login");
    }
    // eslint-disable-next-line
  }, [user, isAdmin]);

  let navigations = isAdmin ? adminNavigations : userNavigations;
  const isUsageAvail = (settings || { usage: false }).usage;
  if (!isUsageAvail) {
    navigations = navigations.filter((nav) => nav.name !== "Usage");
  }

  return (
    <>
      <BottomNavigation
        value={activeTab}
        showLabels
        className={classes.bottomnav}
      >
        {navigations.map((nav) => (
          <Link to={nav.path}>
            <BottomNavigationAction
              onClick={() => changePage(nav.tabIndex)}
              label={nav.name}
              value={nav.tabIndex}
              icon={nav.icon}
              className={
                activeTab === nav.tabIndex ? classes.bottomnavItemActive : ""
              }
            />
          </Link>
        ))}
      </BottomNavigation>
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
