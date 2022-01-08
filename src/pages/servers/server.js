import React, { useContext, useState, useEffect } from "react";
import styled from "styled-components";
import AppContext from "../../context/context";

// mui-components
import CardContent from "@mui/material/CardContent";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import { Button, Stack } from "@mui/material";
import TableRow from "@mui/material/TableRow";

// components
import Preloader from "../../components/Preloader";
import WarningModal from "../../components/Warningmodal";

// services
import {
  getServers,
  rebootServer,
  limitStatus,
  startLimit,
  stopLimit,
} from "../../service/server.service";
import TxtField from "../../components/TxtField";
import axios from "axios";

// styled
const ServersPage = styled.div``;

const Content = styled(CardContent)`
  display: flex;
  flex-direction: row;
  align-items: center;
`;

const Info = styled.p`
  opacity: 0.4;
  text-align: right;
  margin-bottom: 8px;
`;

const TableCellStyled = styled(TableCell)`
  padding: 12px 0;
`;

const TableContainerStyled = styled(TableContainer)`
  background-color: #ffffff;
  border-radius: 16px;
`;

const Domains = styled.p``;

const Servers = () => {
  // store variabled
  const { store } = useContext(AppContext);
  // const { servers } = store;

  // stat variabled
  const [servers, setServers] = useState([]);
  const [_server, setServer] = useState("");
  const [_booting, setBooting] = useState(false);
  const [_open, setOpen] = useState(false);

  const _loadAllServers = async () => {
    const ss = await getServers();
    setServers(ss);
  };

  const _rebootServer = async (_sname) => {
    setBooting(true);
    await rebootServer(_sname);
    setTimeout(() => {
      setBooting(false);
      setOpen(false);
    }, 4 * 1000);
  };

  const _startLimit = async (_sname, bwIn, bwOut, _sid, status) => {
    try {
      await startLimit(_sname, bwIn, bwOut);
      await limitStatus(_sid, status);
    } catch (_) {}
  };

  const _stopLimit = async (_sname, _sid, status) => {
    try {
      await stopLimit(_sname);
      await limitStatus(_sid, status);
    } catch (_) {}
  };

  useEffect(() => {
    _loadAllServers();
  }, []);

  if (_booting) {
    return <Preloader message={"Rebooting server..."} />;
  }

  if (servers.length === 0) {
    return <Preloader message={"Loading servers..."} />;
  }

  return (
    <ServersPage>
      <Info>Tab on icon to reboot the server*.</Info>
      <TableContainerStyled>
        <Table aria-label="channel-list">
          <TableRow>
            <TableCellStyled align="left">IP</TableCellStyled>
            <TableCellStyled align="left">Bandwidth IN</TableCellStyled>
            <TableCellStyled align="left">Bandwidth Out</TableCellStyled>
            <TableCellStyled align="left">Limited bandwidth</TableCellStyled>
            <TableCellStyled align="left">Domains</TableCellStyled>
            <TableCellStyled align="left">Actions</TableCellStyled>
          </TableRow>
          <TableBody>
            {servers.map((s, index) => {
              const _sname = s.domains[0];
              return (
                <TableRow key={s.ip + " " + index}>
                  <TableCellStyled align="left">{s.ip}</TableCellStyled>
                  <TableCellStyled align="left">
                    <TxtField
                      id="bwIn"
                      name="bwIn"
                      value={s.bwIn}
                      onChange={() => {}}
                    />
                  </TableCellStyled>
                  <TableCellStyled align="left">
                    <TxtField
                      id="bwOut"
                      name="bwOut"
                      value={s.bwOut}
                      onChange={() => {}}
                    />
                  </TableCellStyled>
                  <TableCellStyled align="left">
                    {s.isBwLimited ? "YES" : "NO"}
                  </TableCellStyled>
                  <TableCellStyled align="left">
                    {s.domains.map((d) => (
                      <Domains>{d}</Domains>
                    ))}
                  </TableCellStyled>
                  <TableCellStyled align="left">
                    <Stack direction="row" spacing={2}>
                      <Button
                        sx={{ textTransform: "none" }}
                        disableElevation
                        size="small"
                        variant="outlined"
                        onClick={() => _rebootServer(_sname)}
                      >
                        Reboot
                      </Button>
                      <Button
                        sx={{ textTransform: "none" }}
                        disableElevation
                        size="small"
                        variant="outlined"
                        onClick={() =>
                          _startLimit(
                            _sname,
                            s.bwIn,
                            s.bwOut,
                            s.id,
                            s.isBwLimited
                          )
                        }
                      >
                        Start limit
                      </Button>
                      <Button
                        sx={{ textTransform: "none" }}
                        disableElevationsize="small"
                        variant="outlined"
                        onClick={() => _stopLimit(_sname, s.id, s.isBwLimited)}
                      >
                        Stop limit
                      </Button>
                      <Button
                        sx={{ textTransform: "none" }}
                        disableElevation
                        size="small"
                        variant="contained"
                      >
                        Save
                      </Button>
                    </Stack>
                  </TableCellStyled>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </TableContainerStyled>
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
