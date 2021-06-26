import React, { useEffect, useState } from "react";
import "./App.scss";
import Main from "./pages/main/main";
import Login from "./pages/login/login";
import AppState from "./context/state";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import Preview from "./pages/preview";

function App() {
  const [prev, setPreview] = useState(false);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const url = window.location.href;
    if (url.includes("play")) {
      setPreview(true);
    }
    setLoading(false);
  }, []);
  if (loading) return <></>;
  return prev ? (
    <Preview />
  ) : (
    <AppState>
      <Auth />
    </AppState>
  );
}

const Auth = () => {
  return (
    <div className="app-main">
      <Router>
        <Switch>
          <Route exact path="/play" component={Preview} />
          <Route exact path="/login" component={Login} />
          <Route path="" component={Main} />
        </Switch>
      </Router>
    </div>
  );
};

export default App;
