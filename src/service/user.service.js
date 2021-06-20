import firebase from "firebase";
import sha1 from "sha1";
import axios from "axios";

const isAdmin = (id) => id === process.env.REACT_APP_ADMINID;

const UserService = {
  getUser: async (username, password) => {
    password = sha1(password);
    try {
      const response = await axios.post("http://localhost:9000/user/get", {
        username,
        password,
      });
      const data = response.data;
      if (data.payload.status === "failed") return null;
      return data.payload;
    } catch (error) {
      console.log("Error in getting user", error);
      return null;
    }
  },
  getUsageData: async (user) => {
    try {
      const db = firebase.firestore().collection("usage");
      const snapshot = await db.get();
      const filtered = snapshot.docs
        .map((doc) => {
          const { ownwerId, updatedAt, usage } = doc.data();
          return {
            ownwerId,
            date: new Date(updatedAt),
            usage,
          };
        })
        .filter((usagedata) => usagedata.ownwerId === user.userid);
      if (filtered.length === 0) {
        return null;
      }
      let mapped = {};
      filtered.forEach((obj) => {
        const date = obj.date;
        const key =
          date.getFullYear() +
          "" +
          String(date.getMonth()).padStart(2, "0") +
          "" +
          date.getDate();
        mapped[key] = obj;
      });
      return mapped;
    } catch (error) {
      console.log(error);
      return null;
    }
  },
  getAllUsers: async (user) => {
    if (!isAdmin(user["_id"])) {
      return [];
    }
    try {
      const db = firebase.firestore().collection("users");
      const snapshot = await db.get();
      const allusers = snapshot.docs.map((doc) => {
        const {
          username,
          password,
          channelLimit,
          userServer,
          httpProtocol,
          httpPort,
          userStub,
          streamExt,
          billinDate,
          showUsage,
        } = doc.data();
        return {
          userid: doc.id,
          username,
          password,
          channelLimit,
          userServer,
          httpProtocol,
          httpPort,
          userStub,
          streamExt,
          billinDate,
          showUsage,
        };
      });
      return allusers;
    } catch (error) {
      return [];
    }
  },
  createUser: async (adminUser, newuser) => {
    if (isAdmin(adminUser["_id"])) {
      try {
        const db = firebase.firestore().collection("users");
        const password = newuser["password"];
        newuser["password"] = sha1(password);
        if (newuser["httpProtocol"] === "https") {
          newuser["httpPort"] = "443";
        }
        await db.add(newuser);
        return newuser;
      } catch (error) {
        return null;
      }
    }
    return null;
  },
  editUser: async (adminUser, editeduser) => {
    if (isAdmin(adminUser["_id"])) {
      try {
        const db = firebase.firestore().collection("users");
        if (editeduser["httpProtocol"] === "https") {
          editeduser["httpPort"] = "443";
        }
        const userid = editeduser.userid;
        delete editeduser.userid;
        await db.doc(userid).update(editeduser);
        return editeduser;
      } catch (error) {
        return null;
      }
    }
    return null;
  },
  deleteUser: async (adminUser, usertoDelete) => {
    if (isAdmin(adminUser["_id"])) {
      try {
        const db = firebase.firestore().collection("users");
        await db.doc(usertoDelete.userid).delete();
        return true;
      } catch (error) {
        // console.log("Error in deleting channel", error.message);
        return false;
      }
    }
  },
};

export default UserService;
