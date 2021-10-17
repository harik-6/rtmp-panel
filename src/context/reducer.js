import Actions from "./actions";

const initialState = {
  app: {
    name: "",
    phone: "",
  },
  channels: [],
  servers: [],
  healths: {},
  views: {},
  users: [],
  alert: {
    show: false,
    type: "",
    message: "",
  },
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
      return {
        ...state,
        app: payload,
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
    case Actions.SHOW_ALERT:
      return {
        ...state,
        alert: {
          ...payload,
          show: true,
        },
      };
    case Actions.HIDE_ALERT:
      return {
        ...state,
        alert: {
          show: false,
          type: "",
          message: "",
        },
      };
    case Actions.SET_USER_LIST:
      return {
        ...state,
        users: payload,
      };
    case "logout":
      return initialState;
    default:
      return state;
  }
};

export { initialState };

export default AppReducer;
