import axios from "axios";
import CacheService from "./cache.service";
import CACHEKEYS from "../cacheKeys";
const API = `/api/server`;

const getServers = async () => {
  try {
    const cachkey = CACHEKEYS.FETCH_SERVERS;
    const cachevalue = CacheService.get(cachkey);
    if (cachevalue !== null) return cachevalue;
    const response = await axios.get(`${API}`);
    const data = response.data.payload || [];
    return data;
  } catch (error) {
    return [];
  }
};

const rebootServer = async (domain) => {
  try {
    await axios.post(`https://${domain}/api/restart`);
    return;
  } catch (error) {
    return;
  }
};

const limitStatus = async (serverid, status) => {
  try {
    await axios.post(`${API}/bw/${serverid}?status=${status}`);
    return;
  } catch (error) {
    return;
  }
};

const startLimit = async (_sname, bwIn, bwOut) => {
  try {
    await axios.post(
      `https://${_sname}/api/bw/start?bwin=${bwIn}&bwout=${bwOut}`
    );
    return;
  } catch (_) {}
};

const stopLimit = async (_sname) => {
  try {
    await axios.post(`https://${_sname}/api/bw/stop`);
    return;
  } catch (_) {}
};

export { getServers, rebootServer, limitStatus, startLimit, stopLimit };
