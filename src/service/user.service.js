import firebase from "firebase";
import sha1 from "sha1";

// channels = {
//   rtmpUrl,
//   streamuUrl,
//   name,
//   key,
//   createat,
//   owner,
// };
// users = {
//   username,
//   password,
//   userid
// }
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
          };
        })
        .filter((user) => user.username === username)[0];
      if (password === loggedUser.password) {
        delete loggedUser.password;
        return loggedUser;
      }
      return null;
    } catch {
      return null;
    }
  },
  createChannel: async (user, channelname, key) => {
    try {
      const db = firebase.firestore().collection("channels");
      const newchannel = {
        rtmpUrl: "",
        streamuUrl: "",
        name: channelname,
        key,
        createat: new Date().toUTCString(),
        owner: user.username,
      };
    } catch {
      return null;
    }
  },
};

export default UserService;
