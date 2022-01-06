import sha1 from "sha1";
import axios from "axios";
import CacheService from "./cache.service";
import CACHEKEYS from "../cacheKeys";
const API = `/api/user`;
// const API = "http://localhost:8000/api/user";

const _getEditUserPayload = (editedUser, newpass) => {
  if (newpass.length !== 0) {
    return {
      ...editedUser,
      username: editedUser.username,
      password: sha1(newpass),
    };
  }
  return editedUser;
};

const getUser = async (username, password) => {
  CacheService.clear();
  password = sha1(password);
  try {
    const authResponse = await axios.get(`${API}`, {
      headers: {
        "x-header-authid": username,
        "x-header-ticket": password,
      },
    });
    const authData = authResponse.data;
    if (authData.status === "failed") return null;
    // let now = new Date();
    // now.setHours(now.getHours() + 2);
    // // now.setSeconds(now.getSeconds() + 10);
    // CacheService.set(CACHEKEYS.SESSION_AUTH_DATA, {
    //   eat: now,
    //   session: authData,
    // });
    return authData.payload;
  } catch (error) {
    return null;
  }
};

const getAllUsers = async (user) => {
  if (user.usertype === "u") return [];
  try {
    const cachkey = CACHEKEYS.FETCH_USERS;
    const cachevalue = CacheService.get(cachkey);
    if (cachevalue !== null) return cachevalue;
    const response = await axios.get(`${API}/${user["id"]}/users`);
    const data = response.data;
    if (data.payload.status === "failed") return [];
    CacheService.set(cachkey, data.payload);
    return data.payload;
  } catch (error) {
    return [];
  }
};

const createUser = async (admin, newuser) => {
  try {
    const { password } = newuser;
    newuser["password"] = sha1(password);
    newuser["owner"] = admin["id"];
    await axios.post(`${API}`, newuser);
    CacheService.remove(CACHEKEYS.FETCH_USERS);
    return "success";
  } catch (error) {
    return "failed";
  }
};

const editUser = async (admin, editedUser, newpassword = "") => {
  try {
    editedUser["limit"] = parseInt(editedUser["limit"]);
    const user = _getEditUserPayload(editedUser, newpassword);
    delete user["usertype"];
    await axios.put(`${API}`, user);
    CacheService.remove(CACHEKEYS.FETCH_USERS);
    return "success";
  } catch (error) {
    return "failed";
  }
};

const editUserPersonalDetails = async (user_to_edit) => {
  try {
    const user = _getEditUserPayload(user_to_edit, "");
    const response = await axios.put(`${API}`, user);
    CacheService.remove(CACHEKEYS.FETCH_USERS);
    if (response.data.status === "failed") return null;
    return user_to_edit;
  } catch (error) {
    return null;
  }
};

const deleteUser = async (admin, usertoDelete) => {
  try {
    await axios.delete(`${API}/${usertoDelete["id"]}`);
    CacheService.remove(CACHEKEYS.FETCH_USERS);
    return true;
  } catch (error) {
    return false;
  }
};

const promoteDemoteAdmin = async (user) => {
  try {
    await axios.put(`${API}`, {
      ...user,
      admin: !user.admin,
    });
    CacheService.remove(CACHEKEYS.FETCH_USERS);
    return "success";
  } catch (error) {
    return "failed";
  }
};

export {
  getUser,
  getAllUsers,
  createUser,
  editUser,
  deleteUser,
  promoteDemoteAdmin,
  editUserPersonalDetails,
};
