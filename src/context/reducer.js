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
        superAdmin: false,
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
    case "superadmin":
      console.log("Super admin logged in");
      return {
        ...state,
        superAdmin: true,
      };
    default:
      return state;
  }
};

export default AppReducer;
