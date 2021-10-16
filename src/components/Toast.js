import React from "react";
import AppContext from "../context/context";
import AppActions from "../context/actions";

// mui
import Snackbar from "@mui/material/Snackbar";
import MuiAlert from "@mui/material/Alert";

const Toast = () => {
  // store variabes
  const { store, dispatch } = React.useContext(AppContext);
  const { alert } = store;

  const _onClose = () => {
    dispatch({
      type: AppActions.HIDE_ALERT,
    });
  };

  return (
    <Snackbar
      anchorOrigin={{ vertical: "top", horizontal: "center" }}
      open={alert.show}
      autoHideDuration={4000}
      onClose={_onClose}
    >
      <MuiAlert
        variant="filled"
        onClose={_onClose}
        severity={alert.type}
        sx={{ width: "100%" }}
      >
        {alert.message}
      </MuiAlert>
    </Snackbar>
  );
};

export default Toast;
