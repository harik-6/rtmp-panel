const AppReducer = (state, action) => {
  const { type, payload } = action;
  switch (type) {
    case "logout":
      return {
        ...state,
        user: null,
        channels: null,
        healthList: null,
        allUsers: [],
        usageData: null,
      };
    case "setlogin":
      return {
        ...state,
        user: payload,
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
    default:
      return state;
  }
};

export default AppReducer;
