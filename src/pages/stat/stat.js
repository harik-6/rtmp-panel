import React, { useState, useEffect, useContext } from "react";
import AppContext from "../../context/context";
import {
  Table,
  TableRow,
  TableBody,
  TableCell,
  TableContainer,
  TablePagination,
} from "@material-ui/core";
import ServerSelect from "../../components/serverselect";
import useStyles from "./stat.styles";
// import { getXmlData } from "../../service/rtmp.service";
import { getChannels } from "../../service/channel.service";
import { getBitrateMedata } from "../../service/rtmp.service";

const defaultMetdata = {
  audioType: "N/A",
  audioRate: "0 kbps",
  videoType: "N/A",
  videoRate: "0 kbps",
  fps: "0 FPS",
  resolution: "N/A",
};

const Stat = () => {
  const { user } = useContext(AppContext);
  const [metadataMap, setMetadataMap] = useState({});
  const [channelList, setChannelList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [pageSize, setPageSize] = useState(10);
  const [page, setPage] = useState(0);
  const [selectedServer, setSelectedServer] = useState("no-server");
  const [serverNames, setServerNames] = useState([["no-server"]]);

  const handleChangePage = (event, pagenumber) => {
    setPage(pagenumber);
  };

  const handleChangeRowsPerPage = (event) => {
    setPageSize(event.target.value);
  };

  const _loadMetadata = async (fullList = [], serverToFilter) => {
    setLoading(true);
    const list = fullList.filter((c) => c.server === serverToFilter);
    let map = {};
    for (let i = 0; i < list.length; i++) {
      const channel = list[i];
      const metadata = await getBitrateMedata(channel.hls);
      map[channel.name] = metadata;
    }
    setMetadataMap(map);
    setLoading(false);
  };

  const loadChannels = async () => {
    setLoading(true);
    const list = (await getChannels(user)) || [];
    const servers = [...new Set(list.map((c) => c.server))] || ["no-server"];
    setServerNames(servers);
    setChannelList(list);
    setSelectedServer(servers[0]);
    _loadMetadata(list, servers[0]);
  };

  const _formatFPS = (value = "0 FPS") => {
    const num = parseInt(value);
    if (num > 60) {
      return 30;
    }
    return num;
  };

  useEffect(() => {
    loadChannels();
    // eslint-disable-next-line
  }, []);

  const _changeServer = (_serverName) => {
    setSelectedServer(_serverName);
    _loadMetadata(channelList, _serverName);
  };

  let tableData = channelList
    .filter((c) => c.server === selectedServer)
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

  const classes = useStyles();

  return (
    <div className={classes.stat}>
      <ServerSelect
        serverNames={serverNames}
        onSelect={_changeServer}
        selectedServer={selectedServer}
        labelVisible={false}
      />
      {loading ? (
        <p style={{ textAlign: "center", marginTop: "32px" }}>
          Loading data...
        </p>
      ) : (
        <TableContainer className={classes.tablecnt}>
          <TablePagination
            rowsPerPageOptions={[10, 15, 25]}
            component="div"
            count={tableData.length}
            rowsPerPage={pageSize}
            page={page}
            onChangePage={handleChangePage}
            onChangeRowsPerPage={handleChangeRowsPerPage}
          />
          <Table aria-label="channel-list">
            <TableRow>
              <TableCell align="left">Name</TableCell>
              <TableCell align="center">Video rate (Kbps)</TableCell>
              <TableCell align="center">Video type </TableCell>
              <TableCell align="center">Audio rate (Kbps)</TableCell>
              <TableCell align="center">Audio type</TableCell>
              <TableCell align="center">Resolution</TableCell>
              <TableCell align="center">FPS</TableCell>
            </TableRow>
            <TableBody>
              {tableData.map((channel, index) => {
                const {
                  audioType,
                  audioRate,
                  videoType,
                  videoRate,
                  fps,
                  resolution,
                } = channel.meta;
                const vrate = parseInt(videoRate);
                return (
                  <TableRow key={channel.key + " " + index}>
                    <TableCell className={classes.tbcell} align="left">
                      {channel.name}
                    </TableCell>
                    <TableCell
                      style={{
                        color: vrate > 1999 ? "#ff1744" : "inherit",
                      }}
                      className={classes.tbcell}
                      align="center"
                    >
                      {vrate}
                    </TableCell>
                    <TableCell className={classes.tbcell} align="center">
                      {videoType}
                    </TableCell>
                    <TableCell className={classes.tbcell} align="center">
                      {parseInt(audioRate)}
                    </TableCell>
                    <TableCell className={classes.tbcell} align="center">
                      {audioType}
                    </TableCell>
                    <TableCell className={classes.tbcell} align="center">
                      {resolution}
                    </TableCell>
                    <TableCell className={classes.tbcell}>
                      {_formatFPS(fps)}
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </div>
  );
};

export default Stat;
