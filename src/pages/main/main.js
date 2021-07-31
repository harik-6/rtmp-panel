import React, { useContext } from "react";
import { Switch, Route, Redirect } from "react-router-dom";
import AppContext from "../../context/context";
import NavigationMenu from "./navigation";
import Usage from "../usage/usage";
import Player from "../player/player";
import Channels from "../channels/channels";
import useStyles from "./main.styles";
import Users from "../users/users";
import Login from "../login/login";

const Main = () => {
  const classes = useStyles();
  const { user, appName } = useContext(AppContext);

  if (user === null) return <Login />;

  return (
    <div className={classes.appmain}>
      <div className={classes.sidenav}>
        <p className={classes.appname}>{appName}</p>
        <NavigationMenu isAdmin={user.admin || false} />
      </div>
      <div className={classes.routes}>
        <Switch>
          <Route path="/player" component={Player} />
          <Route path="/channels" component={Channels} />
          {(user.usage || false) && <Route path="/usage" component={Usage} />}
          {(user.admin || false) && <Route path="/users" component={Users} />}
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
