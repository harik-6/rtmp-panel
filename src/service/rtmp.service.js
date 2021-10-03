import axios from "axios";
import CacheService from "./cache.service";
import CACHEKEYS from "../cacheKeys";
const API = `/api/channel`;
const API_RTMP = `/api/rtmp`;

const _headers = (user) => {
  return {
    Authorization: `Bearer ${user.token}`,
  };
};

const changeRtmpStatus = async (channel, user) => {
  try {
    const response = await axios.post(
      `${API}/edit/status`,
      {
        channelid: channel["_id"],
      },
      {
        headers: _headers(user),
      }
    );
    const data = response.data;
    CacheService.remove(CACHEKEYS.FETCH_CHANNELS);
    if (data.payload.status === "failed") return false;
    return true;
  } catch (error) {
    return false;
  }
};

const getBitrateMedata = async (httplink) => {
  try {
    const cachkey = "BITRATE_METADA_" + httplink;
    const cachevalue = CacheService.get(cachkey);
    if (cachevalue !== null) return cachevalue;
    const response = await axios.post(`${API_RTMP}/metadata`, {
      surl: httplink,
    });
    const data = response.data;
    let payload = null;
    if (data.status === "success") {
      payload = data.payload;
    }
    CacheService.set(cachkey, payload);
    return payload;
  } catch (error) {
    return null;
  }
};

const rebootServer = async (channellist) => {
  const channel = channellist[0];
  console.log(channel);
  try {
    const rebootUrl = `https://${channel.server}/sys_reboot`;
    await axios.post(rebootUrl);
    return;
  } catch (error) {
    return;
  }
};

const getRtmpCount = async (servers = [], user) => {
  let countmap = {};
  try {
    const cachkey = CACHEKEYS.FETCH_VIEW_COUNT;
    const cachevalue = CacheService.get(cachkey);
    if (cachevalue !== null) return cachevalue;
    const response = await axios.post(
      `${API_RTMP}/view`,
      {
        servers: servers,
      },
      {
        headers: _headers(user),
      }
    );
    const data = response.data;
    if (data.status === "failed") return countmap;
    const countArray = data.payload;
    countArray.forEach((obj) => {
      const { rtmpCount, hlsCount, channelName } = obj;
      countmap[channelName] = {
        rtmpCount,
        hlsCount,
      };
    });
    CacheService.set(cachkey, countmap);
    return countmap;
  } catch (error) {
    return countmap;
  }
};

const checkChannelHealth = async (list, forceCheck = false) => {
  try {
    const cachkey = CACHEKEYS.FETCH_CHANNEL_HEALTH;
    if (forceCheck) {
      CacheService.remove(cachkey);
    }
    const cachevalue = CacheService.get(cachkey);
    if (cachevalue !== null) return cachevalue;
    let healthMap = {};
    for (let i = 0; i < list.length; i++) {
      const channel = list[i];
      try {
        const response = await fetch(channel.hls);
        if (response.status >= 200 && response.status <= 205) {
          healthMap[channel.name] = true;
        } else {
          healthMap[channel.name] = false;
        }
      } catch (_) {
        healthMap[channel.name] = false;
      }
    }
    CacheService.set(cachkey, healthMap);
    return healthMap;
  } catch (error) {
    return null;
  }
};

const getXmlData = async (server, user) => {
  try {
    const response = await axios.post(
      `${API_RTMP}/stat`,
      {
        server,
      },
      {
        headers: _headers(user),
      }
    );
    const data = response.data;
    if (data.status === "success") return data.payload;
    return "";
  } catch (error) {
    console.log(error);
    return "";
  }
};
export {
  changeRtmpStatus,
  rebootServer,
  getBitrateMedata,
  checkChannelHealth,
  getRtmpCount,
  getXmlData,
};
