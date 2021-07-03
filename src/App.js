import React from "react";
import "./App.scss";
import Main from "./pages/main/main";
import AppState from "./context/state";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import Preview from "./pages/preview";
import Landing from "./pages/landing/landing";

const App = () => {
  return (
    <AppState>
      <div className="app-main">
        <Router>
          <Switch>
            <Route exact path="/play/:channel" component={Preview} />
            <Route exact path="/home" component={Landing} />
            <Route path="" component={Main} />
          </Switch>
        </Router>
      </div>
    </AppState>
  );
};

export default App;
