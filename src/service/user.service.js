import firebase from "firebase";
import sha1 from "sha1";
import axios from "axios";
const API = "http://localhost:9000/user";

const isAdmin = (id) => id === process.env.REACT_APP_ADMINID;

const UserService = {
  getUser: async (username, password) => {
    password = sha1(password);
    try {
      const response = await axios.post(`${API}/get`, {
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
  getAllUsers: async (user) => {
    if (!isAdmin(user["_id"])) return [];
    try {
      const response = await axios.post(
        `${API}/get`,
        {},
        {
          headers: {
            "x-auth-id": user["_id"],
          },
        }
      );
      const data = response.data;
      if (data.payload.status === "failed") return [];
      console.log(data);
      return data.payload;
    } catch (error) {
      console.log("Error in getting user", error);
      return [];
    }
  },
  createUser: async (adminUser, newuser) => {
    if (isAdmin(adminUser["_id"])) {
      try {
        const { password, billingDate, limit, port } = newuser;
        newuser["password"] = sha1(password);
        newuser["billingDate"] = parseInt(billingDate);
        newuser["limit"] = parseInt(limit);
        newuser["port"] = parseInt(port);
        const response = await axios.post(
          `${API}/create`,
          {
            user: newuser,
            settings: newuser,
          },
          {
            headers: {
              "x-auth-id": adminUser["_id"],
            },
          }
        );
        const data = response.data;
        return data.payload;
      } catch (error) {
        return null;
      }
    }
    return null;
  },
  editUser: async (adminUser, editeduserandsettings) => {
    if (isAdmin(adminUser["_id"])) {
      try {
        editeduserandsettings["billingDate"] = parseInt(
          editeduserandsettings["billingDate"]
        );
        editeduserandsettings["limit"] = parseInt(
          editeduserandsettings["limit"]
        );
        editeduserandsettings["port"] = parseInt(editeduserandsettings["port"]);
        const {
          username,
          server,
          port,
          limit,
          stub,
          bitrate,
          usage,
          billingDate,
        } = editeduserandsettings;
        console.log(editeduserandsettings);
        const response = await axios.post(
          `${API}/edit`,
          {
            user: {
              _id: editeduserandsettings["_id"],
              username,
              server,
              port,
            },
            settings: {
              limit,
              stub,
              bitrate,
              usage,
              billingDate,
              userid: editeduserandsettings["_id"],
            },
          },
          {
            headers: {
              "x-auth-id": adminUser["_id"],
            },
          }
        );
        if (response.data.status === "failed") return null;
        return editeduserandsettings;
      } catch (error) {
        return null;
      }
    }
    return null;
  },
  deleteUser: async (adminUser, usertoDelete) => {
    if (isAdmin(adminUser["_id"])) {
      try {
        await axios.post(
          `${API}/delete`,
          {
            userId: usertoDelete["_id"],
          },
          {
            headers: {
              "x-auth-id": adminUser["_id"],
            },
          }
        );
        return true;
      } catch (error) {
        // console.log("Error in deleting channel", error.message);
        return false;
      }
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
};

export default UserService;
