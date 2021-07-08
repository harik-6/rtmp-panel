import sha1 from "sha1";
import axios from "axios";
import CacheService from "./cache.service";
import CACHEKEYS from "../cacheKeys";
const API = `${process.env.REACT_APP_API}/api/user`;

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
      const cachkey = CACHEKEYS.FETCH_USERS;
      const cachevalue = CacheService.get(cachkey);
      if (cachevalue !== null) return cachevalue;
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
      CacheService.set(cachkey, data.payload);
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
        CacheService.remove(CACHEKEYS.FETCH_USERS);
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
        CacheService.remove(CACHEKEYS.FETCH_USERS);
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
        CacheService.remove(CACHEKEYS.FETCH_USERS);
        return true;
      } catch (error) {
        return false;
      }
    }
  },
};

export default UserService;
