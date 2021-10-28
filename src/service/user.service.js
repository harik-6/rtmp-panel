import sha1 from "sha1";
import axios from "axios";
import CacheService from "./cache.service";
import CACHEKEYS from "../cacheKeys";
const API = `/api/user`;

const _headers = (user) => {
  return {
    Authorization: `Bearer ${user.token}`,
  };
};

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
    const authResponse = await axios.post(`${API}/auth`, {
      username,
      password,
    });
    const authData = authResponse.data;
    if (authData.status === "failed") return null;
    const userResponse = await axios.post(
      `${API}/get`,
      {},
      {
        headers: _headers(authData.payload),
      }
    );
    const userData = userResponse.data;
    const user = userData.payload.user;
    return {
      ...user,
      ...authData.payload,
    };
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
    const response = await axios.post(
      `${API}/all`,
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
};

const isUsernameAllowed = async (admin, username) => {
  try {
    await axios.post(
      `${API}/namecheck/${username}`,
      {},
      {
        headers: _headers(admin),
      }
    );
    return true;
  } catch (error) {
    return false;
  }
};

const createUser = async (admin, newuser) => {
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
};

const editUser = async (admin, editedUser, newpassword = "") => {
  try {
    editedUser["limit"] = parseInt(editedUser["limit"]);
    const body = {
      user: _getEditUserPayload(editedUser, newpassword),
      token: editedUser["token"],
    };
    const response = await axios.post(`${API}/edit`, body, {
      headers: _headers(admin),
    });
    CacheService.remove(CACHEKEYS.FETCH_USERS);
    if (response.data.status === "failed") return null;
    return editedUser;
  } catch (error) {
    return null;
  }
};

const editUserPersonalDetails = async (user_to_edit) => {
  try {
    const body = {
      user: _getEditUserPayload(user_to_edit, ""),
      token: user_to_edit["token"],
    };
    const response = await axios.post(`${API}/edit`, body, {
      headers: _headers(user_to_edit),
    });
    CacheService.remove(CACHEKEYS.FETCH_USERS);
    if (response.data.status === "failed") return null;
    return user_to_edit;
  } catch (error) {
    return null;
  }
};

const deleteUser = async (admin, usertoDelete) => {
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
};

const promoteDemoteAdmin = async (admin, status, token) => {
  try {
    const response = await axios.post(
      `${API}/edit`,
      {
        user: {
          admin: !status,
        },
        token,
      },
      {
        headers: _headers(admin),
      }
    );
    CacheService.remove(CACHEKEYS.FETCH_USERS);
    if (response.data.status === "failed") return null;
    return token;
  } catch (error) {
    return null;
  }
};

export {
  getUser,
  getAllUsers,
  createUser,
  editUser,
  deleteUser,
  promoteDemoteAdmin,
  isUsernameAllowed,
  editUserPersonalDetails,
};
