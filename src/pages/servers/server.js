import React, { useContext, useEffect } from "react";
import AppContext from "../../context/context";
import ServersA from "./server.a";
import ServersS from "./server.s";

const Servers = () => {
  const { store } = useContext(AppContext);
  const { user, servers } = store;

  useEffect(() => {}, [user, servers]);

  if (user.usertype === "s") {
    return <ServersS />;
  }

  return <ServersA servers={servers} />;
};

export default Servers;
