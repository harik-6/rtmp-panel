import axios from "axios";
import CacheService from "./cache.service";
import CACHEKEYS from "../cacheKeys";
const API = `/api/channel`;

const _constructChannel = (user, channelname, server) => {
  const chname = channelname.toLowerCase().replace(" ", "");
  const newchannel = {
    name: chname,
    key: chname,
    server,
    rtmp: `rtmp://${server}/live/${chname}`,
    hls: `https://${server}/hls/${chname}.m3u8`,
    preview: `https://${server}/play/${chname}`,
    token: `${chname}?psk=${chname}&token=${chname}`,
    stream: `rtmp://${server}/live`,
    status: true,
  };
  return newchannel;
};

const _headers = (user) => {
  return {
    Authorization: `Bearer ${user.token}`,
  };
};

const createChannel = async (user, channelname, server) => {
  try {
    const newchannel = _constructChannel(user, channelname, server);
    const response = await axios.post(
      `${API}/create`,
      {
        channel: newchannel,
      },
      {
        headers: _headers(user),
      }
    );
    CacheService.remove(CACHEKEYS.FETCH_CHANNELS);
    if (response.data.status === "success") {
      return response.data.payload["_id"];
    }
    return null;
  } catch (error) {
    return null;
  }
};

const getChannels = async (user) => {
  try {
    const cachkey = CACHEKEYS.FETCH_CHANNELS;
    const cachevalue = CacheService.get(cachkey);
    if (cachevalue !== null) return cachevalue;
    const response = await axios.post(
      `${API}/get`,
      {},
      {
        headers: _headers(user),
      }
    );
    const data = response.data.payload || [];
    data.sort((a, b) => a.name.localeCompare(b.name));
    CacheService.set(cachkey, data);
    return data;
  } catch (error) {
    return null;
  }
};

const deleteChannel = async (channel, user) => {
  try {
    const response = await axios.post(
      `${API}/delete`,
      {
        channelid: channel["_id"],
      },
      {
        headers: _headers(user),
      }
    );
    CacheService.remove(CACHEKEYS.FETCH_CHANNELS);
    if (response.data.status === "success") return true;
    return false;
  } catch (error) {
    return false;
  }
};

const getChannelDetailsByName = async (channelName) => {
  try {
    const response = await axios.get(`${API}/detail?name=${channelName}`);
    const data = response.data;
    if (data.status === "success") return data.payload;
    return null;
  } catch (error) {
    return null;
  }
};

const editchannel = async (channel, user) => {
  if (user.usertype === "s") {
    try {
      const channeltoedit = {
        ...channel,
        _id: channel["_id"],
      };
      const response = await axios.post(
        `${API}/edit`,
        {
          channel: channeltoedit,
        },
        {
          headers: _headers(user),
        }
      );
      const data = response.data;
      CacheService.remove(CACHEKEYS.FETCH_CHANNELS);
      if (data.payload.status === "failed") return null;
      return channeltoedit["_id"];
    } catch (error) {
      return null;
    }
  }
};

const isChannelnameAllowed = async (user, chName) => {
  try {
    await axios.post(
      `${API}/namecheck/${chName}`,
      {},
      {
        headers: _headers(user),
      }
    );
    return true;
  } catch (error) {
    return false;
  }
};

export {
  createChannel,
  getChannels,
  deleteChannel,
  getChannelDetailsByName,
  editchannel,
  isChannelnameAllowed,
};
