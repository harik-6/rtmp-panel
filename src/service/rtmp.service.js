import axios from "axios";
import CacheService from "./cache.service";
import CACHEKEYS from "../cacheKeys";
const API = `/api/channel`;
const API_RTMP = `/api/rtmp`;
const API_HEALTH = `/api/health`;

const changeRtmpStatus = async (channel, user) => {
  try {
    await axios.put(`${API}/status/${channel["id"]}`);
    CacheService.remove(CACHEKEYS.FETCH_CHANNELS);
    return true;
  } catch (error) {
    return false;
  }
};

const getBitrateMedata = async (server, user) => {
  try {
    const response = await axios.get(`${API_RTMP}/stat/${server}`);
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

export { changeRtmpStatus, getBitrateMedata };
