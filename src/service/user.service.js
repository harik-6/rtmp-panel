import sha1 from "sha1";
import axios from "axios";
import CacheService from "./cache.service";
import CACHEKEYS from "../cacheKeys";
const API = `${process.env.REACT_APP_API}/api/user`;
const API_RTMP = `${process.env.REACT_APP_API}/api/rtmp`;

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
      return data.payload;
    } catch (error) {
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
        return false;
      }
    }
  },
  getUsageData: async (usersetting) => {
    const { settings } = usersetting;
    if (settings !== undefined) {
      console.log(settings);
      const cachkey = CACHEKEYS.FETCH_USAGE + "#" + settings["usageid"];
      const cachevalue = CacheService.get(cachkey);
      if (cachevalue !== null) return cachevalue;
      try {
        const response = await axios.post(`${API_RTMP}/usage`, {
          usageId: settings["usageid"],
        });
        const data = response.data;
        console.log("data", data);
        if (data.status === "failed") return null;
        if (data.payload.length === 0) return null;
        let mapped = {};
        data.payload.forEach((obj) => {
          const date = obj.date;
          const key =
            date.getFullYear() +
            "" +
            String(date.getMonth()).padStart(2, "0") +
            "" +
            date.getDate();
          mapped[key] = obj;
        });
        CacheService.set(cachkey, mapped);
        return mapped;
      } catch (error) {
        return null;
      }
    }
  },
};

export default UserService;
