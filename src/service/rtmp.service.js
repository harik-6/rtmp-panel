import axios from "axios";
import CacheService from "./cache.service";
import CACHEKEYS from "../cacheKeys";
const API = `/channel`;
const API_RTMP = `/rtmp`;
const API_VIEW = `/view`;

const _headers = (user) => {
  return {
    Authorization: `Bearer ${user.token}`,
  };
};

const getUsageData = async (user) => {
  const cachkey = CACHEKEYS.FETCH_USAGE + "#" + user.username;
    const cachevalue = CacheService.get(cachkey);
    if (cachevalue !== null) return cachevalue;
    try {
      const response = await axios.post(
        `${API_RTMP}/usage`,
        {
        },
        {
          headers: _headers(user)
        }
      );
      const data = response.data;
      if (data.status === "failed") return null;
      if (data.payload.length === 0) return null;
      CacheService.set(cachkey, data.payload);
      return data.payload;
    } catch (error) {
      return null;
    }
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
    const response = await axios.post(`${API_RTMP}/metadata`, {
      surl: httplink,
    });
    const data = response.data;
    if (data.status === "success") return data.payload;
    return null;
  } catch (error) {
    return null;
  }
};

const rebootServer = async (channellist,user) => {
  const channel = channellist[0];
  try {
    await axios.post(`${API_VIEW}/reset`, {
      server: channel.server,
    },{
      headers : _headers(user)
    });
    return;
  } catch (error) {
    return;
  }
};

const getRtmpCount = async (livechannels = []) => {
  let countmap = {};
  try {
    const cachkey = CACHEKEYS.FETCH_VIEW_COUNT;
    const cachevalue = CacheService.get(cachkey);
    if (cachevalue !== null) return cachevalue;
    const response = await axios.post(API_VIEW, {
      channels: livechannels,
    });
    const data = response.data;
    if (data.status === "failed") {
      livechannels.forEach((chname) => {
        countmap[chname] = {
          rtmpCount: 0,
          hlsCount: 0,
        };
      });
    }
    data.payload.forEach((viewcount) => {
      const { rtmpCount, hlsCount } = viewcount;
      countmap[viewcount.channelName] = {
        rtmpCount,
        hlsCount,
      };
    });
    CacheService.set(cachkey, countmap);
    return countmap;
  } catch (error) {
    livechannels.forEach((chname) => {
      countmap[chname] = {
        rtmpCount: 0,
        hlsCount: 0,
      };
    });
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
export {
  getUsageData,
  changeRtmpStatus,
  rebootServer,
  getBitrateMedata,
  checkChannelHealth,
  getRtmpCount,
};
