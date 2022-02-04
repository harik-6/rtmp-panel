import React, { useState } from "react";
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

// components
import Preloader from "../../components/Preloader";
import CreateNewChannel from "../../components/Channel/Createchannel";

// services
import {
  getServerDetailsByName,
  rebootServer,
} from "../../service/server.service";
import Legend from "../../components/Legend";

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

const ServersA = ({ servers, map }) => {
  // stat variabled
  const [_booting, setBooting] = useState(false);
  const [_servers, setServerList] = useState([]);
  const [_loading, setLoading] = useState(false);
  const [_opencreate, setOpencreate] = useState(false);
  const [_server, setServer] = useState("");

  const _rebootServer = async (_sname) => {
    setBooting(true);
    await rebootServer(_sname);
    setTimeout(() => {
      setBooting(false);
    }, 4 * 1000);
  };

  const _fetchServerDetails = async (_s) => {
    setLoading(true);
    const s = await getServerDetailsByName(_s);
    setServerList(s);
    setLoading(false);
  };

  React.useEffect(() => {
    _fetchServerDetails(servers);
  }, [servers]);

  if (_booting) {
    return <Preloader message={"Rebooting server..."} />;
  }

  if (_loading) {
    return <Preloader message={"Loading server..."} />;
  }

  return (
    <ServersPage>
      <Info>Use action column to change server status*.</Info>
      <TableContainerStyled>
        <Table aria-label="channel-list">
          <TableRow>
            <TableCellStyled align="left">Domain</TableCellStyled>
            <TableCellStyled align="left">Limit</TableCellStyled>
            <TableCellStyled align="left"># Channels</TableCellStyled>
            <TableCellStyled align="left">Status</TableCellStyled>
            <TableCellStyled align="left">Secured</TableCellStyled>
            {/* <TableCellStyled align="left">Version</TableCellStyled> */}
            <TableCellStyled align="left">Actions</TableCellStyled>
          </TableRow>
          <TableBody>
            {_servers.map((s, index) => {
              const _sname = s.domain;
              const _limit = s.limit;
              const _used = map[_sname] || "N/A";
              return (
                <TableRow key={s + " " + index}>
                  <TableCellStyled align="left">{_sname}</TableCellStyled>
                  <TableCellStyled align="left">{_limit}</TableCellStyled>
                  <TableCellStyled align="left">{_used}</TableCellStyled>
                  <TableCellStyled align="left">
                    <Legend type={"live"} />
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
                        sx={{ textTransform: "none" }}
                        size="small"
                        disableElevation
                        disabled={_limit === _used}
                        variant="outlined"
                        onClick={() => {
                          setServer(_sname);
                          setOpencreate(true);
                        }}
                      >
                        Add Channel
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
      <CreateNewChannel
        open={_opencreate}
        onClose={() => setOpencreate(false)}
        callback={() => {}}
        server={_server}
      />
    </ServersPage>
  );
};

export default ServersA;
