const AppReducer = (state, action) => {
  const { type, payload } = action;
  switch (type) {
    case "logout":
      return {
        ...state,
        channels: null,
        healthList: null,
        allUsers: [],
        usageData: null,
        user: {
          username: "streamwell",
          usertype: "u",
          token: null,
        },
      };
    case "setlogin":
      return {
        ...state,
        user: payload.user
      };
    case "setchannels":
      return {
        ...state,
        channels: payload,
      };
    case "sethealth":
      return {
        ...state,
        healthList: payload,
      };
    case "setallusers":
      return {
        ...state,
        allUsers: payload,
      };
    case "setusagedata":
      return {
        ...state,
        usageData: payload,
      };
    case "setappname":
      return {
        ...state,
        appName: payload.name,
        appDesc: payload.desc,
      };
    case "superadmin":
      return {
        ...state,
        superAdmin: true,
      };
    default:
      return state;
  }
};

export default AppReducer;
