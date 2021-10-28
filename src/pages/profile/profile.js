import React, { useContext, useEffect, useState } from "react";
import styled from "styled-components";
import AppContext from "../../context/context";
import Actions from "../../context/actions";

// mui
import Avatar from "@mui/material/Avatar";
import Constants from "../../constants";
import TxtField from "../../components/TxtField";
import Button from "@mui/material/Button";

// services
import { editUserPersonalDetails } from "../../service/user.service";
import { CircularProgress } from "@mui/material";

// styled
const UserProfile = styled.div`
  padding: 0 32px;
  display: flex;
  flex-direction: row;
  gap: 16px;
`;

const ProfileStat = styled.div`
  width: 250px;
  background-color: #ffffff;
  padding: 8px;
  border-radius: 8px;
`;

const CountDiv = styled.div`
  font-size: 18px;
  margin: 24px 0;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
`;

const ProfileDetails = styled.div`
  flex: 1;
  background-color: #ffffff;
  padding: 16px 64px;
  display: flex;
  flex-direction: column;
  gap: 18px;
  border-radius: 16px;
`;

const Name = styled.p`
  text-align: center;
  margin: 16px 0;
`;

const Profile = () => {
  // store variable
  const { store, dispatch } = useContext(AppContext);
  const { user, users, channels, servers } = store;

  //state variables
  const [phone, setPhone] = useState(user.phone);
  const [email, setEmail] = useState(user.email);
  const [loading, setLoading] = useState(false);

  const _editUser = async () => {
    setLoading(true);
    const payload = {
      ...user,
      phone,
      email,
    };
    const edited = await editUserPersonalDetails(payload);
    if (edited !== null) {
      dispatch({
        type: Actions.SET_USER,
        payload,
      });
    } else {
      dispatch({
        type: Actions.SHOW_ALERT,
        payload: {
          type: Constants.alert_error,
          message: "Server error",
        },
      });
    }
    setLoading(false);
  };

  useEffect(() => {}, [channels, servers, users, user]);

  // const avatarUrl = `https://avatars.dicebear.com/api/botts/${user.username}.svg`;

  return (
    <UserProfile>
      <ProfileStat>
        <Avatar
          alt={user.username}
          src="https://avatars.dicebear.com/api/bottts/test.svg"
          variant="rounded"
          sx={{
            width: 100,
            height: 100,
            margin: "8px auto",
            background: Constants.background_color,
          }}
        />
        <Name>{user.username}</Name>
        <Name>{user.admin ? "admin" : "user"}</Name>
        <CountDiv>
          <p>Channels </p>
          <p>{channels.length}</p>
        </CountDiv>
        <CountDiv>
          <p>Servers </p>
          <p>{servers.length}</p>
        </CountDiv>
        {user.usertype !== "u" && (
          <CountDiv>
            <p>Users </p>
            <p>{users.length}</p>
          </CountDiv>
        )}
      </ProfileStat>
      <ProfileDetails>
        <TxtField
          id="username"
          label="Name"
          name="username"
          value={user.username}
          disabled={true}
        />
        <TxtField
          id="server"
          label="Server"
          name="server"
          value={user.server}
          disabled={true}
        />
        {/* <TxtField
          id="limit"
          label="Limit"
          name="limit"
          value={user.limit}
        /> */}
        <TxtField
          id="phone"
          label="Phone"
          name="phone"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          max={10}
          disabled={loading}
        />
        <TxtField
          id="email"
          label="Email"
          name="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          disabled={loading}
        />
        {loading ? (
          <CircularProgress sx={{ margin: "auto" }} />
        ) : (
          <Button
            variant="contained"
            color="primary"
            disableElevation
            sx={{ width: 100, margin: "auto" }}
            onClick={_editUser}
          >
            Save
          </Button>
        )}
      </ProfileDetails>
    </UserProfile>
  );
};

export default Profile;
