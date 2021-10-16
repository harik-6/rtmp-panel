import React, { useContext, useState, useEffect } from "react";
import styled from "styled-components";
import AppContext from "../../context/context";

// mui-components
import Button from "@mui/material/Button";
import AddIcon from "@mui/icons-material/Add";

// components
import Preloader from "../../components/Preloader";
import UtilDiv from "../../components/Utildiv";
import Usercard from "./Usercard";
import CreateNewUser from "../../components/User/Createuser";

// services
import {
  getAllUsers,
  deleteUser,
  promoteDemoteAdmin,
} from "../../service/user.service";

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
    console.log("user",user);
    let usrs = await getAllUsers(user);
    usrs.sort((a, b) => a.username.localeCompare(b.username));
    setUsers(usrs);
    setLoading(false);
  };

  const _changeAdminStatus = async (_u) => {
    const us = await promoteDemoteAdmin(user, _u.admin, _u.token);
    if (us !== null) {
      _loadUsers();
    }
  };

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
            showAdmin={user.usertype === "s"}
            onChangeAdmin={() => _changeAdminStatus(u)}
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
