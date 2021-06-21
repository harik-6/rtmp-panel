import axios from "axios";
const API = "http://localhost:9000/channel";
const API_RTMP = "http://localhost:9000/rtmp";

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

const ChannelService = {
  createChannel: async (user, channelname, settings) => {
    try {
      const newchannel = _constructChannel(user, channelname, settings);
      const response = await axios.post(`${API}/create`, {
        channel: newchannel,
      });
      if (response.data.status === "success") {
        return response.data.payload["_id"];
      }
      return null;
    } catch (error) {
      return null;
    }
  },
  editchannel: async (channel, user, settings) => {
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
      if (data.payload.status === "failed") return null;
      return channeltoedit["_id"];
    } catch (error) {
      return null;
    }
  },
  getAllTokens: async () => {
    try {
      const response = await axios.post(`${API}/keys`);
      if (response.data.status === "success") return response.data.payload;
      return null;
    } catch (error) {
      return null;
    }
  },
  getChannels: async (user) => {
    try {
      const response = await axios.post(`${API}/get`, {
        ownerid: user["_id"],
      });
      const data = response.data;
      return data.payload || [];
    } catch (error) {
      return null;
    }
  },
  deleteChannel: async (channel) => {
    try {
      const response = await axios.post(`${API}/delete`, {
        channelId: channel["_id"],
      });
      if (response.data.status === "success") return true;
      return false;
    } catch (error) {
      return false;
    }
  },
  rebootServer: async (channel) => {
    const url = `https://${channel.server}/sys_reboot?psk=${channel.key}&token=${channel.key}`;
    try {
      await fetch(url);
      return;
    } catch (error) {
      return;
    }
  },
  getChannelDetailsByName: async (channelName) => {
    try {
      const response = await axios.get(`${API}/detail?name=${channelName}`);
      const data = response.data;
      if(data.status === "success") return data.payload;
      return null;
    } catch (error) {
      return null;
    }
  },
  checkChannelHealth: async (channel) => {
    try {
      const response = await fetch(channel.httpLink);
      if (response.status >= 200 && response.status <= 205) {
        return true;
      } else {
        return false;
      }
    } catch (error) {
      return false;
    }
  },
  editchannelAdmin: async (channel) => {
    try {
      const response = await axios.post(`${API}/edit`, {
        channel,
      });
      const data = response.data;
      if (data.payload.status === "failed") return null;
      return channel["_id"];
    } catch (error) {
      return null;
    }
  },
  changeRtmpStatus: async (channel) => {
    try {
      const response = await axios.post(`${API}/edit`, {
        channel: {
          ...channel,
          status: !channel.status,
        },
      });
      const data = response.data;
      if (data.payload.status === "failed") return false;
      return true;
    } catch (error) {
      return false;
    }
  },
  getBitrateMedata : async (httplink) => {
    try {
      const response = await axios.post(`${API_RTMP}/metadata`,{
        surl : httplink
      });
      const data = response.data;
      if(data.status === "success") return data.payload;
      return null;
    }catch(error) {
      console.log(error);
      return null;
    }
  }
};

export default ChannelService;
