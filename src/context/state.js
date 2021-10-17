import { useReducer } from "react";
import AppReducer from "./reducer";
import AppContext from "./context";
import { initialState } from "./reducer";

const AppState = (props) => {
  const [state, dispatch] = useReducer(AppReducer, initialState);

  return (
    <AppContext.Provider
      value={{
        store: state,
        dispatch,
      }}
    >
      {props.children}
    </AppContext.Provider>
  );
};

export default AppState;
