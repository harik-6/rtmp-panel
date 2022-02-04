import React, { useState, useEffect } from "react";
import styled from "styled-components";

// mui-components
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import { Button, Stack } from "@mui/material";
import TableRow from "@mui/material/TableRow";
//icons
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import LockOpenOutlinedIcon from "@mui/icons-material/LockOpenOutlined";
import BwEnabled from "@mui/icons-material/HourglassEmptyOutlined";
import BwDisabled from "@mui/icons-material/HourglassDisabledOutlined";
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/DeleteOutlined";

// components
import Preloader from "../../components/Preloader";

// services
import {
  getServers,
  rebootServer,
  limitStatus,
  startLimit,
  stopLimit,
  deleteServer,
} from "../../service/server.service";
import EditServer from "../../components/Server/EditServer";
import CreateServer from "../../components/Server/CreateServer";

// styled
const ServersPage = styled.div``;

const Info = styled.p`
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

const ServersS = () => {
  // stat variabled
  const [servers, setServers] = useState([]);
  const [_activeServer, setActiveServer] = useState("");
  const [_booting, setBooting] = useState(false);
  const [_open, setOpen] = useState(false);
  const [_new, setNew] = useState(false);

  const _loadAllServers = async () => {
    let ss = await getServers();
    ss.sort((a, b) => a.ip.localeCompare(b.ip));
    setServers(ss);
    setActiveServer(ss[0]);
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

  const _deleteServer = async (_sid) => {
    setServers([]);
    await deleteServer(_sid);
    _loadAllServers();
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
      <Info>
        <Button
          onClick={() => setNew(true)}
          size="small"
          variant="contained"
          endIcon={<AddIcon />}
        >
          New Server
        </Button>
      </Info>
      <TableContainerStyled>
        <Table aria-label="channel-list">
          <TableRow>
            <TableCellStyled align="left">IP</TableCellStyled>
            <TableCellStyled align="left">Domain</TableCellStyled>
            <TableCellStyled align="left">Bandwidth IN</TableCellStyled>
            <TableCellStyled align="left">Bandwidth Out</TableCellStyled>
            <TableCellStyled align="left">Limit</TableCellStyled>
            <TableCellStyled align="left">BW Status</TableCellStyled>
            <TableCellStyled align="left">Secured</TableCellStyled>
            {/* <TableCellStyled align="left">Version</TableCellStyled> */}
            <TableCellStyled align="left">Actions</TableCellStyled>
            <TableCellStyled align="left">Delete</TableCellStyled>
          </TableRow>
          <TableBody>
            {servers.map((s, index) => {
              const _sname = s.domain;
              return (
                <TableRow key={s.id + " " + index}>
                  <TableCellStyled align="left">{s.ip}</TableCellStyled>
                  <TableCellStyled align="left">{_sname}</TableCellStyled>
                  <TableCellStyled align="left">{s.bwIn}</TableCellStyled>
                  <TableCellStyled align="left">{s.bwOut}</TableCellStyled>
                  <TableCellStyled align="left">{s.limit}</TableCellStyled>
                  <TableCellStyled align="left">
                    {s.isBwEnabled ? (
                      <BwEnabled sx={{ color: "green" }} />
                    ) : (
                      <BwDisabled sx={{ color: "red" }} />
                    )}
                  </TableCellStyled>
                  <TableCellStyled align="left">
                    {s.isAuthEnabled ? (
                      <LockOutlinedIcon sx={{ color: "green" }} />
                    ) : (
                      <LockOpenOutlinedIcon sx={{ color: "red" }} />
                    )}
                  </TableCellStyled>

                  {/* <TableCellStyled align="left">{s.version}</TableCellStyled> */}
                  <TableCellStyled align="left">
                    <Stack direction="row" spacing={2}>
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
                  <TableCellStyled color="primary" align="left">
                    <DeleteIcon
                      style={{ cursor: "pointer" }}
                      onClick={() => _deleteServer(s.id)}
                    />
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
      <CreateServer
        open={_new}
        onClose={() => {
          setNew(false);
        }}
        callback={() => {
          setNew(false);
          _loadAllServers();
        }}
      />
    </ServersPage>
  );
};

export default ServersS;
