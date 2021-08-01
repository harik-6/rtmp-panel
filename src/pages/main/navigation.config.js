import React from "react";
import HomeIcon from "@material-ui/icons/HomeRounded";
import ChannelIcon from "@material-ui/icons/VideocamRounded";
import UsersIcon from "@material-ui/icons/SupervisorAccount";
import LogoutIcon from "@material-ui/icons/ExitToApp";
import UsageIcon from "@material-ui/icons/DataUsage";
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
    name: "Usage",
    path: "/usage",
    tabIndex: 3,
    icon: <UsageIcon />,
  },
  // {
  //   name: "Profile",
  //   path: "/profile",
  //   tabIndex: 4,
  //   icon: <PersonIcon />,
  // },
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
    name: "Channels",
    path: "/channels",
    tabIndex: 2,
    icon: <ChannelIcon />,
  },
  {
    name: "Usage",
    path: "/usage",
    tabIndex: 3,
    icon: <UsageIcon />,
  },
  {
    name: "Users",
    path: "/users",
    tabIndex: 4,
    icon: <UsersIcon />,
  },
  // {
  //   name: "Profile",
  //   path: "/profile",
  //   tabIndex: 5,
  //   icon: <PersonIcon />,
  // },
  {
    name: "Logout",
    path: "/logout",
    tabIndex: -1,
    icon: <LogoutIcon />,
  },
];

export { userNavigations, adminNavigations };
