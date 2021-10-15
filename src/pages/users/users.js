import React, { useContext, useState, useEffect } from "react";
import styled from "styled-components";
import AppContext from "../../context/context";

// mui-components
import Button from "@mui/material/Button";
import AddIcon from "@mui/icons-material/Add";

// components
import Preloader from "../../components/preloader";
import UtilDiv from "../../components/Utildiv";
import Usercard from "./Usercard";

// services
import { getAllUsers, deleteUser } from "../../service/user.service";
import CreateNewUser from "../../components/Createuser";

// styled
const UsersListDiv = styled.div`
  display: flex;
  flex-direction: row;
  gap: 16px;
  flex-wrap: wrap;
  justify-content: space-around;
`;

const Users = () => {
  // store variabled
  const { store } = useContext(AppContext);
  const { user } = store;

  // stat variabled
  const [_users, setUsers] = useState([]);
  const [_loading, setLoading] = useState(false);
  const [_opencreate, setOpencreate] = useState(false);

  const _loadUsers = async () => {
    setLoading(true);
    let usrs = await getAllUsers(user);
    usrs.sort((a, b) => a.username.localeCompare(b.username));
    console.log(usrs);
    setUsers(usrs);
    setLoading(false);
  };

  // const changeAdminStatus = async (usertochange) => {
  //   const us = await userservice.promoteDemoteAdmin(
  //     user,
  //     usertochange.admin,
  //     usertochange.token
  //   );
  //   if (us !== null) {
  //     loadAllUsers();
  //   }
  // };

  const _deleteUser = async (_u) => {
    setLoading(true);
    await deleteUser(user, _u);
    _loadUsers();
  };

  useEffect(() => {
    _loadUsers();
    //eslint-disable-next-line
  }, []);

  if (_loading) {
    return <Preloader message={"Loading users..."} />;
  }

  return (
    <div>
      <UtilDiv>
        <p></p>
        <Button
          sx={{ marginLeft: "16px" }}
          size="small"
          variant="contained"
          endIcon={<AddIcon />}
          onClick={() => setOpencreate(true)}
        >
          New User
        </Button>
      </UtilDiv>
      <UsersListDiv>
        {_users.map((u, index) => (
          <Usercard
            key={index + "-" + u.username}
            user={u}
            callback={() => _loadUsers()}
            onDelete={() => _deleteUser(u)}
          />
        ))}
      </UsersListDiv>
      <CreateNewUser
        open={_opencreate}
        onClose={() => setOpencreate(false)}
        callback={() => _loadUsers()}
      />
    </div>
  );
};

export default Users;
