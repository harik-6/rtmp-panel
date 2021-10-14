import React, { useContext, useState } from "react";
import { Switch, Route, Redirect, useLocation } from "react-router-dom";
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
import useStyles from "./main.styles";
import Users from "../users/users";
import Login from "../login/login";
import Profile from "../profile/profile";
import Stat from "../stat/stat";
import Appwrapper from "../../components/Appwrapper";
import Navigation from "./navigation";
import Activepage from "../../components/Activepage";

const Main = () => {
  
  return (
    <Appwrapper>
      <Navigation />
      <Activepage>
        <Switch>
          <Route path="/home" component={Player} />
          <Route path="/profile" component={Profile} />
          <Route path="/stat" component={Stat} />
          <Route path="/users" component={Users} />
          <Route path="" exact>
            {" "}
            <Redirect to="/home" />{" "}
          </Route>
        </Switch>
      </Activepage>
    </Appwrapper>
  );
};

export default Main;
