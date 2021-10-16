import React, { useState, useContext, useEffect } from "react";
import styled from "styled-components";
import { useHistory } from "react-router-dom";
import AppConext from "../../context/context";
import CacheService from "../../service/cache.service";
import Actions from "../../context/actions";

// mui
import CircularProgress from "@mui/material/CircularProgress";
import Button from "@mui/material/Button";
import InputAdornment from "@mui/material/InputAdornment";
import EyeOn from "@mui/icons-material/Visibility";
import EyeOff from "@mui/icons-material/VisibilityOff";
import LockIcon from "@mui/icons-material/Lock";

// components
import TxtField from "../../components/TxtField";
// services
import { getUser } from "../../service/user.service";
import { getApp } from "./login.config";

// styled
const LoginPage = styled.div`
  height: 100%;
  display: flex;
  flex-direction: row;
`;

const Left = styled.div`
  flex: 1;
  // overflow-x: hidden;
  // position: relative;
`;

const Content = styled.div`
  height: 100%;
  background-color: rgba(5, 15, 102, 0.5);
  color: #ffffff;
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding-left: 32px;
`;

const Name = styled.p`
  font-weight: bold;
  font-size: 80px;
  margin-top: -32px;
`;

const Desc = styled.p`
  font-size: 22px;
  margin-bottom: 8px;
`;

const Right = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
  background-color: rgba(5, 15, 102, 0.5);
`;

const LoginDiv = styled.div`
  width: 50%;
  margin: auto;
  padding: 24px 16px;
  background-color: #ffffff;
  border-radius: 16px;
`;

const InputArea = styled.div`
  margin: 16px 0;
`;

const Centerp = styled.p`
  text-align: center;
  font-size: 16px;
  margin-bottom: 4px;
`;

const Login = () => {
  const history = useHistory();

  // store varibles
  const {
    dispatch,
    store: { appDesc, appName },
  } = useContext(AppConext);

  // state variables
  const [_app, setApp] = useState({
    name: "",
    phone: "",
  });
  const [username, setusername] = useState("");
  const [password, setpassword] = useState("");
  const [logingin, setloginin] = useState(false);
  const [error, seterror] = useState(false);
  const [showPass, setShowPass] = useState(false);

  const handleusername = (e) => {
    setusername(e.target.value);
  };

  const handlepass = (e) => {
    setpassword(e.target.value);
  };

  const _loginUser = async () => {
    if (username.length > 0 && password.length > 0) {
      setloginin(true);
      CacheService.clear();
      const user = await getUser(username, password);
      if (user === null) {
        setloginin(false);
        seterror(true);
        return;
      } else {
        dispatch({
          type: Actions.SET_USER,
          payload: user,
        });
        history.push("/");
      }
    }
  };

  const togglePassword = () => {
    setShowPass(!showPass);
  };

  const _setAppName = () => {
    const location = window.location.href;
    const _a = getApp(location);
    setApp(_a);
    dispatch({
      type: Actions.SET_APPNAME,
      payload: _a,
    });
  };

  useEffect(() => {
    _setAppName();
  }, []);

  return (
    <>
      <LoginPage>
        <Left>
          <Content>
            <Name>{_app.name}</Name>
            <Desc>Dedicated streaming service provider.</Desc>
            <Desc>For contact {_app.phone}.</Desc>
          </Content>
          <Waves />
        </Left>
        <Right>
          <LoginDiv>
            <Centerp
              style={{
                fontWeight: "bold",
              }}
            >
              Welcome back
            </Centerp>
            <Centerp>Login to continue</Centerp>
            <Centerp>
              <LockIcon color="primary" fontSize="large" />
            </Centerp>
            <InputArea>
              {error && (
                <p style={{ color: "red" }}>Username or Password incorrect.</p>
              )}
              <TxtField
                variant="outlined"
                id="username"
                label="Username"
                value={username}
                onChange={handleusername}
              />
              <TxtField
                variant="outlined"
                id="password"
                label="Password"
                type={showPass ? "text" : "password"}
                value={password}
                onChange={handlepass}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      {!showPass ? (
                        <EyeOff onClick={togglePassword} />
                      ) : (
                        <EyeOn onClick={togglePassword} />
                      )}
                    </InputAdornment>
                  ),
                }}
              />
            </InputArea>
            <Centerp>
              {logingin ? (
                <CircularProgress />
              ) : (
                <Button
                  onClick={_loginUser}
                  variant="contained"
                  color="primary"
                  disableElevation
                >
                  Login
                </Button>
              )}
            </Centerp>
            <Centerp
              style={{
                marginTop: "16px",
                opacity: "0.6",
              }}
            >
              &copy; {_app.name.toLowerCase()}
            </Centerp>
          </LoginDiv>
        </Right>
      </LoginPage>
    </>
  );
};

const Waves = () => {
  return (
    <div className="custom-shape-divider-bottom-1634380490">
      <svg
        data-name="Layer 1"
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 1200 120"
        preserveAspectRatio="none"
      >
        <path
          d="M0,0V46.29c47.79,22.2,103.59,32.17,158,28,70.36-5.37,136.33-33.31,206.8-37.5C438.64,32.43,512.34,53.67,583,72.05c69.27,18,138.3,24.88,209.4,13.08,36.15-6,69.85-17.84,104.45-29.34C989.49,25,1113-14.29,1200,52.47V0Z"
          opacity=".25"
          className="shape-fill"
        ></path>
        <path
          d="M0,0V15.81C13,36.92,27.64,56.86,47.69,72.05,99.41,111.27,165,111,224.58,91.58c31.15-10.15,60.09-26.07,89.67-39.8,40.92-19,84.73-46,130.83-49.67,36.26-2.85,70.9,9.42,98.6,31.56,31.77,25.39,62.32,62,103.63,73,40.44,10.79,81.35-6.69,119.13-24.28s75.16-39,116.92-43.05c59.73-5.85,113.28,22.88,168.9,38.84,30.2,8.66,59,6.17,87.09-7.5,22.43-10.89,48-26.93,60.65-49.24V0Z"
          opacity=".5"
          className="shape-fill"
        ></path>
        <path
          d="M0,0V5.63C149.93,59,314.09,71.32,475.83,42.57c43-7.64,84.23-20.12,127.61-26.46,59-8.63,112.48,12.24,165.56,35.4C827.93,77.22,886,95.24,951.2,90c86.53-7,172.46-45.71,248.8-84.81V0Z"
          className="shape-fill"
        ></path>
      </svg>
    </div>
  );
};

export default Login;
