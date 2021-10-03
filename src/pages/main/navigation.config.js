import React from "react";
import HomeIcon from "@material-ui/icons/HomeRounded";
import ChannelIcon from "@material-ui/icons/VideocamRounded";
import UsersIcon from "@material-ui/icons/SupervisorAccount";
import LogoutIcon from "@material-ui/icons/ExitToApp";
import StatIcon from "@material-ui/icons/Assessment";
// import PersonIcon from "@material-ui/icons/Person";

const userNavigations = [
  {
    name: "Home",
    path: "/player",
    tabIndex: 1,
    icon: <HomeIcon />,
  },
  {
    name: "Channels",
    path: "/channels",
    tabIndex: 2,
    icon: <ChannelIcon />,
  },
  {
    name: "Logout",
    path: "/logout",
    tabIndex: -1,
    icon: <LogoutIcon />,
  },
];

const adminNavigations = [
  {
    name: "Home",
    path: "/player",
    tabIndex: 1,
    icon: <HomeIcon />,
  },
  {
    name: "Stat",
    path: "/stat",
    tabIndex: 5,
    icon: <StatIcon />,
  },
  {
    name: "Channels",
    path: "/channels",
    tabIndex: 2,
    icon: <ChannelIcon />,
  },
  {
    name: "Users",
    path: "/users",
    tabIndex: 4,
    icon: <UsersIcon />,
  },
  {
    name: "Logout",
    path: "/logout",
    tabIndex: -1,
    icon: <LogoutIcon />,
  },
];

const getNavigationComponent = (usertype) => {
  if (usertype === "u") return userNavigations;
  return adminNavigations;
};

export default getNavigationComponent;
