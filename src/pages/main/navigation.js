import React from "react";
import { Link, useLocation } from "react-router-dom";
import { useHistory } from "react-router-dom";
import styled from "styled-components";

// components
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";

// service
import getNavigationComponent from "./navigation.config";
import Constants from "../../constants";
import Devices from "../../Devices";

const Navlink = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  margin: 0 16px;
  font-size: 16px;
  font-weight: ${(props) => (props.active ? "bold" : "normal")};
  opacity: ${(props) => (props.active ? 1 : 0.3)};
  color: ${(props) => (props.active ? Constants.primary_color : "inherit")};
`;

const Navtext = styled.p`
  margin: 0 4px;
`;

const NavDiv = styled.div`
  margin-left: auto;
  display: flex;
  flex-direction: row;
  align-items: center;
  //responsive
  @media ${Devices.tablet} {
    overflow-x: scroll;
  }
`;

const Navigation = ({ user, name }) => {
  const location = useLocation();
  const history = useHistory();
  const navigations = getNavigationComponent(user.usertype);

  // state
  const [activeTab, setActiveTab] = React.useState(1);

  const _changeActiveTab = () => {
    const path = location.pathname;
    switch (path) {
      case "/home":
        setActiveTab(1);
        break;
      case "/stat":
        setActiveTab(2);
        break;
      case "/users":
        setActiveTab(3);
        break;
      case "/profile":
        setActiveTab(4);
        break;
      case "/logout":
        setActiveTab(-1);
        break;
      default:
        break;
    }
    return;
  };

  React.useEffect(() => {
    if (user.token === null) {
      history.replace("/login");
    }
    _changeActiveTab();
    // eslint-disable-next-line
  }, [user, location]);

  return (
    <AppBar
      position="static"
      color="transparent"
      sx={{ marginLeft: "auto", height: "58px", backgroundColor: "#ffffff" }}
      elevation={0}
    >
      <Toolbar sx={{ flexGrow: 1, height: "58px" }}>
        <Navlink active>
          <Navtext>{name}</Navtext>
        </Navlink>
        <NavDiv>
          {navigations.map((nav) => (
            <Link to={nav.path}>
              <Navlink active={activeTab === nav.tabIndex}>
                {nav.icon}
                <Navtext>{nav.name}</Navtext>
              </Navlink>
            </Link>
          ))}
        </NavDiv>
      </Toolbar>
    </AppBar>
  );
};

export default Navigation;
