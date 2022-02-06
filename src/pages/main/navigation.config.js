import React from "react";
import HomeIcon from "@mui/icons-material/HomeOutlined";
import StatIcon from "@mui/icons-material/ShowChartOutlined";
import UsersIcon from "@mui/icons-material/PeopleAltOutlined";
import LogoutIcon from "@mui/icons-material/LogoutOutlined";
import ProfileIcon from "@mui/icons-material/AccountCircleOutlined";
import ServerIcon from "@mui/icons-material/Dns";

const navIndex = {
  "/home": 1,
  "/stat": 2,
  "/users": 3,
  "/profile": 4,
  "/servers": 5,
  "/logout": -1,
};

const userNavigations = [
  {
    name: "Home",
    path: "/home",
    tabIndex: 1,
    icon: <HomeIcon />,
  },
  {
    name: "Statistics",
    path: "/stat",
    tabIndex: 2,
    icon: <StatIcon />,
  },
  {
    name: "Servers",
    path: "/servers",
    tabIndex: 5,
    icon: <ServerIcon />,
  },
  {
    name: "Profile",
    path: "/profile",
    tabIndex: 4,
    icon: <ProfileIcon />,
  },
  {
    name: "",
    path: "/logout",
    tabIndex: -1,
    icon: <LogoutIcon />,
  },
];

const adminNavigations = [
  {
    name: "Home",
    path: "/home",
    tabIndex: 1,
    icon: <HomeIcon />,
  },
  {
    name: "Statistics",
    path: "/stat",
    tabIndex: 2,
    icon: <StatIcon />,
  },
  {
    name: "Servers",
    path: "/servers",
    tabIndex: 5,
    icon: <ServerIcon />,
  },
  {
    name: "Users",
    path: "/users",
    tabIndex: 3,
    icon: <UsersIcon />,
  },
  {
    name: "Profile",
    path: "/profile",
    tabIndex: 4,
    icon: <ProfileIcon />,
  },
  {
    name: "",
    path: "/logout",
    tabIndex: -1,
    icon: <LogoutIcon />,
  },
];

const superadminNavigations = [
  {
    name: "Home",
    path: "/home",
    tabIndex: 1,
    icon: <HomeIcon />,
  },
  {
    name: "Statistics",
    path: "/stat",
    tabIndex: 2,
    icon: <StatIcon />,
  },
  {
    name: "Servers",
    path: "/servers",
    tabIndex: 5,
    icon: <ServerIcon />,
  },
  {
    name: "Users",
    path: "/users",
    tabIndex: 3,
    icon: <UsersIcon />,
  },
  {
    name: "Profile",
    path: "/profile",
    tabIndex: 4,
    icon: <ProfileIcon />,
  },
  {
    name: "",
    path: "/logout",
    tabIndex: -1,
    icon: <LogoutIcon />,
  },
];

const getNavigationComponent = (usertype) => {
  if (usertype === "u") return userNavigations;
  if (usertype === "a") return adminNavigations;
  return superadminNavigations;
};

export { navIndex };
export default getNavigationComponent;
