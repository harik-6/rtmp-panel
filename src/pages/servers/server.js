import React, { useState, useEffect } from "react";
import styled from "styled-components";

// mui-components
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import { Button, Stack } from "@mui/material";
import TableRow from "@mui/material/TableRow";

// components
import Preloader from "../../components/Preloader";

// services
import {
  getServers,
  rebootServer,
  limitStatus,
  startLimit,
  stopLimit,
  getVersion,
} from "../../service/server.service";
import EditServer from "../../components/Server/EditServer";

// styled
const ServersPage = styled.div``;

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
  // stat variabled
  const [servers, setServers] = useState([]);
  const [_activeServer, setActiveServer] = useState("");
  const [_booting, setBooting] = useState(false);
  const [_open, setOpen] = useState(false);
  const [_vMap, setVMap] = useState({});

  const _loadAllVersions = async (_slist) => {
    let map = {};
    for (let i = 0; i < _slist.length; i++) {
      try {
        const v = await getVersion(_slist[i].domains[0]);
        map[_slist[i].ip] = v;
      } catch (_) {
        map[_slist[i].ip] = "N/A";
      }
      setVMap(map);
    }
  };

  const _loadAllServers = async () => {
    const ss = await getServers();
    setServers(ss);
    setActiveServer(ss[0]);
    _loadAllVersions(ss);
  };

  const _rebootServer = async (_sname) => {
    setBooting(true);
    await rebootServer(_sname);
    setTimeout(() => {
      setBooting(false);
      setOpen(false);
    }, 4 * 1000);
  };

  const _limitStatus = async (_sid, _status) => {
    try {
      await limitStatus(_sid, _status);
      _loadAllServers();
    } catch (_) {}
  };

  const _startLimit = async (_sname, bwIn, bwOut, _sid) => {
    try {
      await startLimit(_sname, bwIn, bwOut);
      await _limitStatus(_sid, true);
    } catch (_) {}
  };

  const _stopLimit = async (_sname, _sid) => {
    try {
      await stopLimit(_sname);
      await _limitStatus(_sid, false);
    } catch (_) {}
  };

  const _editServer = async (_s) => {
    setActiveServer(_s);
    setTimeout(() => {
      setOpen(true);
    });
  };

  useEffect(() => {
    _loadAllServers();
    // eslint-disable-next-line
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
            <TableCellStyled align="left">Version</TableCellStyled>
            <TableCellStyled align="left">Actions</TableCellStyled>
          </TableRow>
          <TableBody>
            {servers.map((s, index) => {
              const _sname = s.domains[0];
              return (
                <TableRow key={s.ip + " " + index}>
                  <TableCellStyled align="left">{s.ip}</TableCellStyled>
                  <TableCellStyled align="left">{s.bwIn}</TableCellStyled>
                  <TableCellStyled align="left">{s.bwOut}</TableCellStyled>
                  <TableCellStyled align="left">
                    {s.isBwLimited ? "YES" : "NO"}
                  </TableCellStyled>
                  <TableCellStyled align="left">
                    {s.domains.map((d) => (
                      <Domains>{d}</Domains>
                    ))}
                  </TableCellStyled>
                  <TableCellStyled align="left">
                    {_vMap[s.ip] ?? "N/A"}
                  </TableCellStyled>
                  <TableCellStyled align="left">
                    <Stack direction="row" spacing={2}>
                      <Button
                        sx={{ textTransform: "none" }}
                        disableElevation
                        size="small"
                        variant="outlined"
                        disabled={s.isBwLimited}
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
                        disabled={!s.isBwLimited}
                        onClick={() => _stopLimit(_sname, s.id, s.isBwLimited)}
                      >
                        Stop limit
                      </Button>
                      <Button
                        onClick={() => _editServer(s)}
                        sx={{ textTransform: "none" }}
                        disableElevation
                        size="small"
                        variant="contained"
                      >
                        Edit
                      </Button>
                      <Button
                        sx={{ textTransform: "none" }}
                        disableElevation
                        size="small"
                        variant="outlined"
                        color="secondary"
                        onClick={() => _rebootServer(_sname)}
                      >
                        Reboot
                      </Button>
                    </Stack>
                  </TableCellStyled>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </TableContainerStyled>
      <EditServer
        open={_open}
        server={_activeServer}
        onClose={() => {
          setActiveServer(_activeServer);
          setOpen(false);
        }}
        callback={() => {
          setOpen(false);
          _loadAllServers();
        }}
      />
    </ServersPage>
  );
};

export default Servers;
