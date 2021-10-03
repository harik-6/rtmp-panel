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
  audioRate: 0,
  inBytes: 0,
  outBytes: 0,
  totalIn: 0,
  totalOut: 0,
  upTime: 0,
  videoRate: 0,
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

  const _getReadableFileSizeString = (fileSizeInBytes) => {
    let i = -1;
    const byteUnits = [
      " Kbps",
      " Mbps",
      " Gbps",
      " Tbps",
      "Pbps",
      "Ebps",
      "Zbps",
      "Ybps",
    ];
    do {
      fileSizeInBytes = fileSizeInBytes / 1000;
      i++;
    } while (fileSizeInBytes > 1000);
    return Math.max(fileSizeInBytes, 0.1).toFixed(3) + byteUnits[i];
  };

  function _msToTime(ms) {
    let seconds = (ms / 1000).toFixed(1);
    let minutes = (ms / (1000 * 60)).toFixed(1);
    let hours = (ms / (1000 * 60 * 60)).toFixed(1);
    let days = (ms / (1000 * 60 * 60 * 24)).toFixed(1);
    if (seconds < 60) return seconds + " Sec";
    else if (minutes < 60) return minutes + " Min";
    else if (hours < 24) return hours + " Hrs";
    else return days + " Days";
  }


  const _loadMetadata = async (serverToLoad) => {
    setLoading(true);
    const list = await getBitrateMedata(serverToLoad, user);
    let map = {};
    for (let i = 0; i < list.length; i++) {
      const meta = list[i];
      let {
        audioRate,
        inBytes,
        outBytes,
        totalIn,
        totalOut,
        upTime,
        videoRate,
      } = meta;
      const videoRateRaw = videoRate;
      audioRate = _getReadableFileSizeString(audioRate);
      videoRate = _getReadableFileSizeString(videoRate);
      inBytes = _getReadableFileSizeString(inBytes);
      outBytes = _getReadableFileSizeString(outBytes);
      totalIn = _getReadableFileSizeString(totalIn);
      totalOut = _getReadableFileSizeString(totalOut);
      upTime = _msToTime(upTime);
      map[meta.channelName] = {
        audioRate,
        inBytes,
        outBytes,
        totalIn,
        totalOut,
        upTime,
        videoRate,
        videoRateRaw,
      };
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
    _loadMetadata(servers[0]);
  };

  useEffect(() => {
    loadChannels();
    // eslint-disable-next-line
  }, []);

  const _changeServer = (_serverName) => {
    setSelectedServer(_serverName);
    _loadMetadata(_serverName);
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
              <TableCell align="center">Video bitrate</TableCell>
              <TableCell align="center">Audio bitrate</TableCell>
              <TableCell align="center">Bitrate In</TableCell>
              <TableCell align="center">Bitrate Out</TableCell>
              <TableCell align="center">Bandwidth In</TableCell>
              <TableCell align="center">Bandwidth Out</TableCell>
              <TableCell align="center">Uptime</TableCell>
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
                    <TableCell className={classes.tbcell} align="left">
                      {channel.name}
                    </TableCell>
                    <TableCell
                      style={{
                        color: videoRateRaw > 2000000 ? "#ff1744" : "inherit",
                      }}
                      className={classes.tbcell}
                      align="center"
                    >
                      {videoRate}
                    </TableCell>
                    <TableCell className={classes.tbcell} align="center">
                      {audioRate}
                    </TableCell>
                    <TableCell className={classes.tbcell} align="center">
                      {inBytes}
                    </TableCell>
                    <TableCell className={classes.tbcell} align="center">
                      {outBytes}
                    </TableCell>
                    <TableCell className={classes.tbcell} align="center">
                      {totalIn}
                    </TableCell>
                    <TableCell className={classes.tbcell} align="center">
                      {totalOut}
                    </TableCell>
                    <TableCell className={classes.tbcell} align="center">
                      {upTime}
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
