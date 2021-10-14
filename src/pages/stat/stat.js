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
import ServerSelect from "../../components/serverselect";

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

  const handleChangePage = (event, pagenumber) => {
    setPage(pagenumber);
  };

  const handleChangeRowsPerPage = (event) => {
    setPageSize(event.target.value);
  };

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
    (a, b) => parseInt(b.meta.videoRate) - parseInt(a.meta.videoRate)
  );

  return (
    <div>
      <TopDiv>
        <ServerSelect
          serverNames={servers}
          onSelect={_changeServer}
          selectedServer={_selectedServer}
          labelVisible={false}
        />
        <TablePagination
          rowsPerPageOptions={[10, 15, 25]}
          component="div"
          count={tableData.length}
          rowsPerPage={pageSize}
          page={page}
          onChangePage={handleChangePage}
          onChangeRowsPerPage={handleChangeRowsPerPage}
        />
      </TopDiv>

      {loading ? (
        <p style={{ textAlign: "center", marginTop: "32px" }}>
          Loading data...
        </p>
      ) : (
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
                  audioRate,
                  inBytes,
                  outBytes,
                  totalIn,
                  totalOut,
                  upTime,
                  videoRate,
                  videoRateRaw,
                } = channel.meta;
                return (
                  <TableRow key={channel.key + " " + index}>
                    <TableCellStyled align="left">
                      {channel.name}
                    </TableCellStyled>
                    <TableCellStyled
                      style={{
                        color: videoRateRaw > 2000000 ? "#ff1744" : "inherit",
                      }}
                      align="center"
                    >
                      {videoRate}
                    </TableCellStyled>
                    <TableCellStyled align="center">
                      {audioRate}
                    </TableCellStyled>
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
      )}
    </div>
  );
};

export default Stat;
