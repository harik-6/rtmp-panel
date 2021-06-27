import { useReducer } from "react";
import AppReducer from "./reducer";
import AppContext from "./context";
const initialState = {
  appName : "StreamWell",
  appDesc : "While Stream is well, All is Well.",
  user: null,
  channels: null,
  settings: null,
  healthList: null,
  allUsers: [],
  usageData: null,
};

const AppState = (props) => {
  const [state, dispatch] = useReducer(AppReducer, initialState);

  const loginUser = (user) => {
    dispatch({
      type: "setlogin",
      payload: user,
    });
  };

  const setChannles = (channels) => {
    dispatch({
      type: "setchannels",
      payload: channels,
    });
  };

  const logout = () => {
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
        actions: {
          loginUser,
          setChannles,
          logout,
          setHealth,
          setAllUsers,
          setUsageData,
          setAppName
        },
      }}
    >
      {props.children}
    </AppContext.Provider>
  );
};

export default AppState;
