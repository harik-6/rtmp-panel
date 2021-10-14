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

const getBitrateMedata = async (server, user) => {
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
    let payload = null;
    if (data.status === "success") {
      payload = data.payload;
    }
    return payload;
  } catch (error) {
    return null;
  }
};

const rebootServer = async (channellist) => {
  const channel = channellist[0];
  try {
    const rebootUrl = `https://${channel.server}/sys_reboot`;
    await axios.post(rebootUrl);
    return;
  } catch (error) {
    return;
  }
};

const getViews = async (servers = [], user) => {
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

const getHealth = async (servers = [], user) => {
  let healthmap = {};
  try {
    const cachkey = CACHEKEYS.FETCH_CHANNEL_HEALTH;
    const cachevalue = CacheService.get(cachkey);
    if (cachevalue !== null) return cachevalue;
    const response = await axios.post(
      `${API_RTMP}/health`,
      {
        servers: servers,
      },
      {
        headers: _headers(user),
      }
    );
    const data = response.data;
    if (data.status === "failed") return healthmap;
    const healthArray = data.payload;
    healthArray.forEach((obj) => {
      const { name, health } = obj;
      healthmap[name] = health;
    });
    CacheService.set(cachkey, healthmap);
    return healthmap;
  } catch (error) {
    return healthmap;
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
    return "";
  }
};
export {
  changeRtmpStatus,
  rebootServer,
  getBitrateMedata,
  getHealth,
  getViews,
  getXmlData,
};
