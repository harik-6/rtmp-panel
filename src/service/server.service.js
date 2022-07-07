import axios from "axios";
import CacheService from "./cache.service";
import CACHEKEYS from "../cacheKeys";
const API = `/api/server`;
const API_SSH = `/api/ssh`;

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

const getServerDetailsByName = async (list = []) => {
  try {
    const query = list.join(",");
    const cachkey = CACHEKEYS.FETCH_SERVER_NAME + "-" + query;
    const cachevalue = CacheService.get(cachkey);
    if (cachevalue !== null) return cachevalue;
    const response = await axios.get(`${API}/domain?name=${query}`);
    const data = response.data.payload || [];
    const filter = data.filter((d) => d !== null);
    CacheService.set(cachkey, filter);
    return filter;
  } catch (error) {
    return [];
  }
};

const createServer = async (server) => {
  try {
    await axios.post(`${API}`, server);
    CacheService.remove(CACHEKEYS.FETCH_SERVERS);
    return "success";
  } catch (error) {
    return "failed";
  }
};

const editServer = async (server) => {
  try {
    await axios.put(`${API}`, server);
    CacheService.remove(CACHEKEYS.FETCH_SERVERS);
    return "success";
  } catch (error) {
    return "failed";
  }
};

const deleteServer = async (serverid) => {
  try {
    await axios.delete(`${API}/${serverid}`);
    CacheService.remove(CACHEKEYS.FETCH_SERVERS);
    return "success";
  } catch (error) {
    return "failed";
  }
};

const rebootServer = async (domain) => {
  try {
    await axios.post(`${API_SSH}/restart?domain=${domain}`);
    return;
  } catch (error) {
    return;
  }
};

const limitStatus = async (serverid, status) => {
  try {
    await axios.put(`${API}/bw/${serverid}?status=${status}`);
    CacheService.remove(CACHEKEYS.FETCH_SERVERS);
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
  } catch (_) { }
};

const stopLimit = async (_sname) => {
  try {
    await axios.post(`https://${_sname}/api/bw/stop`);
    return;
  } catch (_) { }
};

const syncIps = async () => {
  try {
    await axios.post(`${API}/sync-ip`);
    CacheService.remove(CACHEKEYS.FETCH_SERVERS);
    return;
  } catch (_) { }
}

export {
  getServers,
  rebootServer,
  limitStatus,
  startLimit,
  stopLimit,
  editServer,
  getServerDetailsByName,
  createServer,
  deleteServer,
  syncIps
};
