import React from "react";
import "./App.scss";
import Main from "./pages/main/main";
import Login from "./pages/login/login";
import AppState from "./context/state";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import Preview from "./pages/preview";

const App = () => {
  return (
    <AppState>
      <div className="app-main">
        <Router>
          <Switch>
            <Route exact path="/play/:channel" component={Preview} />
            <Route exact path="/login" component={Login} />
            <Route path="" component={Main} />
          </Switch>
        </Router>
      </div>
    </AppState>
  );
};

export default App;
