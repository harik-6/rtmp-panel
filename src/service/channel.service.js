import axios from "axios";
import CacheService from "./cache.service";
import CACHEKEYS from "../cacheKeys";
const API = `${process.env.REACT_APP_API}/api/channel`;

const _constructChannel = (user, channelname, settings) => {
  channelname = channelname.toLowerCase().replace(" ", "");
  const { server, port } = user;
  let httpLink = `https://${server}/hls/${channelname}.m3u8`;
  if (port !== 443) {
    httpLink = `http://${server}:8080/hls/${channelname}.m3u8`;
  }
  const newchannel = {
    name: channelname,
    key: channelname,
    owner: user.username,
    ownerid: user["_id"],
    server,
    displayStreamLink: `rtmp://${server}/${settings.stub}`,
    rtmpLink: `rtmp://${server}/${settings.stub}/${channelname}`,
    httpLink,
    token: `${channelname}?psk=${channelname}&token=${channelname}`,
    status: true,
  };
  return newchannel;
};

const createChannel = async (user, channelname, settings) => {
  try {
    const newchannel = _constructChannel(user, channelname, settings);
    const response = await axios.post(`${API}/create`, {
      channel: newchannel,
    });
    CacheService.remove(CACHEKEYS.FETCH_CHANNELS);
    if (response.data.status === "success") {
      return response.data.payload["_id"];
    }
    return null;
  } catch (error) {
    return null;
  }
};
const editchannel = async (channel, user, settings) => {
  try {
    const chconstructed = _constructChannel(user, channel.name, settings);
    const channeltoedit = {
      ...chconstructed,
      _id: channel["_id"],
    };
    const response = await axios.post(`${API}/edit`, {
      channel: channeltoedit,
    });
    const data = response.data;
    CacheService.remove(CACHEKEYS.FETCH_CHANNELS);
    if (data.payload.status === "failed") return null;
    return channeltoedit["_id"];
  } catch (error) {
    return null;
  }
};
const getAllTokens = async () => {
  try {
    const response = await axios.post(`${API}/keys`);
    if (response.data.status === "success") return response.data.payload;
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
    console.log("Channles in cache",cachevalue);
    console.log("Calling backend");
    const response = await axios.post(
      `${API}/get`,
      {
        ownerid: user["_id"],
      },
      {
        headers: {
          "x-auth-id": user["_id"],
        },
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
const deleteChannel = async (channel) => {
  try {
    const response = await axios.post(`${API}/delete`, {
      channelId: channel["_id"],
    });
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

const editchannelAdmin = async (channel) => {
  try {
    const response = await axios.post(`${API}/edit`, {
      channel,
    });
    const data = response.data;
    CacheService.remove(CACHEKEYS.FETCH_CHANNELS);
    if (data.payload.status === "failed") return null;
    return channel["_id"];
  } catch (error) {
    return null;
  }
};

export {
  createChannel,
  getAllTokens,
  getChannels,
  deleteChannel,
  getChannelDetailsByName,
  editchannelAdmin,
  editchannel,
};
