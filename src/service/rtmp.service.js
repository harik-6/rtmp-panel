import axios from "axios";
import CacheService from "./cache.service";
import CACHEKEYS from "../cacheKeys";
const API = `${process.env.REACT_APP_API}/api/channel`;
const API_RTMP = `${process.env.REACT_APP_API}/api/rtmp`;

const getUsageData = async (usersetting) => {
  const { settings, user } = usersetting;
  if (settings !== undefined) {
    const cachkey = CACHEKEYS.FETCH_USAGE + "#" + settings["usageid"];
    const cachevalue = CacheService.get(cachkey);
    if (cachevalue !== null) return cachevalue;
    try {
      const response = await axios.post(
        `${API_RTMP}/usage`,
        {
          usageId: settings["usageid"],
        },
        {
          headers: {
            "x-auth-id": user["_id"],
          },
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
  }
};

const changeRtmpStatus = async (channel) => {
  try {
    const response = await axios.post(`${API}/edit`, {
      channel: {
        ...channel,
        status: !channel.status,
      },
    });
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

const rebootServer = async (channel) => {
  const url = `https://${channel.server}/sys_reboot?psk=${channel.key}&token=${channel.key}`;
  try {
    await fetch(url);
    return;
  } catch (error) {
    return;
  }
};

const checkChannelHealth = async (list,forceCheck=false) => {
  try {
    const cachkey = CACHEKEYS.FETCH_CHANNEL_HEALTH;
    if(forceCheck) {
      CacheService.remove(cachkey);
    }
    const cachevalue = CacheService.get(cachkey);
    if (cachevalue !== null) return cachevalue;
    console.log("going fopr backedn");
    let healthMap = {};
    for (let i = 0; i < list.length; i++) {
      const channel = list[i];
      try {
        const response = await fetch(channel.httpLink);
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
};
