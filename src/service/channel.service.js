import firebase from "firebase";

const ChannelService = {
  createChannel: async (user, channelname, key) => {
    try {
      const db = firebase.firestore().collection("channels");
      key = key.toLowerCase().replace(" ", "");
      channelname = channelname.toLowerCase().replace(" ", "");
      const {
        userServer,
        rtmpProtocol,
        httpProtocol,
        httpPort,
        userStub,
        streamExt,
      } = user;
      let httpLink = `${httpProtocol}://${userServer}/hls/${key}.${streamExt}`;
      if (httpPort === "8080") {
        httpLink = `${httpProtocol}://${userServer}:${httpPort}/hls/${key}.${streamExt}`;
      }
      const newchannel = {
        name: key,
        key: channelname,
        createat: new Date(),
        owner: user.username,
        ownerid: user.userid,
        server: userServer,
        displayStreamLink: `${rtmpProtocol}://${userServer}/${userStub}`,
        rtmpLink: `${rtmpProtocol}://${userServer}/${userStub}/${key}`,
        httpLink,
        token: `${key}?psk=${channelname}&token=${channelname}`,
      };
      const savedchannel = await db.add(newchannel);
      return savedchannel.id;
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
      const db = firebase.firestore().collection("channels");
      const snapshot = await db.get();
      return snapshot.docs
        .map((doc) => {
          const {
            server,
            name,
            key,
            createdat,
            owner,
            ownerid,
            rtmpLink,
            httpLink,
            token,
            displayStreamLink,
          } = doc.data();
          return {
            name,
            key,
            createdat,
            owner,
            ownerid,
            server,
            rtmpLink,
            httpLink,
            token,
            displayStreamLink,
            channelId: doc.id,
          };
        })
        .filter((channel) => channel.ownerid === user.userid)
        .sort((a, b) => new Date(a.createdat) - new Date(b.createdat));
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
      const {
        userServer,
        rtmpProtocol,
        httpProtocol,
        httpPort,
        userStub,
        streamExt,
      } = user;
      let httpLink = `${httpProtocol}://${userServer}/hls/${key}.${streamExt}`;
      if (httpPort === "8080") {
        httpLink = `${httpProtocol}://${userServer}:${httpPort}/hls/${key}.${streamExt}`;
      }
      await db.doc(channel.channelId).update({
        name: key,
        key: channelname,
        displayStreamLink: `${rtmpProtocol}://${userServer}/${userStub}`,
        rtmpLink: `${rtmpProtocol}://${userServer}/${userStub}/${key}`,
        httpLink,
        token: `${key}?psk=${channelname}&token=${channelname}`,
      });
      return channel.id;
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
      if(filterted.length===0) return null;
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
};

export default ChannelService;
