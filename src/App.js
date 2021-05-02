import React, { useState } from "react";
import "./App.scss";
import Main from "./pages/main";
import firebase from "firebase";
import Login from "./pages/login";

var firebaseConfig = {
  apiKey: "AIzaSyBA3ppvW8obmP_2j_-hkAQUg5F2JqBcMfM",
  authDomain: "rtmp-20210502.firebaseapp.com",
  projectId: "rtmp-20210502",
  storageBucket: "rtmp-20210502.appspot.com",
  messagingSenderId: "960062588255",
  appId: "1:960062588255:web:df73df59638b0424e662ea",
};

if (firebase.apps.length === 0) {
  console.log("Firebase initialized");
  firebase.initializeApp(firebaseConfig);
}

function App() {
  const [isloggedIn, setloginStatus] = useState(false);

  const changeLoginStatus = (status) => {
    setloginStatus(status);
  };
  return (
    <div className="app-main">
      {isloggedIn ? <Main /> : <Login loginCallback={changeLoginStatus} />}
    </div>
  );
}

export default App;
