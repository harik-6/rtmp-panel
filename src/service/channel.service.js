import firebase from "firebase";
import axios from "axios";

const ChannelService = {
  createChannel: async (user, channelname) => {
    try {
      channelname = channelname.toLowerCase().replace(" ", "");
      const { server, port, stub } = user;
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
        displayStreamLink: `rtmp://${server}/${stub}`,
        rtmpLink: `rtmp://${server}/${stub}/${channelname}`,
        httpLink,
        token: `${channelname}?psk=${channelname}&token=${channelname}`,
        status: true,
      };
      const response = await axios.post("http://localhost:9000/channel/create",{
        channel : newchannel
      })
      if(response.data.status === "success") {
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
      const db = firebase.firestore().collection("channels");
      const snapshot = await db.get();
      const names = snapshot.docs.map((doc) => doc.data().name);
      const keys = snapshot.docs.map((doc) => doc.data().key);
      return [...names, ...keys];
    } catch (error) {
      // console.log("Error in getting tokens", error.message);
      return null;
    }
  },

  getChannels: async (user) => {
    try {
      const response = await axios.post("http://localhost:9000/channel/get", {
        ownerid: user["_id"],
      });
      const data = response.data;
      return data.payload || [];
    } catch (error) {
      // console.log("Error in getting channel", error.message);
      return null;
    }
  },

  editchannel: async (channel, user) => {
    try {
      const db = firebase.firestore().collection("channels");
      const channelname = channel.key.toLowerCase().replace(" ", "");
      const key = channel.name.toLowerCase().replace(" ", "");
      const { userServer, httpProtocol, httpPort, userStub, streamExt } = user;
      let httpLink = `${httpProtocol}://${userServer}/hls/${key}.${streamExt}`;
      if (httpPort === "8080") {
        httpLink = `${httpProtocol}://${userServer}:${httpPort}/hls/${key}.${streamExt}`;
      }
      await db.doc(channel.channelId).update({
        name: key,
        key: channelname,
        displayStreamLink: `rtmp://${userServer}/${userStub}`,
        rtmpLink: `rtmp://${userServer}/${userStub}/${key}`,
        httpLink,
        token: `${key}?psk=${channelname}&token=${channelname}`,
      });
      return channel.id;
    } catch (error) {
      // console.log("Error in editing channel", error.message);
      return null;
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

  deleteChannel: async (channel) => {
    try {
      const db = firebase.firestore().collection("channels");
      await db.doc(channel.channelId).delete();
      return true;
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

  changeRtmpStatus: async (channel) => {
    try {
      const db = firebase.firestore().collection("channels");
      await db.doc(channel.channelId).update({
        status: !channel.status,
      });
    } catch (error) {
      // console.log("error");
      return false;
    }
  },
};

export default ChannelService;
