import React, { useContext, useState, useEffect } from "react";
import styled from "styled-components";
import AppContext from "../../context/context";

// mui-components
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import PowerIcon from "@mui/icons-material/PowerSettingsNew";

// components
import Preloader from "../../components/Preloader";
import WarningModal from "../../components/Warningmodal";

// services
import { rebootServer } from "../../service/rtmp.service";

// styled
const ServersPage = styled.div``;

const ServerName = styled.p`
  font-size: 18px;
`;

const Content = styled(CardContent)`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
`;

const Info = styled.p`
  opacity: 0.4;
  text-align: right;
  margin-bottom: 8px;
`;

const Servers = () => {
  // store variabled
  const { store } = useContext(AppContext);
  const { servers } = store;

  // stat variabled
  const [_server, setServer] = useState("");
  const [_booting, setBooting] = useState(false);
  const [_open, setOpen] = useState(false);

  const _rebootServer = async () => {
    setBooting(true);
    await rebootServer([
      {
        server: _server,
      },
    ]);
    setTimeout(() => setBooting(false), 10 * 1000);
  };

  useEffect(() => {}, [servers]);

  if (_booting) {
    return <Preloader message={"Rebooting server..."} />;
  }

  return (
    <ServersPage>
      <Info>Tab on icon to reboot the server*.</Info>
      {servers.map((s) => {
        return (
          <Card
            elevation={0}
            sx={{
              width: "100%",
              marginBottom:'4px'
            }}
          >
            <Content>
              <ServerName>{s}</ServerName>
              <PowerIcon
                color="primary"
                onClick={() => {
                  setServer(s);
                  setOpen(true);
                }}
                sx={{ cursor: "pointer" }}
              />
            </Content>
          </Card>
        );
      })}
      <WarningModal
        open={_open}
        onClose={() => setOpen(false)}
        message={`You sure you want to reboot ${_server} ?`}
        onYes={_rebootServer}
      />
    </ServersPage>
  );
};

export default Servers;
