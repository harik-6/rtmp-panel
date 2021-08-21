import sha1 from "sha1";
import axios from "axios";
import CacheService from "./cache.service";
import CACHEKEYS from "../cacheKeys";
const API = `${process.env.REACT_APP_API}/api/user`;

const _headers = (user) => {
  return {
    Authorization: `Bearer ${user.token}`,
  };
};

const getEditUserPayload = (editedUser, newpass) => {
  if (newpass.length !== 0) {
    return {
      ...editedUser,
      _id: editedUser["_id"],
      password: sha1(newpass),
    };
  }
  return editedUser;
};

const UserService = {
  getUser: async (username, password) => {
    CacheService.clear();
    password = sha1(password);
    try {
      const response = await axios.post(`${API}/auth`, {
        username,
        password,
      });
      const userdata = response.data;
      if (userdata.status === "failed") return null;
      const settings_response = await axios.post(`${API}/settings`,{},{
        headers : {
          Authorization: `Bearer ${userdata.payload.token}`,
        }
      })
      const settings_data = settings_response.data;
      if (settings_data.status === "failed") return null;
      console.log(settings_data);
      return {
        user : userdata.payload,
        settings : settings_data.payload.settings
      };
    } catch (error) {
      return null;
    }
  },
  getAllUsers: async (user) => {
    if (!user.admin) return [];
    try {
      const cachkey = CACHEKEYS.FETCH_USERS;
      const cachevalue = CacheService.get(cachkey);
      if (cachevalue !== null) return cachevalue;
      const response = await axios.post(
        `${API}/getall`,
        {
          userId: user["_id"],
        },
        {
          headers: {
            Authorization: `Bearer ${user["_id"]}`,
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
    if (adminUser.admin || false) {
      try {
        const { password, limit } = newuser;
        newuser["password"] = sha1(password);
        newuser["limit"] = parseInt(limit);
        const response = await axios.post(
          `${API}/create`,
          {
            user: newuser,
          },
          {
            headers: {
              Authorization: `Bearer ${adminUser["_id"]}`,
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
  editUser: async (adminUser, editedUser, newpassword = "") => {
    if (adminUser.admin) {
      try {
        editedUser["limit"] = parseInt(editedUser["limit"]);
        const response = await axios.post(
          `${API}/edit`,
          {
            user: getEditUserPayload(editedUser, newpassword),
          },
          {
            headers: {
              Authorization: `Bearer ${adminUser["_id"]}`,
            },
          }
        );
        CacheService.remove(CACHEKEYS.FETCH_USERS);
        if (response.data.status === "failed") return null;
        return editedUser;
      } catch (error) {
        return null;
      }
    }
    return null;
  },
  promoteDemoteAdmin: async (superAdmin, user) => {
    try {
      const response = await axios.post(
        `${API}/edit`,
        {
          user: user,
        },
        {
          headers: {
            Authorization: `Bearer ${superAdmin["_id"]}`,
          },
        }
      );
      CacheService.remove(CACHEKEYS.FETCH_USERS);
      if (response.data.status === "failed") return null;
      return user;
    } catch (error) {
      return null;
    }
  },
  deleteUser: async (adminUser, usertoDelete) => {
    if (adminUser.admin) {
      try {
        await axios.post(
          `${API}/delete`,
          {
            userId: usertoDelete["_id"],
          },
          {
            headers: {
              Authorization: `Bearer ${adminUser["_id"]}`,
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
