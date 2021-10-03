import { useReducer } from "react";
import AppReducer from "./reducer";
import AppContext from "./context";
import CacheService from "../service/cache.service";
const initialState = {
  appName: "StreamWell",
  appDesc: "Dedicated streaming server provider.",
  channels: null,
  healthList: null,
  allUsers: [],
  usageData: null,
  avatarApi: "https://avatars.dicebear.com/api/initials/",
  user: {
    username: "",
    usertype: "u",
    token: null,
    limit: 1,
    access: [],
    email: "",
    server: "",
    admin: false,
  },
};

const AppState = (props) => {
  const [state, dispatch] = useReducer(AppReducer, initialState);

  const setChannles = (channels) => {
    dispatch({
      type: "setchannels",
      payload: channels,
    });
  };

  const logout = () => {
    CacheService.clear();
    dispatch({
      type: "logout",
      payload: null,
    });
  };

  const setHealth = (hlist) => {
    dispatch({
      type: "sethealth",
      payload: hlist,
    });
  };

  const setAllUsers = (uList) => {
    dispatch({
      type: "setallusers",
      payload: uList,
    });
  };

  const setUsageData = (usage) => {
    dispatch({
      type: "setusagedata",
      payload: usage,
    });
  };

  const setAppName = (appNameAndDesc) => {
    dispatch({
      type: "setappname",
      payload: appNameAndDesc,
    });
  };

  return (
    <AppContext.Provider
      value={{
        ...state,
        dispatch,
        actions: {
          setChannles,
          logout,
          setHealth,
          setAllUsers,
          setUsageData,
          setAppName,
        },
      }}
    >
      {props.children}
    </AppContext.Provider>
  );
};

export default AppState;
