import React, { useContext, useEffect } from "react";
import styled from "styled-components";
import AppContext from "../../context/context";

// mui
import Avatar from "@mui/material/Avatar";
import Constants from "../../constants";
import TxtField from "../../components/TxtField";
import Button from "@mui/material/Button";

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
  const { store } = useContext(AppContext);
  const { user, users, channels, servers } = store;
  console.log(user);
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
        />
        <TxtField
          id="server"
          label="Server"
          name="server"
          value={user.server}
        />
        {/* <TxtField
          id="limit"
          label="Limit"
          name="limit"
          value={user.limit}
        /> */}
        <TxtField id="phone" label="Phone" name="phone" value={user.phone} />
        <TxtField id="email" label="Email" name="email" value={user.email} />
        <Button
          variant="contained"
          color="primary"
          disableElevation
          sx={{ width: 100, marginLeft: "auto" }}
        >
          Save
        </Button>
      </ProfileDetails>
    </UserProfile>
  );
};

export default Profile;
