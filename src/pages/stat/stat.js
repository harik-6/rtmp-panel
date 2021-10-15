import React, { useState, useEffect, useContext } from "react";
import styled from "styled-components";
import AppContext from "../../context/context";

// components
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TablePagination from "@mui/material/TablePagination";
import TableRow from "@mui/material/TableRow";
import ServerSelect from "../../components/Serverselect";

// services
import { getBitrateMedata } from "../../service/rtmp.service";
import { statFormatter } from "./stat.formatter";

// styled
const TopDiv = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
`;

const TableContainerStyled = styled(TableContainer)`
  background-color: #ffffff;
  border-radius: 16px;
`;

const TableCellStyled = styled(TableCell)`
  padding: 12px 0;
`;

const defaultMetdata = {
  audioRate: 0,
  inBytes: 0,
  outBytes: 0,
  totalIn: 0,
  totalOut: 0,
  upTime: 0,
  videoRate: 0,
};

const VideoRateCell = ({ videoRateRaw, videoRate }) => {
  if (videoRateRaw > 2000000) {
    return (
      <p
        style={{
          color: "#ff1744",
        }}
      >
        {videoRate}
      </p>
    );
  }
  return <p>{videoRate}</p>;
};

const Stat = () => {
  // store variable
  const { store } = useContext(AppContext);
  const { user, servers, channels } = store;

  // state variable
  const [metadataMap, setMetadataMap] = useState({});
  const [loading, setLoading] = useState(false);
  const [pageSize, setPageSize] = useState(10);
  const [page, setPage] = useState(0);
  const [_selectedServer, setSelectedServer] = useState("no-server");

  const _loadMetadata = async (serverToLoad) => {
    setLoading(true);
    const list = await getBitrateMedata(serverToLoad, user);
    const map = statFormatter(list);
    setMetadataMap(map);
    setLoading(false);
  };

  useEffect(() => {
    const ser = servers[0];
    setSelectedServer(ser);
    _loadMetadata(ser);
    // eslint-disable-next-line
  }, [servers, channels]);

  const _changeServer = (_serverName) => {
    setSelectedServer(_serverName);
    _loadMetadata(_serverName);
  };

  let tableData = channels
    .filter((c) => c.server === _selectedServer)
    .map((channel) => {
      let meta = metadataMap[channel.name];
      if (meta === null || meta === undefined) {
        meta = defaultMetdata;
      }
      return {
        name: channel.name,
        meta,
      };
    });

  tableData.sort(
    (a, b) => (b.meta.videoRateRaw || 0) - (a.meta.videoRateRaw || 0)
  );

  if (loading)
    return (
      <p style={{ textAlign: "center", marginTop: "32px" }}>Loading data...</p>
    );

  return (
    <div>
      <TopDiv>
        <TablePagination
          rowsPerPageOptions={[10, 15, 25]}
          component="div"
          count={tableData.length}
          rowsPerPage={pageSize}
          page={page}
          onChangePage={(_, pagenumber) => setPage(pagenumber)}
          onChangeRowsPerPage={(event) => setPageSize(event.target.value)}
        />
        <ServerSelect
          serverNames={servers}
          onSelect={_changeServer}
          selectedServer={_selectedServer}
          labelVisible={false}
        />
      </TopDiv>
      <TableContainerStyled>
        <Table aria-label="channel-list">
          <TableRow>
            <TableCellStyled align="left">Name</TableCellStyled>
            <TableCellStyled align="center">Video bitrate</TableCellStyled>
            <TableCellStyled align="center">Audio bitrate</TableCellStyled>
            <TableCellStyled align="center">Bitrate In</TableCellStyled>
            <TableCellStyled align="center">Bitrate Out</TableCellStyled>
            <TableCellStyled align="center">Bandwidth In</TableCellStyled>
            <TableCellStyled align="center">Bandwidth Out</TableCellStyled>
            <TableCellStyled align="center">Uptime</TableCellStyled>
          </TableRow>
          <TableBody>
            {tableData.map((channel, index) => {
              const {
                audioRate = 0,
                inBytes = 0,
                outBytes = 0,
                totalIn = 0,
                totalOut = 0,
                upTime = 0,
                videoRate = 0,
                videoRateRaw = 0,
              } = channel.meta;
              return (
                <TableRow key={channel.key + " " + index}>
                  <TableCellStyled align="left">{channel.name}</TableCellStyled>
                  <TableCellStyled align="center">
                    <VideoRateCell
                      videoRateRaw={videoRateRaw}
                      videoRate={videoRate}
                    />
                  </TableCellStyled>
                  <TableCellStyled align="center">{audioRate}</TableCellStyled>
                  <TableCellStyled align="center">{inBytes}</TableCellStyled>
                  <TableCellStyled align="center">{outBytes}</TableCellStyled>
                  <TableCellStyled align="center">{totalIn}</TableCellStyled>
                  <TableCellStyled align="center">{totalOut}</TableCellStyled>
                  <TableCellStyled align="center">{upTime}</TableCellStyled>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </TableContainerStyled>
    </div>
  );
};

export default Stat;
