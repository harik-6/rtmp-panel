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
    ownerid: user["id"],
  };
  return newchannel;
};

const createChannel = async (user, channelname, server) => {
  try {
    const newchannel = _constructChannel(user, channelname, server);
    await axios.post(`${API}`, newchannel);
    CacheService.remove(CACHEKEYS.FETCH_CHANNELS);
    return "success";
  } catch (error) {
    return "failed";
  }
};

const getChannels = async (user) => {
  try {
    const response = await axios.get(`${API}/${user.id}`);
    const data = response.data.payload || [];
    data.sort((a, b) => a.name.localeCompare(b.name));
    return data;
  } catch (error) {
    throw new Error(error.message);
  }
};

// const getChannels = (user) => {
//   return axios.get(`${API}/${user.id}`);
// };

const deleteChannel = async (channelid) => {
  try {
    await axios.delete(`${API}/${channelid}`);
    CacheService.remove(CACHEKEYS.FETCH_CHANNELS);
    return true;
  } catch (error) {
    return false;
  }
};

const getChannelDetailsByName = async (channelName) => {
  try {
    const response = await axios.get(`${API}/detail/${channelName}`);
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
      await axios.put(`${API}`, channel);
      CacheService.remove(CACHEKEYS.FETCH_CHANNELS);
      return "success";
    } catch (error) {
      return "failed";
    }
  }
  return "failed";
};

export {
  createChannel,
  getChannels,
  deleteChannel,
  getChannelDetailsByName,
  editchannel,
};
