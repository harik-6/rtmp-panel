const AppReducer = (state, action) => {
  switch (action.type) {
    case "logout":
      return {
        ...state,
        user: null,
        channels: [],
      };
    case "setlogin":
      return {
        ...state,
        user: action.payload,
      };
    case "setchannels":
      return {
        ...state,
        channels: action.payload,
      };
    case "sethealth":
      return {
        ...state,
        healthList: action.payload,
      };
    default:
      return state;
  }
};

export default AppReducer;
