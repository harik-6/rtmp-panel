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
// import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
// import LockOpenOutlinedIcon from "@mui/icons-material/LockOpenOutlined";
// import BwEnabled from "@mui/icons-material/HourglassEmptyOutlined";
// import BwDisabled from "@mui/icons-material/HourglassDisabledOutlined";
import AddIcon from "@mui/icons-material/Add";
import SyncIcon from '@mui/icons-material/Sync';
import DeleteIcon from "@mui/icons-material/DeleteOutlined";

// components
import Preloader from "../../components/Preloader";
import CreateNewChannel from "../../components/Channel/Createchannel";

// services
import {
  getServers,
  rebootServer,
  // limitStatus,
  // startLimit,
  // stopLimit,
  deleteServer,
  syncIps
} from "../../service/server.service";
import EditServer from "../../components/Server/EditServer";
import CreateServer from "../../components/Server/CreateServer";

// styled
const ServersPage = styled.div``;

const Info = styled.p`
  text-align: right;
  margin-bottom: 8px;
  display:flex;
  justify-content:flex-end;
  gap:8px;
`;

const TableCellStyled = styled(TableCell)`
  padding: 12px 0;
`;

const TableHeaderText = styled.p`
  font-weight: bold;
`

const TableContainerStyled = styled(TableContainer)`
  background-color: #ffffff;
  border-radius: 16px;
`;
let prevIp = "0.0.0.0.";

