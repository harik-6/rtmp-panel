import Actions from "./actions";

const initialState = {
  appName: "StreamWell",
  appDesc: "Dedicated streaming server provider.",
  channels: [],
  servers: [],
  healths: {},
  views: {},
  users: [],
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

const AppReducer = (state, action) => {
  const { type, payload } = action;
  switch (type) {
    case Actions.SET_USER:
      return {
        ...state,
        user: payload,
      };
    case Actions.SET_APPNAME:
      const { appName, appDesc } = payload;
      return {
        ...state,
        appName,
        appDesc,
      };
    case Actions.SET_CHANNEL_LIST:
      return {
        ...state,
        channels: payload,
      };
    case Actions.SET_SERVER_LIST:
      return {
        ...state,
        servers: payload,
      };
    case "logout":
      return initialState;
    default:
      return state;
  }
};

export { initialState };

export default AppReducer;
