import firebase from "firebase";
import axios from "axios";
const API = "http://localhost:9000/channel";
const ChannelService = {
  createChannel: async (user, channelname, settings) => {
    try {
      console.log("settings", settings);
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
      console.log("channel to create", newchannel);
      const response = await axios.post(`${API}/create`, {
        channel: newchannel,
      });
      console.log("payload from api", response.data.payload);
      if (response.data.status === "success") {
        return response.data.payload["_id"];
      }
      return null;
    } catch (error) {
      // console.log("Error in creating channel", error.message);
      return null;
    }
  },

  getAllTokens: async () => {
    try {
      const response = await axios.post(`${API}/keys`);
      console.log("list of all keys", response.data);
      if (response.data.status === "success") return response.data.payload;
      return null;
    } catch (error) {
      // console.log("Error in getting tokens", error.message);
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
      // console.log("Error in getting channel", error.message);
      return null;
    }
  },

  editchannel: async (channel, user, settings) => {
    try {
      console.log("user", user);
      const channelname = channel.key.toLowerCase().replace(" ", "");
      const key = channel.name.toLowerCase().replace(" ", "");
      const { server, port } = user;
      let httpLink = `https://${server}/hls/${key}.m3u8`;
      if (port !== 443) {
        httpLink = `http://${server}:8080/hls/${key}.m3u8`;
      }
      const channeltoedit = {
        _id: channel["_id"],
        name: key,
        key: channelname,
        displayStreamLink: `rtmp://${server}/${settings.stub}`,
        rtmpLink: `rtmp://${server}/${settings.stub}/${key}`,
        httpLink,
        token: `${channelname}?psk=${channelname}&token=${channelname}`,
      };
      console.log("Channel to edit", channeltoedit);
      const response = await axios.post(`${API}/edit`, {
        channel: channeltoedit,
      });
      const data = response.data;
      if (data.payload.status === "failed") return null;
      return channeltoedit["_id"];
    } catch (error) {
      // console.log("Error in editing channel", error.message);
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
      // console.log("Error in deleting channel", error.message);
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
      const db = firebase.firestore().collection("channels");
      const snapshot = await db.get();
      const filterted = snapshot.docs
        .map((doc) => {
          const { name, key, httpLink } = doc.data();
          return {
            name,
            key,
            httpLink,
          };
        })
        .filter((channel) => channel.name === channelName);
      if (filterted.length === 0) return null;
      return filterted[0].httpLink;
    } catch (error) {
      // console.log("Error in deleting channel", error.message);
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
      // console.log("error");
      return false;
    }
  },

  editchannelAdmin: async (channel) => {
    try {
      const db = firebase.firestore().collection("channels");
      const id = channel.channelId;
      delete channel.channelId;
      await db.doc(id).update(channel);
      return id;
    } catch (error) {
      // console.log("Error in editing channel", error.message);
      return null;
    }
  },

  changeRtmpStatus: async (channel) => {
    try {
      const response = await axios.post(`${API}/status`, {
        channelId: channel["_id"],
        status: !channel.status,
      });
      if(response.data.status === 200) return true;
      return false
    } catch (error) {
      // console.log("error");
      return false;
    }
  },
};

export default ChannelService;
