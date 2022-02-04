import axios from "axios";
import CacheService from "./cache.service";
import CACHEKEYS from "../cacheKeys";
import { getHealth } from "./health.service";
const API_VIEW = `/api/view`;

const _cacheKey = (channelName) => {
  return `${CACHEKEYS.FETCH_VIEW_CHANNEL}-${channelName}`;
};

const getViewsByServers = async (servers = [], user) => {
  let countmap = {};
  try {
    const cachkey = CACHEKEYS.FETCH_VIEWS;
    const cachevalue = CacheService.get(cachkey);
    if (cachevalue !== null) return cachevalue;
    const response = await axios.post(`${API_VIEW}`, {
      servers: servers,
    });
    const data = response.data;
    if (data.status === "failed") return countmap;
    const countArray = data.payload;
    countArray.forEach((obj) => {
      const { rtmp, hls, name, health } = obj;
      countmap[name] = {
        rtmp: Math.max(rtmp - 1, 0),
        hls: hls,
        health,
      };
    });
    CacheService.set(cachkey, countmap);
    Object.keys(countmap).forEach((chName) => {
      CacheService.set(_cacheKey(chName), countmap[chName]);
    });
    return countmap;
  } catch (error) {
    return countmap;
  }
};

const getViewsByChannel = async ({ name, hls }, isRefresh, user) => {
  try {
    const cachkey = _cacheKey(name);
    if (isRefresh) {
      CacheService.set(cachkey, null);
    }
    const cachevalue = CacheService.get(cachkey);
    if (cachevalue !== null) return cachevalue;
    const resp = await axios.get(`${API_VIEW}/${name}`);
    const { payload } = resp.data;
    const health = await getHealth(hls);
    const obj = {
      rtmp: payload.rtmp,
      hls: payload.hls,
      health,
    };
    CacheService.set(cachkey, obj);
    return obj;
  } catch (error) {
    return {
      rtmp: 0,
      hls: 0,
      health: false,
    };
  }
};

export { getViewsByServers, getViewsByChannel };
