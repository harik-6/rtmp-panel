import React, { useEffect, useState } from "react";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import "./App.scss";
import AppState from "./context/state";
// Pages
import Main from "./pages/main/main";
import Login from "./pages/login/login";
import Preview from "./pages/preview";
import Landing from "./pages/landing/landing";

const Apppanel = () => {
  return (
    <AppState>
      <Router>
        <Switch>
          <Route exact path="/play/:channel" component={Preview} />
          <Route exact path="/login" component={Login} />
          <Route path="" component={Main} />
        </Switch>
      </Router>
    </AppState>
  );
};

const Appmarketing = () => {
  return <Landing />;
};

const App = () => {
  const [panel, setPanel] = useState("blank");
  useEffect(() => {
    const location = window.location.href;
    const appurl = process.env.REACT_APP_APPURL;
    console.log(location, appurl);
    if (location === appurl || location === appurl + "/") {
      setPanel("marketing");
    } else {
      setPanel("panel");
    }
  }, []);
  if (panel === "blank") return <div className="app-main-blank"></div>;
  return (
    <div className="app-main">
      {panel === "panel" ? <Apppanel /> : <Appmarketing />}
    </div>
  );
};

export default App;
