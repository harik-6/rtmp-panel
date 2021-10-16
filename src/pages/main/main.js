import React from "react";
import { Switch, Route, Redirect } from "react-router-dom";
import AppContext from "../../context/context";

// pages
import Home from "../home/home";
import Users from "../users/users";
import Login from "../login/login";
import Profile from "../profile/profile";
import Stat from "../stat/stat";

// components
import Appwrapper from "../../components/Appwrapper";
import Navigation from "./navigation";
import Activepage from "../../components/Activepage";
import Toast from "../../components/Toast";

const Main = () => {
  // store variable
  const { store } = React.useContext(AppContext);
  const {user,app} = store;

  console.log(user);

  if (user.token === null) return <Login />;

  return (
    <Appwrapper>
      <Navigation user={user} name={app.name} />
      <Activepage>
        <Toast />
        <Switch>
          <Route path="/home" component={Home} />
          <Route path="/profile" component={Profile} />
          <Route path="/stat" component={Stat} />
          {user.usertype !== "u" && <Route path="/users" component={Users} />}
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
