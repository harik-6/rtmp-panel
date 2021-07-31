import axios from "axios";
import CacheService from "./cache.service";
import CACHEKEYS from "../cacheKeys";
const API = `${process.env.REACT_APP_API}/api/channel`;

const _constructChannel = (user, channelname) => {
  const chname = channelname.toLowerCase().replace(" ", "");
  const server = user.server;
  const newchannel = {
    name: chname,
    key: chname,
    ownerid: user["_id"],
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

const createChannel = async (user, channelname) => {
  try {
    const newchannel = _constructChannel(user, channelname);
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
const editchannel = async (channel, user) => {
  // if (user["_id"] === process.env.REACT_APP_ADMINID) {
  //   try {
  //     const channeltoedit = {
  //       ...channel,
  //       _id: channel["_id"],
  //     };
  //     const response = await axios.post(`${API}/edit`, {
  //       channel: channeltoedit,
  //     });
  //     const data = response.data;
  //     CacheService.remove(CACHEKEYS.FETCH_CHANNELS);
  //     if (data.payload.status === "failed") return null;
  //     return channeltoedit["_id"];
  //   } catch (error) {
  //     return null;
  //   }
  // }
  return null;
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

const editchannelAdmin = async (channel, user) => {
  if (user["_id"] === process.env.REACT_APP_ADMINID) {
    try {
      const channeltoedit = {
        ...channel,
        _id: channel["_id"],
      };
      const response = await axios.post(`${API}/edit`, {
        channel: channeltoedit,
      },{
        headers : {
          "x-auth-id" : user["_id"]
        }
      });
      const data = response.data;
      CacheService.remove(CACHEKEYS.FETCH_CHANNELS);
      if (data.payload.status === "failed") return null;
      return channeltoedit["_id"];
    } catch (error) {
      return null;
    }
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
