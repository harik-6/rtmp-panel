const AppReducer = (state, action) => {
  switch (action.type) {
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
    default:
      return state;
  }
};

export default AppReducer;
