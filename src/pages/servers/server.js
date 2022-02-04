import React from "react";
import AppContext from "../../context/context";
import ServersA from "./server.a";
import ServersS from "./server.s";

const Servers = () => {
  const { store } = React.useContext(AppContext);
  const [map, setMap] = React.useState({});
  const { user, servers, channels } = store;

  const _setMapCount = () => {
    const _m = {};
    for (let i = 0; i < servers.length; i++) {
      _m[servers[i]] = 0;
    }
    for (let i = 0; i < channels.length; i++) {
      const n = channels[i].server;
      _m[n] = _m[n] + 1;
    }
    setMap(_m);
  };

  React.useEffect(() => {
    _setMapCount();
    // eslint-disable-next-line
  }, [user, servers, channels]);

  if (user.usertype === "s") {
    return <ServersS map={map} />;
  }

  return <ServersA servers={servers} map={map} />;
};

export default Servers;
