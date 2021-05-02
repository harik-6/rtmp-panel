import { useReducer } from "react";
import AppReducer from "./reducer";
import AppContext from "./context";
const initialState = {
  user: null,
  channels: [],
};

const AppState = (props) => {
  const [state, dispatch] = useReducer(AppReducer, initialState);

  const loginUser = (user) => {
    dispatch({
      type: "setlogin",
      payload: user,
    });
  };

  const loadChannels = (channels) => {
    dispatch({
      type: "setchannels",
      payload: channels,
    });
  };

  const logout = () => {
    dispatch({
      type: "logout",
    });
  };

  return (
    <AppContext.Provider
      value={{
        ...state,
        actions: {
          loginUser,
          loadChannels,
          logout,
        },
      }}
    >
      {props.children}
    </AppContext.Provider>
  );
};

export default AppState;
