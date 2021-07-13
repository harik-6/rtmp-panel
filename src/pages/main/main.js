import React, { useState, useContext, useEffect } from "react";
import { Switch, Route, Redirect } from "react-router-dom";
import AppContext from "../../context/context";
import NavigationMenu from "./navigation";
import Usage from "../usage/usage";
import Player from "../player/player";
import Channels from "../channels/channels";
import useStyles from "./main.styles";
import Users from "../users/users";

const Main = () => {
  const classes = useStyles();
  const { user, settings, appName } = useContext(AppContext);
  const [isAdmin, setAdmin] = useState(false);

  useEffect(() => {
    if (user === null || settings === null) {
      setAdmin(false);
    } else {
      setAdmin(user["_id"] === process.env.REACT_APP_ADMINID);
    }
    // eslint-disable-next-line
  }, [user]);

  return (
    <div className={classes.appmain}>
      <div className={classes.sidenav}>
        <p className={classes.appname}>{appName}</p>
        <NavigationMenu isAdmin={isAdmin} />
      </div>
      <div className={classes.routes}>
        <Switch>
          <Route path="/player" component={Player} />
          <Route path="/channels" component={Channels} />
          {(settings || { usage: false }).usage && (
            <Route path="/usage" component={Usage} />
          )}
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
