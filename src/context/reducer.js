const AppReducer = (state, action) => {
  const { type,payload } = action;
  switch (type) {
    case "logout":
      return {
        ...state,
        user: null,
        channels: [],
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
        allUsers : payload,
      }
    default:
      return state;
  }
};

export default AppReducer;