const ServersS = ({ map }) => {
  // stat variabled
  const [servers, setServerList] = useState([]);
  const [_activeServer, setActiveServer] = useState("");
  const [_booting, setBooting] = useState(false);
  const [_open, setOpen] = useState(false);
  const [_new, setNew] = useState(false);
  const [_opencreate, setOpencreate] = useState(false);
  const [_server, setServer] = useState("");

  const _loadAllServers = async () => {
    let ss = await getServers();
    ss.sort((a, b) => a.ip.localeCompare(b.ip));
    setServerList(ss);
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

  // const _limitStatus = async (_sid, _status) => {
  //   try {
  //     await limitStatus(_sid, _status);
  //     _loadAllServers();
  //   } catch (_) { }
  // };

  // const _startLimit = async (_sname, bwIn, bwOut, _sid) => {
  //   try {
  //     await startLimit(_sname, bwIn, bwOut);
  //     await _limitStatus(_sid, true);
  //   } catch (_) { }
  // };

  // const _stopLimit = async (_sname, _sid) => {
  //   try {
  //     await stopLimit(_sname);
  //     await _limitStatus(_sid, false);
  //   } catch (_) { }
  // };

  const _editServer = async (_s) => {
    setActiveServer(_s);
    setTimeout(() => {
      setOpen(true);
    });
  };

  const _deleteServer = async (_sid) => {
    setServerList([]);
    await deleteServer(_sid);
    _loadAllServers();
  };

  const _canRenderIp = (ip) => {
    if (ip === prevIp) {
      return false;
    }
    prevIp = ip;
    return true;
  }

  const _syncIpAndServers = async () => {
    setServerList([]);
    await syncIps();
    _loadAllServers();
  }


  useEffect(() => {
    _loadAllServers();
    prevIp = "0.0.0.0.";
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
          disableElevation
        >
          New Server
        </Button>
        <Button
          onClick={_syncIpAndServers}
          size="small"
          variant="contained"
          endIcon={<SyncIcon />}
          disableElevation
        >
          Sync IP
        </Button>
      </Info>
      <TableContainerStyled>
        <Table aria-label="channel-list">
          <TableRow>
            <TableCellStyled style={{ fontWeight: 'bold' }} align="left">
              <TableHeaderText>IP</TableHeaderText>
            </TableCellStyled>
            <TableCellStyled align="left">
              <TableHeaderText>Domain</TableHeaderText>
            </TableCellStyled>
            {/* <TableCellStyled align="left">Bandwidth IN</TableCellStyled>
            <TableCellStyled align="left">Bandwidth Out</TableCellStyled> */}
            <TableCellStyled align="left">
              <TableHeaderText>Limit</TableHeaderText>
            </TableCellStyled>
            <TableCellStyled align="left">
              <TableHeaderText># Channels</TableHeaderText>
            </TableCellStyled>
            {/* <TableCellStyled align="left">BW Status</TableCellStyled> */}
            {/* <TableCellStyled align="left">
              <TableHeaderText>Secured</TableHeaderText>
            </TableCellStyled> */}
            {/* <TableCellStyled align="left">Version</TableCellStyled> */}
            <TableCellStyled align="left">
              <TableHeaderText>Actions</TableHeaderText>
            </TableCellStyled>
            <TableCellStyled align="left">
              <TableHeaderText>Delete</TableHeaderText>
            </TableCellStyled>
          </TableRow>
          <TableBody>
            {servers.map((s, index) => {
              const _sname = s.domain;
              const _limit = s.limit;
              const _used = map[_sname] || "N/A";
              const _canRedner = _canRenderIp(s.ip);
              return (
                <TableRow key={s.id + " " + index}>
                  <TableCellStyled align="left">{_canRedner && s.ip}</TableCellStyled>
                  <TableCellStyled align="left">{_sname}</TableCellStyled>
                  {/* <TableCellStyled align="left">{s.bwIn}</TableCellStyled> */}
                  {/* <TableCellStyled align="left">{s.bwOut}</TableCellStyled> */}
                  <TableCellStyled align="left">{_limit}</TableCellStyled>
                  <TableCellStyled align="left">{_used}</TableCellStyled>
                  {/* <TableCellStyled align="left">
                    {s.isBwEnabled ? (
                      <BwEnabled sx={{ color: "green" }} />
                    ) : (
                      <BwDisabled sx={{ color: "red" }} />
                    )}
                  </TableCellStyled> */}
                  {/* <TableCellStyled align="left">
                    {s.isAuthEnabled ? (
                      <LockOutlinedIcon sx={{ color: "green" }} />
                    ) : (
                      <LockOpenOutlinedIcon sx={{ color: "red" }} />
                    )}
                  </TableCellStyled> */}

                  {/* <TableCellStyled align="left">{s.version}</TableCellStyled> */}
                  <TableCellStyled align="left">
                    <Stack direction="row" spacing={2}>
                      <Button
                        sx={{ textTransform: "none" }}
                        size="small"
                        disableElevation
                        disabled={_used >= _limit}
                        variant="outlined"
                        onClick={() => {
                          setServer(_sname);
                          setOpencreate(true);
                        }}
                      >
                        Add Channel
                      </Button>
                      <Button
                        onClick={() => _editServer(s)}
                        sx={{ textTransform: "none" }}
                        disableElevation
                        size="small"
                        variant="outlined"
                      >
                        Edit
                      </Button>
                      {/* <Button
                        sx={{ textTransform: "none" }}
                        disableElevation
                        size="small"
                        variant="contained"
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
                      </Button> */}
                      {/* <Button
                        sx={{ textTransform: "none" }}
                        disableElevationsize="small"
                        variant="contained"
                        disabled={!s.isBwLimited}
                        onClick={() => _stopLimit(_sname, s.id, s.isBwLimited)}
                      >
                        Stop limit
                      </Button> */}
                      {
                        _canRedner && <Button
                          sx={{ textTransform: "none" }}
                          disableElevation
                          size="small"
                          variant="outlined"
                          color="secondary"
                          onClick={() => _rebootServer(_sname)}
                        >
                          Reboot
                        </Button>
                      }
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
      <CreateNewChannel
        open={_opencreate}
        onClose={() => setOpencreate(false)}
        callback={() => { }}
        server={_server}
      />
    </ServersPage>
  );
};



export default ServersS;
