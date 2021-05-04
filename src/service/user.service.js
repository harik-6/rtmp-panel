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
          const { username, password, channelLimit } = doc.data();
          return {
            userid: doc.id,
            username,
            password,
            channelLimit,
          };
        })
        .filter((user) => user.username === username)[0];
      if (password === loggedUser.password) {
        delete loggedUser.password;
        return loggedUser;
      }
      return null;
    } catch (error) {
      console.log("Error in getting user", error.message);
      return null;
    }
  },
  createChannel: async (user, channelname, key) => {
    try {
      const db = firebase.firestore().collection("channels");
      const newchannel = {
        name: channelname.toLowerCase(),
        key: key.toLowerCase(),
        createat: new Date(),
        owner: user.username,
        ownerid: user.userid,
        server: process.env.REACT_APP_RTMP_SERVER,
      };
      const savedchannel = await db.add(newchannel);
      return savedchannel.id;
    } catch (error) {
      console.log("Error in creating channel", error.message);
      return null;
    }
  },
  getChannels: async (user) => {
    try {
      const db = firebase.firestore().collection("channels");
      const snapshot = await db.get();
      return snapshot.docs
        .map((doc) => {
          const { server, name, key, createdat, owner, ownerid } = doc.data();
          return {
            name,
            key,
            createdat,
            owner,
            ownerid,
            server,
            authToken: doc.id,
          };
        })
        .filter((channel) => channel.ownerid === user.userid);
    } catch (error) {
      console.log("Error in getting channel", error.message);
      return null;
    }
  },
  editchannel: async (channel) => {
    try {
      const db = firebase.firestore().collection("channels");
      await db.doc(channel.authToken).update({
        name: channel.name,
        key: channel.key,
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
      await db.doc(channel.authToken).delete();
      return true;
    } catch (error) {
      console.log("Error in deleting channel", error.message);
      return false;
    }
  },
};

export default UserService;
