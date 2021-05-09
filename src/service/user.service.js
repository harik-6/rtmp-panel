import firebase from "firebase";
import sha1 from "sha1";

const UserService = {
  getUser: async (username, password) => {
    password = sha1(password);
    try {
      const db = firebase.firestore().collection("users");
      const snapshot = await db.get();
      const loggedUser = snapshot.docs
        .map((doc) => {
          const { username, password, channelLimit,userServer,rtmpProtocol,
            httpProtocol,httpPort,userStub,streamExt } = doc.data();
          return {
            userid: doc.id,
            username,
            password,
            channelLimit,
            userServer,
            rtmpProtocol,
            httpProtocol,
            httpPort,
            userStub,
            streamExt
          };
        })
        .filter((user) => user.username === username)[0];
      if (password === loggedUser.password) {
        delete loggedUser.password;
        return loggedUser;
      }
      return null;
    } catch (error) {
      // console.log("Error in getting user", error.message);
      return null;
    }
  },
  createChannel: async (user, channelname, key) => {
    try {
      const db = firebase.firestore().collection("channels");
      key = key.toLowerCase().replace(" ", "");
      channelname = channelname.toLowerCase().replace(" ", "");
      const { userServer,rtmpProtocol,httpProtocol,httpPort,userStub,streamExt } = user;
      let httpLink = `${httpProtocol}://${userServer}/hls/${key}.${streamExt}`;
      if(httpPort === "8080") {
        httpLink = `${httpProtocol}://${userServer}:${httpPort}/hls/${key}.${streamExt}`
      }
      const newchannel = {
        name: key,
        key: channelname,
        createat: new Date(),
        owner: user.username,
        ownerid: user.userid,
        server: userServer,
        displayStreamLink : `${rtmpProtocol}://${userServer}/${userStub}`,
        rtmpLink: `${rtmpProtocol}://${userServer}/${userStub}/${key}`,
        httpLink,
        token : `${key}?psk=${channelname}&token=${channelname}`
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
          const { server, name, key, createdat, owner, ownerid,rtmpLink,httpLink,
            token,displayStreamLink } = doc.data();
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
            channelId : doc.id
          };
        })
        .filter((channel) => channel.ownerid === user.userid);
    } catch (error) {
      // console.log("Error in getting channel", error.message);
      return null;
    }
  },
  editchannel: async (channel,user) => {
    try {
      const db = firebase.firestore().collection("channels");
      const channelname = channel.key.toLowerCase().replace(" ", "");
      const key = channel.name.toLowerCase().replace(" ", "");
      const { userServer,rtmpProtocol,httpProtocol,httpPort,userStub,streamExt } = user;
      let httpLink = `${httpProtocol}://${userServer}/hls/${key}.${streamExt}`;
      if(httpPort === "8080") {
        httpLink = `${httpProtocol}://${userServer}:${httpPort}/hls/${key}.${streamExt}`
      }
      await db.doc(channel.channelId).update({
        name : key,
        key : channelname,
        displayStreamLink : `${rtmpProtocol}://${userServer}/${userStub}`,
        rtmpLink: `${rtmpProtocol}://${userServer}/${userStub}/${key}`,
        httpLink,
        token : `${key}?psk=${channelname}&token=${channelname}`
      });
      return channel.id;
    } catch (error) {
      console.log("Error in editing channel", error.message);
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
};

export default UserService;
