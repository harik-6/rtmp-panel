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
      username: editedUser.username,
      password: sha1(newpass),
    };
  }
  return {
    username: editedUser.username,
  };
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
      const settings_response = await axios.post(
        `${API}/settings`,
        {},
        {
          headers: {
            Authorization: `Bearer ${userdata.payload.token}`,
          },
        }
      );
      const settings_data = settings_response.data;
      if (settings_data.status === "failed") return null;
      console.log(settings_data);
      return {
        user: userdata.payload,
        settings: settings_data.payload.settings,
      };
    } catch (error) {
      return null;
    }
  },
  getAllUsers: async (user) => {
    if (user.usertype === "u") return [];
    try {
      const cachkey = CACHEKEYS.FETCH_USERS;
      const cachevalue = CacheService.get(cachkey);
      if (cachevalue !== null) return cachevalue;
      const response = await axios.post(
        `${API}/users`,
        {},
        {
          headers: _headers(user),
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
  createUser: async (admin, newuser) => {
    try {
      const { password } = newuser;
      newuser["password"] = sha1(password);
      const response = await axios.post(
        `${API}/create`,
        {
          user: newuser,
        },
        {
          headers: _headers(admin),
        }
      );
      CacheService.remove(CACHEKEYS.FETCH_USERS);
      const data = response.data;
      return data.payload;
    } catch (error) {
      return null;
    }
  },
  editUser: async (admin, editedUser, newpassword = "") => {
    try {
      editedUser["limit"] = parseInt(editedUser["limit"]);
      const { server, limit, bitrate, preview, usage, token } = editedUser;
      const body = {
        user: getEditUserPayload(editedUser, newpassword),
        settings: {
          server,
          limit,
          bitrate,
          preview,
          usage,
        },
        token,
      };
      // console.log("Request body",body);
      // return null;
      const response = await axios.post(`${API}/edit`, body, {
        headers: _headers(admin),
      });
      CacheService.remove(CACHEKEYS.FETCH_USERS);
      if (response.data.status === "failed") return null;
      return editedUser;
    } catch (error) {
      return null;
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
  deleteUser: async (admin, usertoDelete) => {
    try {
      await axios.post(
        `${API}/delete`,
        {
          token: usertoDelete.token,
        },
        {
          headers: _headers(admin),
        }
      );
      CacheService.remove(CACHEKEYS.FETCH_USERS);
      return true;
    } catch (error) {
      return false;
    }
  },
};

export default UserService;
