import React, { useEffect, useState } from "react";
import { QueryClientProvider, QueryClient } from "react-query";
import { createTheme } from "@mui/material/styles";
import { ThemeProvider } from "@mui/material/styles";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import "./App.scss";
import AppState from "./context/state";
// Pages
import Main from "./pages/main/main";
import Login from "./pages/login/login";
import Preview from "./pages/preview";
import Landing from "./pages/landing/landing";
import MaintanencePage from "./pages/maintainance";
const maintanence = false;

const theme = createTheme({
  palette: {
    primary: {
      main: "#050f66",
    },
    secondary: {
      main: "#ff6551",
    },
  },
});

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      cacheTime: Infinity,
      staleTime: Infinity,
      refetchOnMount: false,
    },
  },
});

const Apppanel = () => {
  if (maintanence) {
    return <MaintanencePage />;
  } else {
    return (
      <QueryClientProvider client={queryClient}>
        <AppState>
          <Router>
            <Switch>
              <Route exact path="/play/:channel" component={Preview} />
              <Route exact path="/login" component={Login} />
              {/* <Route exact path="/logout">
              <Redirect to="/login" />{" "}
            </Route> */}
              <Route path="" component={Main} />
            </Switch>
          </Router>
        </AppState>
      </QueryClientProvider>
    );
  }
};

const Appmarketing = () => {
  return <Landing />;
};

const App = () => {
  const [panel, setPanel] = useState("blank");
  useEffect(() => {
    const location = window.location.href;
    const appurl = process.env.REACT_APP_APPURL;
    if (location === appurl || location === appurl + "/") {
      setPanel("marketing");
    } else {
      setPanel("panel");
    }
  }, []);
  if (panel === "blank") return <div className="app-main-blank"></div>;
  return (
    <ThemeProvider theme={theme}>
      <div className="app-main">
        {panel === "panel" ? <Apppanel /> : <Appmarketing />}
      </div>
    </ThemeProvider>
  );
};

export default App;
